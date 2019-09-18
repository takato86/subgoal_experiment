Env.task_info = document.getElementById("task")
Env.task_id = parseInt(Env.task_info.dataset.taskid);
Env.user_id = -1;
Env.task_type = Env.task_info.dataset.tasktype;

function setCookie(){
    document.cookie = "Env.user_id="+encodeURIComponent(Env.user_id);
    document.cookie = "Env.task_id="+encodeURIComponent(Env.task_id);
    document.cookie = "Env.task_type="+encodeURIComponent(Env.task_type);
}

function getCookie(){
    var r = document.cookie.split(';');
    r.forEach(function(value){
        value = value.trim()
        var content = value.split('=');
        switch(content[0]){
            case 'user_id':Env.user_id = parseInt(content[1]); break;
            case 'task_id':
                if(Env.task_id == -1){
                    Env.task_id = parseInt(content[1]); break;
                }break;
            case 'task_type': Env.task_type = content[1]; break;
            case 'csrftoken': Env.csrftoken = content[1]; break;
            default: console.log(content[0]+' : '+content[1]);
        }
    })
}

function rateHighly(){
    postEvalLog(play_id, action_id, 1);
}

function rateLower(){
    postEvalLog(play_id, action_id, -1);
}