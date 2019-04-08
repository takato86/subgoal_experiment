const canvas = document.querySelector("#glcanvas");
        var context = canvas.getContext("2d");
        const BOX_CFG=`ball 0.02
target 0.9 0.2 0.04
start 0.2 0.9

polygon 0.0 0.0 0.0 0.01 1.0 0.01 1.0 0.0
polygon 0.0 0.0 0.01 0.0 0.01 1.0 0.0 1.0
polygon 0.0 1.0 0.0 0.99 1.0 0.99 1.0 1.0
polygon 1.0 1.0 0.99 1.0 0.99 0.0 1.0 0.0

polygon 0.45 0.45 0.55 0.45 0.55 0.55 0.45 0.55`;

        const EMPTY_CFG=`ball 0.02
target 0.9 0.2 0.04
start 0.2 0.9

polygon 0.0 0.0 0.0 0.01 1.0 0.01 1.0 0.0
polygon 0.0 0.0 0.01 0.0 0.01 1.0 0.0 1.0
polygon 0.0 1.0 0.0 0.99 1.0 0.99 1.0 1.0
polygon 1.0 1.0 0.99 1.0 0.99 0.0 1.0 0.0`;

        const HARD_CFG=`ball 0.015
target 0.5 0.06 0.04
start 0.055 0.95

polygon 0.0 0.0 0.0 0.01 1.0 0.01 1.0 0.0
polygon 0.0 0.0 0.01 0.0 0.01 1.0 0.0 1.0
polygon 0.0 1.0 0.0 0.99 1.0 0.99 1.0 1.0
polygon 1.0 1.0 0.99 1.0 0.99 0.0 1.0 0.0
polygon 0.034 0.852 0.106 0.708 0.33199999999999996 0.674 0.17599999999999996 0.618 0.028 0.718
polygon 0.15 0.7559999999999999 0.142 0.93 0.232 0.894 0.238 0.99 0.498 0.722
polygon 0.8079999999999999 0.91 0.904 0.784 0.7799999999999999 0.572 0.942 0.562 0.952 0.82 0.874 0.934
polygon 0.768 0.814 0.692 0.548 0.594 0.47 0.606 0.804 0.648 0.626
polygon 0.22799999999999998 0.5760000000000001 0.39 0.322 0.3400000000000001 0.31400000000000006 0.184 0.456
polygon 0.09 0.228 0.242 0.076 0.106 0.03 0.022 0.178
polygon 0.11 0.278 0.24600000000000002 0.262 0.108 0.454 0.16 0.566 0.064 0.626 0.016 0.438
polygon 0.772 0.1 0.71 0.20599999999999996 0.77 0.322 0.894 0.09600000000000002 0.8039999999999999 0.17600000000000002
polygon 0.698 0.476 0.984 0.27199999999999996 0.908 0.512
polygon 0.45 0.39199999999999996 0.614 0.25799999999999995 0.7340000000000001 0.438
polygon 0.476 0.868 0.552 0.8119999999999999 0.62 0.902 0.626 0.972 0.49 0.958
polygon 0.61 0.014000000000000002 0.58 0.094 0.774 0.05000000000000001 0.63 0.054000000000000006
polygon 0.33399999999999996 0.014 0.27799999999999997 0.03799999999999998 0.368 0.254 0.7 0.20000000000000004 0.764 0.108 0.526 0.158
polygon 0.294 0.584 0.478 0.626 0.482 0.574 0.324 0.434 0.35 0.39 0.572 0.52 0.588 0.722 0.456 0.668`;

        const MEDIUM_CFG=`ball 0.02
target 0.9 0.2 0.04
start 0.2 0.9

polygon 0.0 0.0 0.0 0.01 1.0 0.01 1.0 0.0
polygon 0.0 0.0 0.01 0.0 0.01 1.0 0.0 1.0
polygon 0.0 1.0 0.0 0.99 1.0 0.99 1.0 1.0
polygon 1.0 1.0 0.99 1.0 0.99 0.0 1.0 0.0

polygon 0.09 0.228 0.242 0.076 0.106 0.03 0.022 0.178
polygon 0.33399999999999996 0.014 0.27799999999999997 0.03799999999999998 0.368 0.254 0.7 0.20000000000000004 0.764 0.108 0.526 0.158
polygon 0.034 0.852 0.106 0.708 0.33199999999999996 0.674 0.17599999999999996 0.618 0.028 0.718
polygon 0.45 0.39199999999999996 0.614 0.25799999999999995 0.7340000000000001 0.438
polygon 0.33399999999999996 0.014 0.27799999999999997 0.03799999999999998 0.368 0.254 0.7 0.20000000000000004 0.764 0.108 0.526 0.158
polygon 0.294 0.584 0.478 0.626 0.482 0.574 0.324 0.434 0.35 0.39 0.572 0.52 0.588 0.722 0.456 0.668 `;

        const SIMPLE_CFG=`ball 0.02
target 0.9 0.2 0.04
start 0.2 0.9

polygon 0.0 0.0 0.0 0.01 1.0 0.01 1.0 0.0
polygon 0.0 0.0 0.01 0.0 0.01 1.0 0.0 1.0
polygon 0.0 1.0 0.0 0.99 1.0 0.99 1.0 1.0
polygon 1.0 1.0 0.99 1.0 0.99 0.0 1.0 0.0

polygon 0.35 0.4 0.45 0.55 0.43 0.65 0.3 0.7 0.45 0.7 0.5 0.6 0.45 0.35
polygon 0.2 0.6 0.25 0.55 0.15 0.5 0.15 0.45 0.2 0.3 0.12 0.27 0.075 0.35 0.09 0.55
polygon 0.3 0.8 0.6 0.75 0.8 0.8 0.8 0.9 0.6 0.85 0.3 0.9
polygon 0.8 0.7 0.975 0.65 0.75 0.5 0.9 0.3 0.7 0.35 0.63 0.65
polygon 0.6 0.25 0.3 0.07 0.15 0.175 0.15 0.2 0.3 0.175 0.6 0.3
polygon 0.75 0.025 0.8 0.24 0.725 0.27 0.7 0.025`;

