const canvas = document.querySelector("#glcanvas");
let context = canvas.getContext("2d");

Participant.subgoals = []
Participant.task_id = 1
let completeButton = document.getElementById("complete_button");

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


window.addEventListener("load", function(){
    const cookies = new Map(getCookie("complete_task"));
    // TODO
    // if(cookies.has("complete_task")){
    //     window.location.href = '/tasks/end';
    // }
    start();
});

window.addEventListener("resize", function(){
    console.info("before" + Env.cell_height, Env.cell_width);
    Env.cell_height = Math.floor(window.innerHeight / 1.5 / Env.height);
    Env.cell_width = Math.floor(window.innerHeight / 1.5 / Env.width);
    console.info("after" + Env.cell_height, Env.cell_width);
    render();
});

completeButton.addEventListener("click", click_send);
canvas.addEventListener("click", click_on_canvas);

function start(){
    let n_subgoals_span = document.querySelector("#n_subgoals");
    n_subgoals_span.textContent = String(Env.tasks[Participant.task_id].n_subgoals);
    init();
    render();
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
    draw_cell_with_border_and_text(g_x, g_y, 'darkorange', 'G');
    draw_cell_with_border_and_text(s_x, s_y, 'royalblue', 'S');
}

function next_task(){
    Participant.task_id += 1
    Participant.subgoals = [];
    if(is_finished()){
        document.cookie = "complete_task=true";
        window.location.href = '/tasks/pinball/description';
    }else{
        start();
    }
}

function post_subgoals(subgoals){
    const request = new XMLHttpRequest();
    let data = {"subgoals":[],
                "task_id": Participant.task_id,
                "user_id": Participant.user_id,
               };
    subgoals.forEach((value, index) => {
        data["subgoals"].push({"state": value, "order": index});
    });
    request.open("POST", "/api/v1/fourrooms/subgoals");
    request.addEventListener("error", ()=>{
        console.log("Network Error!");
    });
    request.addEventListener("load", (event)=>{
        if(event.target.status != 200){
            console.log(`Error: ${event.target.status}`);
            return
        }
        console.log(event.target.status);
        console.log(event.target.responseText);
    });
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.setRequestHeader("Content-Type", "application/json")
    request.send(JSON.stringify(data));
}

function click_send(e){
    if(Participant.subgoals.length == Env.tasks[Participant.task_id].n_subgoals){
        const result = confirm("この内容でサブゴール情報を登録しますか？");
        if(result){
            post_subgoals(Participant.subgoals);
            next_task();
        }
    }else{
        alert("サブゴールは" + Env.tasks[Participant.task_id].n_subgoals + "箇所に設定してください．");
    }
}

function is_finished(){
    return !Boolean(Env.tasks[Participant.task_id]);
}

function click_on_canvas(e){
    let cell_x = Math.floor(e.offsetX / Env.cell_width);
    let cell_y = Math.floor(e.offsetY / Env.cell_height);
    const state = Env.tostate[cell_y][cell_x];
    const subgoal_index = Participant.subgoals.indexOf(state);
    if(state == Env.tasks[Participant.task_id].start){
        return;
    }else if(state == Env.tasks[Participant.task_id].goal){
        return;
    }else if(Env.occupancy[cell_y][cell_x]!=0){
        return;
    }
    if(subgoal_index >= 0){
        Participant.subgoals.splice(subgoal_index, 1);
    }else if(Participant.subgoals.length < Env.tasks[Participant.task_id].n_subgoals){
        Participant.subgoals.push(state);
    }
    render();
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
    draw_cell_with_border_and_text(g_x, g_y, 'darkorange', 'G');
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

function draw_cell_with_border(pos_x, pos_y, color){
    context.clearRect(pos_x * Env.cell_width, pos_y * Env.cell_height, Env.cell_width, Env.cell_height);
    context.fillStyle = color;
    context.fillRect(pos_x * Env.cell_width, pos_y * Env.cell_height, Env.cell_width, Env.cell_height);
    context.lineWidth = 1.0;
    context.strokeStyle = 'black';
    context.strokeRect(pos_x * Env.cell_width, pos_y * Env.cell_height, Env.cell_width, Env.cell_height);
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
    context.fillText(text, pos_x*Env.cell_width + Env.cell_width/2, pos_y*Env.cell_height + Env.cell_height/2 );
}

