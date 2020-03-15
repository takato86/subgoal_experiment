const canvas = document.querySelector("#glcanvas");
canvas.setAttribute('tabindex', 0);
// canvas.width = screen.height / 2;
// canvas.height = screen.height /2;
var context = canvas.getContext("2d");
Env.occupancy = [];
let tostate = [];
let height = 0;
let width = 0;
let cell_width = 40;
let cell_height = 40;
let n_states = 0;
Env.start = null;
Env.goal = 62;
const possible_next_goals = [68, 69, 70, 71, 72, 78, 79, 80, 81, 82, 88, 89, 90, 91, 92, 93, 99, 100, 101, 102, 103];
const goal_change_freq = 1;


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
    let s_y, s_x, g_y, g_x;
    if(start_state != null){
        Env.start = start_state;
    }else{
        let g_index = Math.floor(Math.random() * possible_next_goals.length);
        Env.goal = possible_next_goals[g_index];
        do{
             Env.start = Math.floor(Math.random() * n_states);
        }while(Env.start == Env.goal);    
    }
    [s_y, s_x] = tocell(Env.start);
    [g_y, g_x] = tocell(Env.goal);
    draw_cell_with_border_and_text(g_x, g_y, 'darkorange', 'G');
    draw_cell_with_border_and_text(s_x, s_y, 'royalblue', 'S');
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
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, pos_x*cell_width + cell_width / 2, pos_y*cell_height + cell_height/2 );
}

function get_act_direct(action){
    switch(action){
        case 0: return "↑";
        case 1: return "↓";
        case 2: return "←";
        case 3: return "→";
        default: return " ";
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
    Env.occupancy = [];
    for(cell of cells){
        splited_cell = cell.split('');
        res_cell = splited_cell.map((str) => {
            if(str == 'w'){
                return 1;
            }
            return 0;
        });
        Env.occupancy.push(res_cell);
    }
    // javascriptはオブジェクトを参照で渡す。
    for(row of Env.occupancy){
        c_row = row.concat();
        tostate.push(c_row);
    }
    height = Env.occupancy.length;
    width = Env.occupancy[0].length;
    n_states = 0;
    for(let y=0; y < height; y++){
        for(let x=0; x<width; x++){
            if(Env.occupancy[y][x] == 0){
                tostate[y][x] = n_states;
                n_states++;
            }else{
                tostate[y][x] = -1;
            }
        }
    }
    cell_height = Math.floor(screen.height / 1.5 / height);
    cell_width = Math.floor(screen.height / 1.5 / width);
    // const arange_state = createArangeArray(n_states);
    // const init_state = arange_state.filter(n => n != goal);
}


function init_render() {
    // TODO canvasの大きさからcellの大きさを指定するように変更する。
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = cell_height * height;
    canvas.width = cell_width * width;
    console.log("set canvas size: (" + canvas.height + ", " + canvas.width+ ")");
    let x = 0;
    let y = 0;
    let fillStyle = ''
    for(let i=0; i<height; i++){
        for(let j=0; j<width; j++){
            if(Env.occupancy[i][j] == 1){
                fillStyle = 'black';
            }else{
                fillStyle = 'white';
            }
            draw_cell_with_border(x + j, y + i, fillStyle);
        }
    }
}