const CFGS = [EMPTY_CFG, BOX_CFG, SIMPLE_CFG, MEDIUM_CFG, HARD_CFG];

const config = 2;
const action_space = [0,1,2,3,4]
const STEP_PENALTY = -1;
const THRUST_PENALTY = -5;
const END_EPISODE = 10000;
const screen_width = 400;
const screen_height = 400;
const action_effects = [[1,0], [0,1], [-1,0], [0,-1], [0,0]];
const episodeCap = 10000;

let cfgs_array = CFGS[config].split(/\r\n|\n/);
let start_pos_x = 0;
let start_pos_y = 0;
let target_pos_x = 0;
let target_pos_y = 0;
let target_rad = 0;
let ball_rad = 0;
let obstacles = [];
let ball;
let counter = 0;
let current_act = 4;
let user_action = '';

window.onload = start();

document.body.addEventListener('keydown', e => {
    user_action = e.key;
}, {passive: false});

document.body.addEventListener('keyup', e=>{
    user_action = '';
});

function step(action = 4){
    counter++;
    //TODO Random move
    let reward = take_action(action);
    if(terminal()){
        ball.pos_x = start_pos_x;
        ball.pos_y = start_pos_y;
        ball.xdot = 0.0;
        ball.ydot = 0.0;
        return false;
    }
    return true;
}
function terminal(){
    if(counter >= episodeCap || episode_ended()){
        counter = 0;
        return true;
    }
    return false;
}
function take_action(action){
    for(let i=0; i<20; i++){
        if(i == 0){
            ball.add_impulse(action_effects[action]);
        }
        ball.step();
        let ncollision = 0;
        dxdy = [0,0];

        for(obs of obstacles){
            if(obs.collision(ball)){
                console.log("collision");
                dxdy = addVecs(dxdy, obs.collision_effect(ball));
                ncollision++;
            }
        }
        
        if(ncollision == 1){
            ball.xdot = ball.clip(dxdy[0]);
            ball.ydot = ball.clip(dxdy[1]);
            if(i==19){
                ball.step();
            }
        }else if(ncollision > 1){
            ball.xdot = -ball.xdot
            ball.ydot = -ball.ydot
        }
// TODO make episode_ended function
        if(episode_ended()){
            return END_EPISODE;
        }
    }
    ball.add_drag()
    // TODO make check_bounds function
    check_bounds();

    if(action == 5){
        return STEP_PENALTY;
    }
    return THRUST_PENALTY;
}

