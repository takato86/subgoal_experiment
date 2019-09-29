// task _type = ["reha", "exp"]
let Player = {}
let Env = {}
let Participant = {}
Env.play_id = -1;
Env.host = location.hostname;
Env.csrftoken = '';
Env.reward = 0;
Player.n_steps = 0;
Player.pre_state;
Player.cur_state;
Player.history;
Player.pre_action;
let repeat = function(){};

function getInfoCookie(){
    cookies = new Map(getCookie());
    if(cookies.has("user_id")){
        Env.user_id = cookies.get("user_id");
    }
    if(cookies.has("task_id")){
        Env.task_id = cookies.get("task_id");
    }
    if(cookies.has("task_type")){
        Env.task_type = cookies.get("task_type");
    }
    if(cookies.has("csrftoken")){
        Env.csrftoken = cookies.get("csrftoken");
    }
}
window.addEventListener("load", getInfoCookie);