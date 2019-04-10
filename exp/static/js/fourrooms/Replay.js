let history;
let playButtons = document.getElementsByClassName("play_button");

function click_play_button(event){
    let task_id = parseInt(event.target.getAttribute("value"));
    if(task_id == null){
        console.log("task id is null.")
        return;
    }
    getActionHistory(task_id);
}

function init_replay(){
    // リプレイの初期化
    init_variables();
    start_state = history[0]["state1"];
    init_render();
    start(start_state);
}

function replay(interval=1000){
    // リプレイ，１秒ごとに更新
    let counter = 0;
    let log;
    let repeat = setInterval(function(){
        if(counter >= history.length){
            clearInterval(repeat);
            return;
        }
        log = history[counter];
        step(parseInt(log["actual_action"]));
        render();
        counter++;
    }, interval);
}

for(i = 0; i<playButtons.length; i++){
    playButtons[i].addEventListener("click", click_play_button);
}
