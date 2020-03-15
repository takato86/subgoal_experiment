let Env = {
    csrftoken: '',
    user_id: -1
}

let repeat = function(){};

function getInfoCookie(){
    cookies = new Map(getCookie());
    if(cookies.has("user_id")){
        Env.user_id = cookies.get("user_id");
    }
    if(cookies.has("task_id")){
        Env.task_id = cookies.get("task_id");
    }
    if(cookies.has("csrftoken")){
        Env.csrftoken = cookies.get("csrftoken");
    }
}

function setInfoCookie(){
    setCookie("user_id", Env.user_id);
    setCookie("task_id", Env.task_id);
}

function setCookie(key, value){
    document.cookie = key + "="+encodeURIComponent(value);
}

function getCookie(){
    let r = document.cookie.split(';');
    let cookies = r.map(function(element, index, array){
        let value = element.trim();
        return value.split('=');
    });
    return cookies;
}


window.addEventListener("beforeunload", setInfoCookie);
window.addEventListener("load", getInfoCookie);
