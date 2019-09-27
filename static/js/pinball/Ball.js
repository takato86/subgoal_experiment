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