const canvas = document.querySelector("#glcanvas");
let context = canvas.getContext("2d");
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
let Env = {
    tasks: {
        1: {
            config: SIMPLE_CFG.split(/\r\n|\n/),
            n_subgoals: 2
        },
        2: {
            config: SIMPLE_CFG.split(/\r\n|\n/),
            n_subgoals: 4
        }
    },
    ball: null,
    obstacles: [],
    start_pos_x: 0,
    start_pos_y: 0,
    target_pos_x: 0,
    target_pos_y: 0,
    ball_rad: 0,
    target_rad: 0,
    subgoal_rad: 0.04,
    screen_width: window.innerWidth * 0.5,
    screen_height: window.innerWidth * 0.5
}
let processButton = document.querySelector('#startButton');
Participant.sub_goals = [];
Participant.task_id = 1;
Participant.get_subgoal = (pos_x, pos_y, rad) => {
    let distance = 0;
    for(subgoal of Participant.sub_goals){
        distance = ((pos_x - subgoal[0])**2 + (pos_y - subgoal[1])**2) ** 0.5;
        if(distance < rad + Env.subgoal_rad){
            return subgoal;
        }
    }
    return false;
}
canvas.width = Env.screen_width;
canvas.height = Env.screen_height;


processButton.addEventListener('click', click_process);

function click_process(event){
    event.target.style.display = 'none';
    init();
    render();
    canvas.addEventListener("click", click_on_canvas, false);
}

function click_on_canvas(event){
    let rect = event.target.getBoundingClientRect();
    let x = (event.clientX - rect.left)/Env.screen_width;
    let y = 1 - (event.clientY - rect.top)/Env.screen_height;
    Participant.sub_goals.push([x, y]);
    draw_circle(x, y, Env.subgoal_rad, 'green');
}


function init(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    let x_vertexes = [];
    let y_vertexes = [];
    for(cf of Env.tasks[Participant.task_id].config){
        x_vertexes = [];
        y_vertexes = [];
        let cf_array = cf.split(' ');
        if(cf_array[0] == "" || cf_array.slice(1).length == 0){
            continue;
        }
        switch(cf_array[0]){
            case 'ball': 
                Env.ball_rad = parseFloat(cf_array[1]);
                break;
            case 'target': 
                Env.target_pos_x = parseFloat(cf_array[1]);
                Env.target_pos_y = parseFloat(cf_array[2]);
                Env.target_rad = parseFloat(cf_array[3]);
                break;
            case 'start': 
                Env.start_pos_x = parseFloat(cf_array[1]);
                Env.start_pos_y = parseFloat(cf_array[2]);
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
            Env.obstacles.push(new PinballObstacle(x_vertexes, y_vertexes));
        }
    }
    Env.ball = new Ball(Env.start_pos_x, Env.start_pos_y, Env.ball_rad);
}

function draw_circle(pos_x, pos_y, rad, color=null){
    context.beginPath();
    if(color != null){
        context.fillStyle = color
    }
    context.arc(Env.screen_width * pos_x, Env.screen_height * (1 - pos_y), Env.screen_height * rad, 0, Math.PI*2, false);
    context.fill();
}

function draw_obs(pos_xs, pos_ys){
    context.beginPath();
    context.fillStyle = 'gray'
    context.moveTo(Env.screen_width * pos_xs[0], Env.screen_height * (1-pos_ys[0]));
    for(let i = 1; i < pos_xs.length; i++){
        context.lineTo(Env.screen_width * pos_xs[i], Env.screen_height * (1-pos_ys[i]));
    }
    context.closePath();
    context.fill();
}

function init_render(){
    return;
}

function render(){
    context.clearRect(0, 0, Env.screen_width, Env.screen_height);
    for(obs of Env.obstacles){
        draw_obs(obs.points_x, obs.points_y);
    }
    draw_circle(Env.ball.pos_x, Env.ball.pos_y, Env.ball_rad, 'blue');
    draw_circle(Env.target_pos_x, Env.target_pos_y, Env.target_rad, 'red');
}