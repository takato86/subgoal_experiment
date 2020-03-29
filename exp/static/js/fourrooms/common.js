const canvas = document.querySelector("#glcanvas");
let context = canvas.getContext("2d");
const LAYOUT = `wwwwwwwwwwwww
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
let Env = {
    tasks: {
        1: {
            n_subgoals: 2,
            start: 0,
            goal: 103,
            layout: LAYOUT
        },
        2: {
            n_subgoals: 4,
            start: 0,
            goal: 103,
            layout: LAYOUT
        }
    },
    occupancy: [],
    height: 0,
    width: 0,
    cell_height: 0,
    cell_width: 0,
    tostate: []
}

function init(){
    let s_y, s_x, g_y, g_x;
    let task = Env.tasks[Participant.task_id];
    let splited_layout = task.layout.split('\n');
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
        Env.tostate.push(c_row);
    }
    Env.height = Env.occupancy.length;
    Env.width = Env.occupancy[0].length;
    let n_states = 0;
    for(let y=0; y < Env.height; y++){
        for(let x=0; x < Env.width; x++){
            if(Env.occupancy[y][x] == 0){
                Env.tostate[y][x] = n_states;
                n_states++;
            }else{
                Env.tostate[y][x] = -1;
            }
        }
    }
    Env.cell_height = Math.floor(window.innerHeight / 1.5 / Env.height);
    Env.cell_width = Math.floor(window.innerHeight / 1.5 / Env.width);
    [s_y, s_x] = tocell(task.start);
    [g_y, g_x] = tocell(task.goal);
    draw_cell_with_border_and_text(g_x, g_y, 'red', 'G');
    draw_cell_with_border_and_text(s_x, s_y, 'royalblue', 'S');
}

function render(){
    let s_y, s_x, g_y, g_x;
    let x = 0;
    let y = 0;
    let fillStyle = ''
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = Env.cell_height * Env.height;
    canvas.width = Env.cell_width * Env.width;
    for(let i=0; i<Env.height; i++){
        for(let j=0; j<Env.width; j++){
            if(Env.occupancy[i][j] == 1){
                fillStyle = 'black';
            }else{
                fillStyle = 'white';
            }
            draw_cell_with_border(x + j, y + i, fillStyle);
        }
    }
    [s_y, s_x] = tocell(Env.tasks[Participant.task_id].start);
    [g_y, g_x] = tocell(Env.tasks[Participant.task_id].goal);
    draw_cell_with_border_and_text(g_x, g_y, 'red', 'G');
    draw_cell_with_border_and_text(s_x, s_y, 'royalblue', 'S');
    Participant.subgoals.forEach((value, index) => {
        [cell_y, cell_x] = tocell(value);
        draw_cell_with_border_and_text(cell_x, cell_y, "coral", String(index + 1));
    });
}

function tocell(state){
    for(let y=0; y < Env.height; y++){
        for(let x=0; x < Env.width; x++){
            if(Env.tostate[y][x] == state){
                return [y, x];
            }
        }
    }
}

function draw_cell(pos_x, pos_y, color){
    context.clearRect(pos_x * Env.cell_width, pos_y * Env.cell_height, Env.cell_width, Env.cell_height);
    context.fillStyle = color;
    context.fillRect(pos_x * Env.cell_width, pos_y * Env.cell_height, Env.cell_width, Env.cell_height);
}

function draw_cell_with_border(pos_x, pos_y, color, alpha=1.0){
    context.clearRect(pos_x * Env.cell_width, pos_y * Env.cell_height, Env.cell_width, Env.cell_height);
    context.fillStyle = color;
    context.globalAlpha = alpha;
    context.fillRect(pos_x * Env.cell_width, pos_y * Env.cell_height, Env.cell_width, Env.cell_height);
    context.lineWidth = 1.0;
    context.strokeStyle = 'black';
    context.strokeRect(pos_x * Env.cell_width, pos_y * Env.cell_height, Env.cell_width, Env.cell_height);
}

function draw_cell_with_border_and_text(pos_x, pos_y, color, text, alpha=1.0){
    draw_cell_with_border(pos_x, pos_y, color, alpha);
    draw_text_in_cell(pos_x, pos_y, text);
}

function draw_text_in_cell(pos_x, pos_y, text, alpha=1.0){
    context.fillStyle='black';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.globalAlpha = alpha;
    context.fillText(text, pos_x*Env.cell_width + Env.cell_width/2, pos_y*Env.cell_height + Env.cell_height/2 );
}

