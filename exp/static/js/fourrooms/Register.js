let register_buttom = document.getElementById('registerButton');
let reset_buttom = document.getElementById('resetButton');
Player.trajectory = [];

reset_buttom.addEventListener("click", resetStart);
register_buttom.addEventListener("click", register);

function register(){
    postTrajectory(Player.n_steps, Env.goal, Player.trajectory);
    write_console("軌跡が登録されました．");
    init_variables();
    init_render();
    start();
    postTaskStart(Env.goal, alternative);
}

function resetStart(){
    let start_state_text = document.getElementById('start_state');
    let start_state = parseInt(start_state_text.value);
    let goal_state_text = document.getElementById('goal_state');
    let goal_state = parseInt(goal_state_text.value);
    if(containState(goal_state)){
        Env.goal = goal_state
    }else{
        write_console("Goal Stateが状態に含まれない値です．");
    }
    if(containState(start_state)){
        init_variables();
        init_render();
        start(start_state);
        write_console("スタート状態がセットされました．");
    }else{
        write_console("Start Stateが状態に含まれない値です．");
    }
}

function containState(state){
    for(let i=0; i<tostate.length; i++){
        for(let j=0; j<tostate[i].length; j++){
            if(state === tostate[i][j]){
                return true;
            }
        }
    }
    return false;
}

function write_console(text){
    let log_console = document.getElementById('log_console');
    log_console.textContent = text;
}