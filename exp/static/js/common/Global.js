// task _type = ["reha", "exp"]
let play_id = -1;
let task_info = document.getElementById("task")
let task_id = parseInt(task_info.dataset.taskid);
let user_id = -1;
let task_type = task_info.dataset.tasktype;
let host = location.hostname;
let csrftoken = '';
let n_steps = 0;
let pre_state;
let cur_state;
let history;
let repeat = function(){};