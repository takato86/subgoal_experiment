Participant.sub_goals = []
Participant.task_id = 1
let playButton = document.getElementById("playButton");
let completeButton = document.getElementById("complete_button");

Env.clickable_states = [];
Env.n_subgoals = 2;
Env.tasks = {
    1: {
        n_subgoals: 2,
        start: 0,
        goal: 103
    },
    2: {
        n_subgoals: 4,
        start: 0,
        goal: 103
    }
}

playButton.addEventListener("click", click_play_button, false);

window.addEventListener("load", function(){
    const cookies = new Map(getCookie("complete_task"));
    if(cookies.has("complete_task")){
        Participant.complete_task = Boolean(cookies.get("complete_task"));
    }else{
        Participant.complete_task = false;
    }
    update_status();
});

function init_task(){
    init_variables();
    init_render();
    start(Env.tasks[Participant.task_id].start);
}

function start(start_state=null){
    let s_y, s_x, g_y, g_x;
    if(start_state != null){
        Env.tasks[Participant.task_id].start = start_state;
    }else{
        let g_index = Math.floor(Math.random() * possible_next_goals.length);
        Env.tasks[Participant.task_id].goal = possible_next_goals[g_index];
        do{
             Env.tasks[Participant.task_id].start = Math.floor(Math.random() * n_states);
        }while(Env.tasks[Participant.task_id].start == Env.tasks[Participant.task_id].goal);    
    }
    [s_y, s_x] = tocell(Env.tasks[Participant.task_id].start);
    [g_y, g_x] = tocell(Env.tasks[Participant.task_id].goal);
    draw_cell_with_border_and_text(g_x, g_y, 'darkorange', 'G');
    draw_cell_with_border_and_text(s_x, s_y, 'royalblue', 'S');
}


function next_task(){
    playButton.style.display = 'block';
    canvas.removeEventListener("click", clickOnCanvas, false);
    completeButton.removeEventListener("click", clickSend, false);
    Participant.complete_task = is_finished()
    update_status();
    context.clearRect(0, 0, canvas.width, canvas.height);
    Participant.sub_goals = [];
}

function click_play_button(event){
    // playボタンを押す場合．
    if(Participant.complete_task){
        window.location.href = '/exp/end';
    }else{
        event.target.style.display = 'none';
        init_task();
        completeButton.addEventListener("click", clickSend, false);
        canvas.addEventListener("click", clickOnCanvas, false);
    }
}


function postSubGoals(subgoals){
    const request = new XMLHttpRequest();
    let data = {"subgoals":[],
                "task_id": Participant.task_id,
                "user_id": Participant.user_id,
               };
    for(let i=0; i<subgoals.length; i++){
        data["subgoals"].push({"state": subgoals[i]});
    }
    request.open("POST", "/api/v1/subgoals");
    request.addEventListener("error", ()=>{
        console.log("Network Error!");
    });
    request.addEventListener("load", (event)=>{
        if(event.target.status != 200){
            console.log(`Error: ${event.target.status}`);
            return
        }
        console.log(event.target.status);
        console.log(event.target.responseText);
    });
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.setRequestHeader("Content-Type", "application/json")
    request.send(JSON.stringify(data));
}


function clickSend(e){
    if(Participant.sub_goals.length == Env.tasks[Participant.task_id].n_subgoals){
        const result = confirm("この内容でサブゴール情報を登録しますか？");
        if(result){
            postSubGoals(Participant.sub_goals);
            Participant.task_id += 1
            if(is_finished()){
                setCookie("complete_task", Participant.complete_task);
            }
            next_task();
        }
    }else{
        alert("サブゴールは" + Env.tasks[Participant.task_id].n_subgoals + "箇所に設定してください．");
    }
}

function is_finished(){
    return !Boolean(Env.tasks[Participant.task_id]);
}

function clickOnCanvas(e){
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let cell_x = Math.floor(x / cell_width);
    let cell_y = Math.floor(y / cell_height);
    const state = tostate[cell_y][cell_x];
    const subgoal_index = Participant.sub_goals.indexOf(state);
    if(state == Env.tasks[Participant.task_id].start){
        return;
    }else if(state == Env.tasks[Participant.task_id].goal){
        return;
    }else if(Env.occupancy[cell_y][cell_x]!=0){
        return;
    }
    if(subgoal_index >= 0){
        Participant.sub_goals.splice(subgoal_index, 1);
        draw_cell_with_border(cell_x, cell_y, "white");
    }else if(Participant.sub_goals.length < Env.tasks[Participant.task_id].n_subgoals){
        Participant.sub_goals.push(state);
        draw_cell_with_border(cell_x, cell_y, "coral");
    }
}

function update_status(){
    if(Participant.complete_task){
        playButton.textContent = "Complete";
    }
}