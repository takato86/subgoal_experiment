function clickStartButton(){
    let startButton = document.getElementById('startButton');
    startButton.style.display = 'none';
    postTaskStart(user_id, task_id, task_type_dict[0]);
    // play idを得てから処理を進める処理
    init_variables();
    init_render();
    start();
}

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
            case 'task_id':task_id = parseInt(content[1]); break;
            case 'task_type': task_type = content[1]; break;
            case 'csrftoken': csrftoken = content[1]; break;
            default: console.log(content[0]+' : '+content[1]);
        }
    })
}