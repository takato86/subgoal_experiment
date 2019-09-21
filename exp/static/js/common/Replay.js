
Env.action_id;
Env.clickable_states = []
Participant.sub_goals = []
let playButton = document.getElementById("playButton");
let showed_array = [];

// let rateHighButton = document.getElementById("rate-highly");
// let rateLowerButton = document.getElementById("rate-lower");
let completeButton = document.getElementById("complete_button");
// rateHighButton.addEventListener("click", rateHighly);
// rateLowerButton.addEventListener("click", rateLower);
playButton.addEventListener("click", click_play_button, false);
window.addEventListener("load", update_status);


function update_status(){
    const check_icon = '<span class="uk-margin-small-right" uk-icon="check"></span>';
    let trajectory_ids = document.getElementsByName("trajectory");
    let trajectory_id, existing_text, complete_trajectory_id;
    for(let i=0; i<trajectory_ids.length; i++){
        trajectory_id = trajectory_ids[i];
        complete_trajectory_id = get_trajectory_id() - 1;
        if(complete_trajectory_id >= parseInt(trajectory_id.getAttribute("value")) || complete_trajectory_id <= -1){
            existing_text = trajectory_id.innerHTML;
            if(existing_text.indexOf('uk-icon="check"') == -1){
                trajectory_id.innerHTML = check_icon + existing_text;
            }
        }
    }
    change_play_button_display();
}

function get_trajectory_id(){
    const complete_trajectory_id = window.sessionStorage.getItem(['trajectory_id']);
    const trajectory_ids = document.getElementsByName("trajectory");
    if(complete_trajectory_id == null){
        return 1;
    }else if(parseInt(complete_trajectory_id) >= trajectory_ids.length){
        return -1;
    }else{
        return parseInt(complete_trajectory_id) + 1;
    }
}

function change_play_button_display(){
    const complete_trajectory_id = window.sessionStorage.getItem(['trajectory_id']);
    const trajectory_ids = document.getElementsByName("trajectory");
    if(parseInt(complete_trajectory_id) == trajectory_ids.length){
        playButton.textContent = "Complete";
    }
}

function　start_replay(request){
    const json = request.response;
    Env.clickable_states = json.trajectory.map(x=>x['state1']);
    Env.goal = json.goal;
    Player.action_history = json.trajectory;
    const trajectory = json.trajectory;
    // 再生開始
    init_replay(trajectory[0]["state1"]);
    if(Env.task_id==1){
        replay(trajectory, 1000);
    }
    if(Env.task_id==2){
        replay(trajectory, 50);
    }
}

function click_play_button(event){
    trajectory_id = get_trajectory_id();
    if(trajectory_id == -1){
        window.location.href = '/exp/end';
    }else{
        event.target.style.display = 'none';
        getTrajectory(trajectory_id, start_replay);
    }
}

function init_replay(start_state){
    // リプレイの初期化
    init_variables(); // Mainの中でそれぞれ定義
    // start_state = restore_state(start);
    init_render(); //Mainの中でそれぞれ定義
    start(start_state);
}

function replay(trajectory, interval=1000){
    // リプレイ，１秒ごとに更新
    let counter = 0;
    let log;
    clearInterval(repeat)
    repeat = setInterval(function(){
        if(counter >= trajectory.length){
            clearInterval(repeat);
            canvas.addEventListener("click", clickOnCanvas, false);
            completeButton.addEventListener("click", clickSend, false);
            render_trajectory(trajectory);
            return;
        }
        log = trajectory[counter];
        Env.action_id = log["id"];
        step(parseInt(log["actual_action"]));
        render_with_trajectory();
        counter++;
    }, interval);
}

function rateHighly(){
    postEvalLog(Env.play_id, Env.action_id, 1);
}

function rateLower(){
    postEvalLog(Env.play_id, Env.action_id, -1);
}

function clickSend(e){
    if(Participant.sub_goals.length == 2){
        trajectory_id = get_trajectory_id();
        postSubGoals(trajectory_id, Participant.sub_goals);
        window.sessionStorage.setItem(['trajectory_id'], [trajectory_id]);
        const result = confirm("この内容でサブゴール情報を登録しますか？");
        if(result){
            write_console("サブゴール情報を登録しました．");
            next_task();
        }
    }else{
        write_console("サブゴールは2箇所に設定してください．");
    }
}

function next_task(){
    playButton.style.display = 'block';
    change_play_button_display();
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.removeEventListener("click", clickOnCanvas, false);
    completeButton.removeEventListener("click", clickSend, false);
    Participant.sub_goals = [];
    write_console("");
    update_status()
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
            const actual_action = Player.action_history[history_index]["actual_action"];
            const direction = get_act_direct(parseInt(actual_action));
            draw_cell_with_border_and_text(cell_x, cell_y, 'lightgray', direction);
        }else if(Participant.sub_goals.length < 2){
            Participant.sub_goals.push(state);
            draw_cell_with_border(cell_x, cell_y, "coral");
        }
    }
}




// init_play_buttons();