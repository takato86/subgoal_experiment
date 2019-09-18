const canvas = document.querySelector("#glcanvas");
var context = canvas.getContext("2d");
let startButton = document.getElementById('startButton');
let occupancy = [];
let tostate = [];
let height = 0;
let width = 0;
const cell_width = 50;
const cell_height = 50;
let n_states = 0;
let goal = 62;
Env.reward = 0;
Player.action_space = [0,1,2,3]; //上下左右
const possible_next_goals = [68, 69, 70, 71, 72, 78, 79, 80, 81, 82, 88, 89, 90, 91, 92, 93, 99, 100, 101, 102, 103];
const goal_change_freq = 1;
// const init_state;

window.addEventListener("load", getCookie);
window.addEventListener("beforeunload", setCookie);

// TODO Rewardの設定
// 失敗の確率．

function tocell(state){
    for(let y=0; y < height; y++){
        for(let x=0; x<width; x++){
            if(tostate[y][x] == state){
                return [y, x];
            }
        }
    }
}

function start(start_state=null){
    [cur_y, cur_x] = tocell(Player.cur_state);
    draw_cell_with_border(cur_x, cur_y, 'white');

    if(start_state != null){
        Player.cur_state = start_state;
    }else{
        let g_index = Math.floor(Math.random() * possible_next_goals.length);
        goal = possible_next_goals[g_index];
        do{
            Player.cur_state = Math.floor(Math.random() * n_states);
        }while(Player.cur_state == goal);    
    }
    [g_y, g_x] = tocell(goal);
    draw_cell_with_border(g_x, g_y, 'darkorange');
    
    Player.pre_state = Player.cur_state;
    Player.n_steps = 0;
    Player.pre_action = -1;
    [cur_y, cur_x] = tocell(Player.cur_state);
    draw_cell_with_border(cur_x, cur_y, 'royalblue');
}

function draw_cell(pos_x, pos_y, color){
    context.clearRect(pos_x * cell_width, pos_y * cell_height, cell_width, cell_height);
    context.fillStyle = color;
    context.fillRect(pos_x * cell_width, pos_y * cell_height, cell_width, cell_height);
}

function draw_cell_with_border(pos_x, pos_y, color){
    context.clearRect(pos_x * cell_width, pos_y * cell_height, cell_width, cell_height);
    context.fillStyle = color;
    context.fillRect(pos_x * cell_width, pos_y * cell_height, cell_width, cell_height);
    context.lineWidth = 1.0;
    context.strokeStyle = 'black';
    context.strokeRect(pos_x * cell_width, pos_y * cell_height, cell_width, cell_height);
}

function draw_cell_with_border_and_text(pos_x, pos_y, color, text){
    draw_cell_with_border(pos_x, pos_y, color);
    draw_text_in_cell(pos_x, pos_y, text);
}

function draw_text_in_cell(pos_x, pos_y, text){
    context.fillStyle='black';
    context.font = '40px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, pos_x*cell_width + cell_width / 2, pos_y*cell_height + cell_height/2 );
}

function get_act_direct(){
    switch(Player.pre_action){
        case 0: return "↑";
        case 1: return "↓";
        case 2: return "←";
        case 3: return "→";
        default: return " ";
    }
}

function step(action){
    Player.pre_state = Player.cur_state;
    Player.pre_action = action;
    [cur_y, cur_x] = tocell(Player.cur_state);
    [next_y, next_x] = [cur_y, cur_x];
    switch(action){
        case 0:  next_y--; break;
        case 1:  next_y++; break;
        case 2:  next_x--; break;
        case 3:  next_x++; break;
        default: break;
    }
    if(occupancy[next_y][next_x] == 1){
        next_y = cur_y;
        next_x = cur_x;
    }
    Player.cur_state = tostate[next_y][next_x];
    Player.n_steps++;
}

function render(){
    // 軌跡の色塗りなし。
    if(Player.cur_state != goal){
        [pre_y,pre_x] = tocell(Player.pre_state);
        console.log('y:' + pre_y + ', x:' + pre_x);
        draw_cell_with_border(pre_x, pre_y, 'white');
        [cur_y, cur_x] = tocell(Player.cur_state);
        draw_cell_with_border(cur_x, cur_y, 'royalblue');
        console.log('y:' + cur_y + ', x:' + cur_x);
    }else{
        window.alert("Goal! The number of steps is "+Player.n_steps+".");
        // start();
    }
}

function render_with_trajectory(){
    if(Player.cur_state != goal){
        [pre_y,pre_x] = tocell(Player.pre_state);
        console.log('y:' + pre_y + ', x:' + pre_x);
        const direction = get_act_direct(Player.pre_action);
        draw_cell_with_border_and_text(pre_x, pre_y, 'lightgray', direction);
        [cur_y, cur_x] = tocell(Player.cur_state);
        draw_cell_with_border(cur_x, cur_y, 'royalblue');
        console.log('y:' + cur_y + ', x:' + cur_x);
    }else{
        window.alert("Goal! The number of steps is "+Player.n_steps+".");
        // start();
    }
}

function init_variables(){
    const layout = `wwwwwwwwwwwww
w     w     w
w     w     w
w           w
w     w     w
w     w     w
ww wwww     w
w     www www
w     w     w
w     w     w
w           w
w     w     w
wwwwwwwwwwwww`;
    let splited_layout = layout.split('\n');
    let cells = Array.from(splited_layout);
    occupancy = [];
    for(cell of cells){
        splited_cell = cell.split('');
        res_cell = splited_cell.map((str) => {
            if(str == 'w'){
                return 1;
            }
            return 0;
        });
        occupancy.push(res_cell);
    }
    // javascriptはオブジェクトを参照で渡す。
    for(row of occupancy){
        c_row = row.concat();
        tostate.push(c_row);
    }
    height = occupancy.length;
    width = occupancy[0].length;
    n_states = 0;
    for(let y=0; y < height; y++){
        for(let x=0; x<width; x++){
            if(occupancy[y][x] == 0){
                tostate[y][x] = n_states;
                n_states++;
            }else{
                tostate[y][x] = -1;
            }
        }
    }
    Player.pre_state = 0;
    Player.cur_state = 0;
    Player.pre_action = 0;
    // const arange_state = createArangeArray(n_states);
    // const init_state = arange_state.filter(n => n != goal);
}

function init_render() {
    // TODO canvasの大きさからcellの大きさを指定するように変更する。
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = 50 * height;
    canvas.width = 50 * width;
    let x = 0;
    let y = 0;
    let fillStyle = ''
    for(let i=0; i<height; i++){
        for(let j=0; j<width; j++){
            if(occupancy[i][j] == 1){
                fillStyle = 'black';
            }else{
                fillStyle = 'white';
            }
            draw_cell_with_border(x + j, y + i, fillStyle);
        }
    }
}


function render_trajectory(){
    if(Player.history.length > 0){
        init_render()
        // TODO Trajectoryの描画とStartとGoalの描画。
        // foreach(let step of history){
            // TODO 
        // }
    }
}