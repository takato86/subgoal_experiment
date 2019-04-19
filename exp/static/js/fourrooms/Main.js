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
let reward = 0;
const action_space = [0,1,2,3]; //上下左右
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
    [cur_y, cur_x] = tocell(cur_state);
    draw_cell(cur_x, cur_y, 'white');
    [g_y, g_x] = tocell(goal);
    draw_cell(g_x, g_y, 'red');
    
    if(start_state != null){
        cur_state = start_state;
    }else{
        do{
            cur_state = Math.floor(Math.random() * n_states);
        }while(cur_state == goal);    
    }
    pre_state = cur_state;
    n_steps = 0;
    [cur_y, cur_x] = tocell(cur_state);
    draw_cell(cur_x, cur_y, 'blue');
}

function draw_cell(pos_x, pos_y, color){
    context.clearRect(pos_x * cell_width, pos_y * cell_height, cell_width, cell_height);
    context.fillStyle = color;
    context.fillRect(pos_x * cell_width, pos_y * cell_height, cell_width, cell_height);
}

function step(action){
    pre_state = cur_state;
    [cur_y, cur_x] = tocell(cur_state);
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
    cur_state = tostate[next_y][next_x];
    n_steps++;
}

function render(){
    [pre_y,pre_x] = tocell(pre_state);
    console.log('y:' + pre_y + ', x:' + pre_x);
    draw_cell(pre_x, pre_y, 'white');
    [cur_y, cur_x] = tocell(cur_state);
    draw_cell(cur_x, cur_y, 'blue');
    console.log('y:' + cur_y + ', x:' + cur_x);
    if(cur_state == goal){
        window.alert("Goal! The number of steps is "+n_steps+".");
        start();
    }
}

// function createArangeArray(num){
//     arr = [];
//     for(let i=0; i<num; i++){
//         arr[i] = i;
//     }
//     return arr;
// }

// init_variables
// init_render
// start(start_state)

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
    pre_state = 0;
    cur_state = 0;
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
    for(let i=0; i<height; i++){
        for(let j=0; j<width; j++){
            if(occupancy[i][j] == 1){
                context.fillStyle = 'black';
            }else{
                context.fillStyle = 'white';
            }
            context.fillRect(x + j * cell_width, y + i * cell_height, cell_width, cell_height);
        }
    }
    let [g_y, g_x] = tocell(goal);
    context.fillStyle = 'red';
    context.fillRect(x + g_x * cell_width, y + g_y * cell_height, cell_height, cell_width);
    // Initialize the GL context
    // const gl = canvas.getContext("webgl");
    // // Only continue if WebGL is available and working
    // if (!gl) {
    // alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    // return;
    // }
    // // Set clear color to black, fully opaque
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // // Clear the color buffer with specified clear color
    // gl.clear(gl.COLOR_BUFFER_BIT);
}
