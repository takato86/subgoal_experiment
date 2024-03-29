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
    screen_width: window.innerWidth * 0.35,
    screen_height: window.innerWidth * 0.35
}



class Subgoal{
    constructor(pos_x, pos_y, rad){
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.rad = rad;
    }
    is_in(pos_x, pos_y, rad){
        let distance = ((pos_x - this.pos_x)**2 + (pos_y - this.pos_y)**2) ** 0.5;
        return (distance < this.rad);
    }
    to_dict(){
        return {"x": this.pos_x, "y": this.pos_y, "rad": this.rad};
    }
}

class Ball{
    constructor(pos_x, pos_y, rad){ 
        this.DRAG = 0.995;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.rad = rad;
        this.xdot = 0;
        this.ydot = 0;
    }
    add_impulse([delta_xdot, delta_ydot]){
        this.xdot += delta_xdot / 5;
        this.ydot += delta_ydot / 5;
        this.xdot = this.clip(this.xdot);
        this.ydot = this.clip(this.ydot);
    }
    add_drag(){
        this.xdot = this.xdot * this.DRAG;
        this.ydot = this.ydot * this.DRAG;
    }

    step(){
        this.pos_x = this.pos_x + this.xdot * this.rad / 20;
        this.pos_y = this.pos_y + this.ydot * this.rad / 20;
    }
    clip(val, low=-2, high=2){
        if(val > high){
            val = high;
        }
        if(val < low){
            val = low;
        }
        return val;
    }
}

class PinballObstacle{
    constructor(points_x, points_y){
        this.points_x = points_x;
        this.points_y = points_y;
        this.min_x = Math.min(...this.points_x);
        this.max_x = Math.max(...this.points_x);
        this.min_y = Math.min(...this.points_y);
        this.max_y = Math.max(...this.points_y);
        this.double_collision = false;
        this.intercept = null;
    }
    generate_pt_pairs(){
        // TODO check
        let pt_pairs = [];
        for(let i=0; i < this.points_x.length; i++){
            if(i+1 < this.points_x.length){
                pt_pairs.push([[this.points_x[i], this.points_y[i]], [this.points_x[i+1], this.points_y[i+1]]]);
            }else{
                pt_pairs.push([[this.points_x[i], this.points_y[i]], [this.points_x[0], this.points_y[0]]]);
            }
        }
        return pt_pairs;
    }
    collision(ball){
        if(ball.pos_x - ball.rad > this.max_x){
            return false;
        }
        if(ball.pos_x + ball.rad < this.min_x){
            return false;
        }
        if(ball.pos_y - ball.rad > this.max_y){
            return false;
        }
        if(ball.pos_y + ball.rad < this.min_y){
            return false;
        }
        let pt_pairs = this.generate_pt_pairs();
        let intercept_found = false;
        for(let pt_pair of pt_pairs){
            if(this.intercept_edge(pt_pair, ball)){
                if(intercept_found){
                    this.intercept = this.select_edge(pt_pair, this.intercept, ball);
                    this.double_collision = true;
                }else{
                    this.intercept = pt_pair;
                    intercept_found = true;
                }
            }
        }
        return intercept_found;
    }

    collision_effect(ball){
        //TODO check
        if(this.double_collision){
            return [-ball.xdot, -ball.ydot];
        }
        let obstacle_vector = subVecs(this.intercept[1], this.intercept[0]);
        if(obstacle_vector[0] < 0){
            obstacle_vector = subVecs(this.intercept[0], this.intercept[1]);
        }

        let velocity_vector = [ball.xdot, ball.ydot];
        let theta = this.angle(velocity_vector, obstacle_vector) - Math.PI;
        if(theta < 0){
            theta += 2 * Math.PI;
        }
        let intercept_theta = this.angle([-1, 0], obstacle_vector);
        theta += intercept_theta;

        if(theta > 2 * Math.PI){
            theta -= 2 * Math.PI;
        }
        let velocity = (ball.xdot ** 2 + ball.ydot ** 2) ** 0.5;
        return [velocity * Math.cos(theta), velocity * Math.sin(theta)];
    }
    select_edge(intersect1, intersect2, ball){
        let velocity = [ball.xdot, ball.ydot];
        let obstacle_vector1 = subVecs(intersect1[1], intersect1[0]);
        let obstacle_vector2 = subVecs(intersect2[1], intersect2[0]);
        let angle1 = this.angle(velocity, obstacle_vector1);
        if(angle1 > Math.PI){
            angle1 -= Math.PI;
        }
        let angle2 = this.angle(velocity, obstacle_vector2);
        if(angle1 > Math.PI){
            angle2 -= Math.PI;
        }

        if(Math.abs(angle1 - (Math.PI / 2)) < Math.abs(angle2 - (Math.PI / 2))){
            return intersect1;
        }
        return intersect2;
    }
    angle(v1, v2){
        let angle_diff = Math.atan2(v1[0], v1[1]) - Math.atan2(v2[0], v2[1]);
        if(angle_diff < 0){
            angle_diff += 2 * Math.PI;
        }
        return angle_diff;
    }

