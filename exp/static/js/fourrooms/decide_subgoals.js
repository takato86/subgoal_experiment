Participant.subgoals = []
Participant.task_id = 1
let completeButton = document.getElementById("complete_button");



window.addEventListener("load", function(){
    cookies = new Map(getCookie());
    if(cookies.has("task_id")){
        Participant.task_id = Number(cookies.get("task_id"));
    }
    check_status();
    start();
});

window.addEventListener("resize", function(){
    console.info("before" + Env.cell_height, Env.cell_width);
    Env.cell_height = Math.floor(window.innerHeight / 1.5 / Env.height);
    Env.cell_width = Math.floor(window.innerHeight / 1.5 / Env.width);
    console.info("after" + Env.cell_height, Env.cell_width);
    render();
});

completeButton.addEventListener("click", click_send);
canvas.addEventListener("click", click_on_canvas);

function start(){
    let n_subgoals_span = document.querySelector("#n_subgoals");
    let task_id = document.querySelector("#task_id");
    n_subgoals_span.textContent = String(Env.tasks[Participant.task_id].n_subgoals);
    task_id.textContent = String(Participant.task_id)
    init();
    render();
}

function post_subgoals(subgoals){
    const request = new XMLHttpRequest();
    let data = {"subgoals":[],
                "task_id": Participant.task_id,
                "user_id": Participant.user_id,
               };
    subgoals.forEach((value, index) => {
        data["subgoals"].push({"state": value, "order": index});
    });
    request.open("POST", "/api/v1/fourrooms/subgoals");
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

function click_send(e){
    if(Participant.subgoals.length == Env.tasks[Participant.task_id].n_subgoals){
        const result = confirm("この内容でサブゴール情報を登録しますか？");
        if(result){
            post_subgoals(Participant.subgoals);
            next_task();
        }
    }else{
        alert("サブゴールは" + Env.tasks[Participant.task_id].n_subgoals + "箇所に設定してください．");
    }
}

function is_finished(){
    return !Boolean(Env.tasks[Participant.task_id]);
}

function click_on_canvas(e){
    let cell_x = Math.floor(e.offsetX / Env.cell_width);
    let cell_y = Math.floor(e.offsetY / Env.cell_height);
    const state = Env.tostate[cell_y][cell_x];
    const subgoal_index = Participant.subgoals.indexOf(state);
    if(state == Env.tasks[Participant.task_id].start){
        return;
    }else if(state == Env.tasks[Participant.task_id].goal){
        return;
    }else if(Env.occupancy[cell_y][cell_x]!=0){
        return;
    }
    if(subgoal_index >= 0){
        Participant.subgoals.splice(subgoal_index, 1);
    }else if(Participant.subgoals.length < Env.tasks[Participant.task_id].n_subgoals){
        Participant.subgoals.push(state);
    }
    render();
}


function is_completed(){
    return !Boolean(Env.tasks[Participant.task_id]);
}