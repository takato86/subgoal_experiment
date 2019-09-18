startButton.addEventListener("click",clickStartButton);

let loop = function(){
    current_act = 4; //Math.floor(Math.random() * 5);
    switch(user_action){
        case 'ArrowUp': current_act = 1; break;
        case 'ArrowDown': current_act = 3; break;
        case 'ArrowRight': current_act = 0; break;
        case 'ArrowLeft': current_act = 2; break;
        default: current_act = 4; break;
    }
    if(!play_step(current_act)){
        alert("game end");
        return;
    }
    console.log(ball.pos_x + " : "+ ball.pos_y);
    render();
    requestAnimationFrame(loop);
}

function clickStartButton(){
    let startButton = document.getElementById('startButton');
    startButton.style.display = 'none';
    postTaskStart(goal, loop);
    // play idを得てから処理を進める処理
    init_variables();
    init_render();
    start();
}

function play_step(action){
    let is_continue = step(action);
    Player.pre_states = arange_state(Player.pre_state);
    Player.cur_states = arange_state(Player.cur_state);
    postActionLog(play_id, Player.pre_states[0], Player.pre_states[1], Player.pre_states[2], Player.pre_states[3], action, null, Player.cur_states[0], Player.cur_states[1], Player.cur_states[2], Player.cur_states[3],Env.reward);
    if(!is_continue){
        postTaskFinish(play_id, Player.steps, true);
    }
    return is_continue;
}