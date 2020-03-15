let Participant = {
    sub_goals: []
}
let playButton = document.getElementById("playButton");
let completeButton = document.getElementById("complete_button");

Env.clickable_states = []
Env.n_subgoals = 2;
Env.task_info = document.getElementById("task")
Env.task_id = parseInt(Env.task_info.dataset.taskid);

playButton.addEventListener("click", click_play_button, false);

window.addEventListener("load", function(){
    const cookies = new Map(getCookie("complete_task"));
    if(cookies.has("complete_task")){
        Participant.complete_task = Boolean(cookies.get("complete_task"));
    }else{
        Participant.complete_task = false;
    }
    update_status();
})

function init_task(){
    init_variables();
    init_render();
    Env.goal = 103;
    start(0);
}

function next_task(){
    playButton.style.display = 'block';
    canvas.removeEventListener("click", clickOnCanvas, false);
    completeButton.removeEventListener("click", clickSend, false);
    Participant.complete_task = true;
    update_status();
    context.clearRect(0, 0, canvas.width, canvas.height);
    Participant.sub_goals = [];
    write_console("");
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
                "task_id": Env.task_id,
                "user_id": Env.user_id,
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
    request.setRequestHeader('X-CSRFToken', Env.csrftoken);
    request.setRequestHeader("Content-Type", "application/json")
    request.send(JSON.stringify(data));
}


function clickSend(e){
    if(Participant.sub_goals.length == Env.n_subgoals){
        const result = confirm("この内容でサブゴール情報を登録しますか？");
        if(result){
            postSubGoals(Participant.sub_goals);
            setCookie("complete_task", Participant.complete_task);
            next_task();
        }
    }else{
        alert("サブゴールは" + Env.n_subgoals + "箇所に設定してください．");
    }
}


function clickOnCanvas(e){
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let cell_x = Math.floor(x / cell_width);
    let cell_y = Math.floor(y / cell_height);
    const state = tostate[cell_y][cell_x];
    const subgoal_index = Participant.sub_goals.indexOf(state);
    if(state == Env.start){
        return;
    }else if(state == Env.goal){
        return;
    }else if(Env.occupancy[cell_y][cell_x]!=0){
        return;
    }
    if(subgoal_index >= 0){
        Participant.sub_goals.splice(subgoal_index, 1);
        draw_cell_with_border(cell_x, cell_y, "white");
    }else if(Participant.sub_goals.length < Env.n_subgoals){
        Participant.sub_goals.push(state);
        draw_cell_with_border(cell_x, cell_y, "coral");
    }
}


function write_console(text){
    let log_console = document.getElementById('log_console');
    log_console.textContent = text;
}

function update_status(){
    if(Participant.complete_task){
        playButton.textContent = "Complete";
    }
}