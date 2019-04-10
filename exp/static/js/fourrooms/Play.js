startButton.addEventListener("click",clickStartButton);

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
    window.requestAnimationFrame(render);
}

function play_step(action){
    step(action);
    postActionLog(play_id, pre_state, null, null, null, action, null);
    if(cur_state == goal){
        postTaskFinish(play_id, n_steps, true);
    }
}