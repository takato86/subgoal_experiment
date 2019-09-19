
Env.action_id;
Env.clickable_states = []
Participant.sub_goals = []
let playButtons = document.getElementsByClassName("play_button");
let showed_array = [];

let rateHighButton = document.getElementById("rate-highly");
let rateLowerButton = document.getElementById("rate-lower");

// rateHighButton.addEventListener("click", rateHighly);
// rateLowerButton.addEventListener("click", rateLower);
canvas.addEventListener("click", clickOnCanvas, false);

function click_play_button(event){
    let play_button = event.target;
    Env.play_id = parseInt(play_button.getAttribute("value"))
    if(Env.play_id == null || Env.play_id == -1){
        console.log("task id is null.")
        return;
    }
    getActionHistory(Env.play_id);
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
    start_state = restore_state(Player.history[0]);
    init_render(); //Mainの中でそれぞれ定義
    start(start_state);
}

function replay(interval=1000){
    // リプレイ，１秒ごとに更新
    let counter = 0;
    let log;
    clearInterval(repeat)
    repeat = setInterval(function(){
        if(counter >= Player.history.length){
            clearInterval(repeat);
            window.alert("Replay ended.")
            render_trajectory();
            return;
        }
        log = Player.history[counter];
        Env.action_id = log["id"];
        step(parseInt(log["actual_action"]));
        render_with_trajectory();
        counter++;
    }, interval);
}

for(i = 0; i<playButtons.length; i++){
    playButtons[i].addEventListener("click", click_play_button);
}

function rateHighly(){
    postEvalLog(Env.play_id, Env.action_id, 1);
}

function rateLower(){
    postEvalLog(Env.play_id, Env.action_id, -1);
}

function clickOnCanvas(e){
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let cell_x = Math.floor(x / cell_width);
    let cell_y = Math.floor(y / cell_height);
    const state = tostate[cell_y][cell_x];
    // 軌跡の上でないといけない。
    // 一度クリックした状態をクリックすると白くなる。
    const history_index = Env.clickable_states.indexOf(state);
    if(history_index > 0){
        const subgoal_index = Participant.sub_goals.indexOf(state);
        if(subgoal_index >= 0){
            Participant.sub_goals.splice(subgoal_index, 1);
            const actual_action = Player.history[history_index]["actual_action"];
            const direction = get_act_direct(parseInt(actual_action));
            draw_cell_with_border_and_text(cell_x, cell_y, 'lightgray', direction);
        }else if(Participant.sub_goals.length < 2){
            Participant.sub_goals.push(state);
            draw_cell_with_border(cell_x, cell_y, "coral");
        }
    }
}


init_play_buttons();