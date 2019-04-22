let playButtons = document.getElementsByClassName("play_button");
let action_id = 0;
let showed_array = [];

let rateHighButton = document.getElementById("rate-highly");
let rateLowerButton = document.getElementById("rate-lower");

rateHighButton.addEventListener("click", rateHighly);
rateLowerButton.addEventListener("click", rateLower);

function click_play_button(event){
    let play_button = event.target;
    play_id = parseInt(play_button.getAttribute("value"))
    if(play_id == null || play_id == -1){
        console.log("task id is null.")
        return;
    }
    getActionHistory(play_id);
    play_button.style.display = "none";
    // TODO ↓の判定がイケてない
    for(let play_button of playButtons){
        if(showed_array.indexOf(parseInt(play_button.getAttribute("value"))) == -1){
            play_button.style.display = "";
            showed_array.push(parseInt(play_button.getAttribute("value")));
            break;
        }
    }
}

function init_play_buttons(){
    for(let i=0; i<3; i++){
        // TODO jsはobjectの判定ができるか？
        showed_array.push(parseInt(playButtons[i].getAttribute("value")));
    }
    if(playButtons.length > 3){
        for(let i=3; i<playButtons.length; i++){
            playButtons[i].style.display = "none";
        }
    }
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


init_play_buttons();