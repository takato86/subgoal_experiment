const task_type_dict = {2: "exp_play",0: "reha_play", 3:"exp_eval", 1: "reha_eval"};
let play_id = -1;
let task_info = document.getElementById("task")
let task_id = parseInt(task_info.dataset.taskid);
let user_id = -1;
let task_type = task_info.dataset.tasktype;
let host = location.hostname;
let csrftoken = '';