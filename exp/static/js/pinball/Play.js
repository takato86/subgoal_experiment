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
    postTaskStart(user_id, task_id, goal, task_type, loop);
    // play idを得てから処理を進める処理
    init_variables();
    init_render();
    start();
}

function play_step(action){
    let is_continue = step(action);
    pre_states = arange_state(pre_state);
    cur_states = arange_state(cur_state)
    postActionLog(play_id, pre_states[0], pre_states[1], pre_states[2], pre_states[3], action, null, cur_states[0], cur_states[1], cur_states[2], cur_states[3],reward);
    if(!is_continue){
        postTaskFinish(play_id, n_steps, true);
    }
    return is_continue;
}