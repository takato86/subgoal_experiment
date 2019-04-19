function setCookie(){
    document.cookie = "user_id="+encodeURIComponent(user_id);
    document.cookie = "task_id="+encodeURIComponent(task_id);
    document.cookie = "task_type="+encodeURIComponent(task_type);
}

function getCookie(){
    var r = document.cookie.split(';');
    r.forEach(function(value){
        value = value.trim()
        var content = value.split('=');
        switch(content[0]){
            case 'user_id':user_id = parseInt(content[1]); break;
            case 'task_id':
                if(task_id == -1){
                    task_id = parseInt(content[1]); break;
                }break;
            case 'task_type': task_type = content[1]; break;
            case 'csrftoken': csrftoken = content[1]; break;
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