    intercept_edge(pt_pair, ball){
//          :param pt_pair: The pair of points defining an edge
//          :type pt_pair: list of lists
//          :param ball: An instance of :class:`BallModel`
//          :type ball: :class:`BallModel`
//          :returns: True if the ball has hit an edge of the polygon
//          :rtype: bool
        let obstacle_edge = subVecs(pt_pair[1], pt_pair[0]);
        let difference = subVecs([ball.pos_x, ball.pos_y], pt_pair[0]);
        let scalar_proj = dot(difference, obstacle_edge)/dot(obstacle_edge, obstacle_edge);
        if(scalar_proj > 1.0){
            scalar_proj = 1.0;
        }else if(scalar_proj < 0.0){
            scalar_proj = 0.0;
        }
        let closest_pt = addVecs(pt_pair[0], mulVecs(obstacle_edge, [scalar_proj,scalar_proj]));
        let obstacle_to_ball = subVecs([ball.pos_x, ball.pos_y], closest_pt);
        let distance = dot(obstacle_to_ball, obstacle_to_ball);
        let velocity = 0;
        let ball_to_obstacle = [];
        let angle = 0;
        if(distance <= ball.rad ** 2){
            velocity = [ball.xdot, ball.ydot];
            ball_to_obstacle = subVecs(closest_pt, [ball.pos_x, ball.pos_y]);
            angle = this.angle(ball_to_obstacle, velocity);
            if(angle > Math.PI){
                angle = 2 * Math.PI - angle;
            }
            if(angle > Math.PI / 1.99){
                return false;
            }
            return true;
        }else{
            return false;
        }
    }
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

function clear_canvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_circle(pos_x, pos_y, rad, color=null, text=null, alpha=1){
    context.beginPath();
    if(color != null){
        context.fillStyle = color;
    }
    if(alpha >= 0.0 && alpha <= 1.0){
        context.globalAlpha = alpha;
    }else{
        context.globalAlpha = 1.0
    }
    context.arc(Env.screen_width * pos_x, Env.screen_height * (1 - pos_y), Env.screen_height * rad, 0, Math.PI*2, false);
    context.fill();
    if(text != null){
        context.fillStyle = 'white';
        context.font = "25px serif";
        let text_size = context.measureText(text);
        context.fillText(text, Env.screen_width * pos_x - text_size.width/2,
                         Env.screen_height * (1 - pos_y) + 8.5)
    }
}

function draw_obs(pos_xs, pos_ys){
    context.beginPath();
    context.fillStyle = 'gray'
    context.globalAlpha = 1.0
    context.moveTo(Env.screen_width * pos_xs[0], Env.screen_height * (1-pos_ys[0]));
    for(let i = 1; i < pos_xs.length; i++){
        context.lineTo(Env.screen_width * pos_xs[i], Env.screen_height * (1-pos_ys[i]));
    }
    context.closePath();
    context.fill();
}

function render(){
    clear_canvas();
    for(let obs of Env.obstacles){
        draw_obs(obs.points_x, obs.points_y);
    }
    draw_circle(Env.ball.pos_x, Env.ball.pos_y, Env.ball_rad, 'blue');
    draw_circle(Env.target_pos_x, Env.target_pos_y, Env.target_rad, 'red');
}

function render_subgoals(is_text=true, alpha=1){
    if(is_text){
        Participant.subgoals.forEach((value, index) => {
            draw_circle(value.pos_x, value.pos_y, value.rad,'green', String(index+1), alpha);
        });
    }else{
        Participant.subgoals.forEach((value, index) => {
            draw_circle(value.pos_x, value.pos_y, value.rad,'green', null, alpha);
        });
    }
}

function subVecs(a, b){
    if(a.length != b.length){
        throw "Vector length must be equal."
    }
    let result = [];
    for(let i=0; i < a.length; i++){
        result.push(a[i] - b[i]);
    }
    return result;
}
function dot(a,b){
    if(a.length != b.length){
        throw "Vector length must be equal."
    }
    let result = 0;
    for(let i = 0; i < a.length; i++){
        result += a[i] * b[i];
    }
    return result;
}
function divVecs(a,b){
    if(a.length != b.length){
        throw "Vector length must be equal."
    }
    let result = [];
    for(let i=0; i < a.length; i++){
        result.push(a[i] / b[i]);
    }
    return result;
}
function addVecs(a, b){
    if(a.length != b.length){
        throw "Vector length must be equal."
    }
    let result = [];
    for(let i=0; i < a.length; i++){
        result.push(a[i] + b[i]);
    }
    return result;
}
function mulVecs(a, b){
    if(a.length != b.length){
        throw "Vector length must be equal."
    }
    let result = [];
    for(let i=0; i < a.length; i++){
        result.push(a[i] * b[i]);
    }
    return result;
}