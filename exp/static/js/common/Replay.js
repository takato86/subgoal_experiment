let playButtons = document.getElementsByClassName("play_button");
let action_id = 0;

let rateHighButton = document.getElementById("rate-highly");
let rateLowerButton = document.getElementById("rate-lower");

rateHighButton.addEventListener("click", rateHighly);
rateLowerButton.addEventListener("click", rateLower);

function click_play_button(event){
    play_id = parseInt(event.target.getAttribute("value"))
    if(play_id == null || play_id == -1){
        console.log("task id is null.")
        return;
    }
    getActionHistory(play_id);
}

function init_replay(){
    // リプレイの初期化
    init_variables(); // Mainの中でそれぞれ定義
    start_state = restore_state(history[0]);
    init_render(); //Mainの中でそれぞれ定義
    start(start_state);
}

function replay(interval=1000){
    // リプレイ，１秒ごとに更新
    let counter = 0;
    let log;
    clearInterval(repeat)
    repeat = setInterval(function(){
        if(counter >= history.length){
            clearInterval(repeat);
            window.alert("Replay ended.")
            return;
        }
        log = history[counter];
        action_id = log["id"];
        step(parseInt(log["actual_action"]));
        render();
        counter++;
    }, interval);
}

for(i = 0; i<playButtons.length; i++){
    playButtons[i].addEventListener("click", click_play_button);
}
