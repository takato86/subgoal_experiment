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