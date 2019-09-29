
Env.action_id;
Env.clickable_states = []
Participant.sub_goals = []
let showed_array = [];

// let rateHighButton = document.getElementById("rate-highly");
// let rateLowerButton = document.getElementById("rate-lower");
// rateHighButton.addEventListener("click", rateHighly);
// rateLowerButton.addEventListener("click", rateLower);
window.addEventListener("load", update_status);


function update_status(){
    // 完了している軌跡にチェックを入れる
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
    // 未完了の軌跡IDを取得する．
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
    // 全ての軌跡が完了していれば，Startの文字をCompleteに変える
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
        replay(trajectory, 130);
    }
    if(Env.task_id==2){
        replay(trajectory, 50);
    }
}

function play(){
    // playボタンがない場合．
    trajectory_id = get_trajectory_id();
    if(trajectory_id == -1){
        window.location.href = '/exp/end';
    }else{
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
            alert("サブゴールを２箇所選択してください．")
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

function next_task(){
    playButton.style.display = 'block';
    change_play_button_display();
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.removeEventListener("click", clickOnCanvas, false);
    completeButton.removeEventListener("click", clickSend, false);
    Participant.sub_goals = [];
    write_console("");
}