startButton.addEventListener("click",clickStartButton);
let n_runs = 5;
let counterText = document.getElementById('counter');
counterText.textContent = String(n_runs);

function clickStartButton(){
    let startButton = document.getElementById('startButton');
    startButton.style.display = 'none';
    // play idを得てから処理を進める処理
    init_variables();
    init_render();
    start();
    postTaskStart(goal, alternative);
    counterText.textContent = String(n_runs);
}

function endTask(){
    n_runs--;
    if(n_runs < 1){
        window.location.href = './reflection/description'
    }
    postTaskFinish(play_id, Player.n_steps, true);
    let startButton = document.getElementById('startButton');
    startButton.style.display = 'block';
    context.clearRect(0, 0, canvas.width, canvas.height);
}

let alternative = function(){return}

document.onkeydown = function(e){
    console.log(e.keyCode);
    switch(e.keyCode){
        case 38: 
            play_step(0);
            break;
        case 40: 
            play_step(1);
            break;
        case 37: 
            play_step(2);
            break;
        case 39: 
            play_step(3);
            break;
        default: break;
    }
    window.requestAnimationFrame(render_with_trajectory);
}

function play_step(action){
    step(action);
    Player.pre_states = arange_state(Player.pre_state);
    Player.cur_states = arange_state(Player.cur_state);
    postActionLog(play_id, Player.pre_states[0], Player.pre_states[1], Player.pre_states[2], Player.pre_states[3], action, null, Player.cur_states[0], Player.cur_states[1], Player.cur_states[2], Player.cur_states[3], Env.reward);
    if(Player.cur_state == goal){
        Player.pre_action = -1
        endTask();
    }
}

