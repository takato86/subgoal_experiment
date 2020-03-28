
window.addEventListener('load', ()=>{
    cookies = new Map(getCookie());
    if(cookies.has("task_id")){
        Participant.task_id = Number(cookies.get("task_id"));
    }
    check_status();
    start();
});
window.addEventListener('resize', ()=>{
    Env.screen_height = window.innerWidth * 0.35;
    Env.screen_width = window.innerWidth * 0.35;
    canvas.screen_width = Env.screen_width;
    canvas.screen_height = Env.screen_height;
    start();
});
let nextButton = document.querySelector('#next_button');
nextButton.addEventListener('click', click_next);

Participant.subgoals = [];
Participant.task_id = 1;
Participant.get_subgoal = (pos_x, pos_y, rad) => {
    for(subgoal of Participant.subgoals){
        if(subgoal.is_in(pos_x, pos_y, rad)){
            return subgoal;
        }
    }
    return false;
}
Participant.to_dict = () => {
    let dict = {};
    dict.task_id = Participant.task_id;
    dict.user_id = Participant.user_id;
    dict.subgoals = []
    Participant.subgoals.forEach((value, index) => {
        let subgoal_dict = value.to_dict();
        subgoal_dict.order = index;
        dict.subgoals.push(subgoal_dict)
    });
    return dict;
}
canvas.width = Env.screen_width;
canvas.height = Env.screen_height;


function start(){
    let n_subgoals_span = document.querySelector("#n_subgoals");
    let task_id = document.querySelector("#task_id");
    n_subgoals_span.textContent = String(Env.tasks[Participant.task_id].n_subgoals);
    task_id.textContent = String(Participant.task_id)
    init();
    render();
    render_subgoals();
    canvas.addEventListener("click", click_on_canvas, false);
}

function click_next(){
    if(Participant.subgoals.length == Env.tasks[Participant.task_id].n_subgoals){
        const result = confirm('この内容でサブゴール情報を登録しますか？');
        if(result){
            post_subgoals();
            next_task();
        }
    }else{
        alert("サブゴールは" + Env.tasks[Participant.task_id].n_subgoals + "箇所に設定してください．");
    }   
}

function is_completed(){
    return !Boolean(Env.tasks[Participant.task_id]);
}

function post_subgoals(){
    url = "/api/v1/pinball/subgoals";
    const method = 'POST';
    const body = JSON.stringify(Participant.to_dict());
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
    };
    fetch(url, {method, headers, body})
        .then(response => {
            console.log(response.status);
            if(!response.ok){
                console.error("エラーレスポンス", response);
            }
        }).catch(error => {
            console.error(error);
        });   
}

function click_on_canvas(event){
    console.info("offset: " + event.offsetX, event.offsetY);
    console.info("screen: " + Env.screen_width, Env.screen_width);
    let x = (event.offsetX)/Env.screen_width;
    let y = 1 - event.offsetY/Env.screen_height;
    console.info("x, y: " + x, y);
    console.info("------------------------------------");
    let subgoal = Participant.get_subgoal(x, y, Env.subgoal_rad);
    if(subgoal){
        let index = Participant.subgoals.indexOf(subgoal);
        Participant.subgoals.splice(index, 1);
    }else{
        if(Participant.subgoals.length < Env.tasks[Participant.task_id].n_subgoals){
            Participant.subgoals.push(new Subgoal(x, y, Env.subgoal_rad));
        }
    }
    render();
    render_subgoals();
}
