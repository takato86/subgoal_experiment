let csrftoken = ''
let Participant = {
    user_id: -1
}

let repeat = function(){};

function getInfoCookie(){
    cookies = new Map(getCookie());
    if(cookies.has("user_id")){
        Participant.user_id = cookies.get("user_id");
    }
    if(cookies.has("csrftoken")){
        csrftoken = cookies.get("csrftoken");
    }
}

function setInfoCookie(){
    setCookie("user_id", Participant.user_id);
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