function episode_ended(){
    let norm = ((ball.pos_x - target_pos_x) ** 2 + (ball.pos_y - target_pos_y)**2) ** 0.5; 
    return norm < target_rad;
}

function check_bounds(){
    if(ball.pos_x > 1.0){
        ball.pos_x = 0.95;
    }
    if(ball.pos_x < 0.0){
        ball.pos_x = 0.05;
    }
    if(ball.pos_y > 1.0){
        ball.pos_y = 0.95;
    }
    if(ball.pos_y < 0.0){
        ball.pos_y = 0.05
    }
}

function start(){
    const cnt = 2;
    let x_vertexes = [];
    let y_vertexes = [];
    for(cf of cfgs_array){
        x_vertexes = [];
        y_vertexes = [];
        let cf_array = cf.split(' ');
        if(cf_array[0] == "" || cf_array.slice(1).length == 0){
            continue;
        }
        switch(cf_array[0]){
            case 'ball': 
                ball_rad = parseFloat(cf_array[1]);
                break;
            case 'target': 
                target_pos_x = parseFloat(cf_array[1]);
                target_pos_y = parseFloat(cf_array[2]);
                target_rad = parseFloat(cf_array[3]);
                break;
            case 'start': 
                start_pos_x = parseFloat(cf_array[1]);
                start_pos_y = parseFloat(cf_array[2]);
                ball_pos_x = parseFloat(start_pos_x);
                ball_pos_y = parseFloat(start_pos_y);
                break;
            case 'polygon': 
                cf_array = cf_array.slice(1)
                for(let i = 0; i < cf_array.length; i++){
                    if(i%2 == 0){
                        x_vertexes.push(parseFloat(cf_array[i]));
                    }else{
                        y_vertexes.push(parseFloat(cf_array[i]));
                    }
                }
                break;
            default: break;
        }
        if(x_vertexes.length != 0 && y_vertexes.length != 0){
            obstacles.push(new PinballObstacle(x_vertexes, y_vertexes));
        }
    }
    ball = new Ball(start_pos_x, start_pos_y, ball_rad);
    ball.xdot = 0;
    ball.ydot = 0;
    render();
}

function draw_circle(pos_x, pos_y, rad, color=null){
    context.beginPath();
    if(color != null){
        context.fillStyle = color
    }
    context.arc(screen_width * pos_x, screen_height * (1 - pos_y), screen_height * rad, 0, Math.PI*2, false);
    context.fill();
}

function draw_obs(pos_xs, pos_ys){
    context.beginPath();
    context.fillStyle = 'gray'
    context.moveTo(screen_width * pos_xs[0], screen_height * (1-pos_ys[0]));
    for(let i = 1; i < pos_xs.length; i++){
        context.lineTo(screen_width * pos_xs[i], screen_height * (1-pos_ys[i]));
    }
    context.closePath();
    context.fill();
}

function render(){
    context.clearRect(0, 0, screen_width, screen_height);
    for(obs of obstacles){
        draw_obs(obs.points_x, obs.points_y);
    }
    draw_circle(ball.pos_x, ball.pos_y, ball_rad, 'blue');
    draw_circle(target_pos_x, target_pos_y, target_rad, 'red');
}

(function loop(){
    current_act = 4; //Math.floor(Math.random() * 5);
    switch(user_action){
        case 'ArrowUp': current_act = 1; break;
        case 'ArrowDown': current_act = 3; break;
        case 'ArrowRight': current_act = 0; break;
        case 'ArrowLeft': current_act = 2; break;
        default: current_act = 4; break;
    }
    if(!step(current_act)){
        alert("game end");
        return;
    }
    console.log(ball.pos_x + " : "+ ball.pos_y);
    render();
    requestAnimationFrame(loop);
}());