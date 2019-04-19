function postTaskStart(user_id, task_id, task_type, callback){
    // Returns: play_id
    const request = new XMLHttpRequest();
    let data = {
        "user_id": user_id,
        "task_id": task_id,
        "task_type": task_type,
    };
    request.responseType = "json"
    request.open('POST', '/api/v1/plays/start');
    request.addEventListener("error", ()=>{
        console.log("Network Error!")
    });
    request.addEventListener("load", (event)=>{
        if(event.target.status == 200){
            const json = request.response;
            play_id = json.play_id
            callback()
        }
        if(event.target.status != 200){
            console.log(`Error: ${event.target.status}`);
            return
        }
        console.log(event.target.status);
        console.log(event.target.responseType);
        console.log(event.target.text);
    });
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(data));
}

function postActionLog(play_id, state1, state2, state3, state4, actual_action, intent_action, next_state1, next_state2, next_state3, next_state4, reward){
    const request = new XMLHttpRequest();
    let data = {
        "play_id" : play_id,
        "state1": state1,
        "state2": state2,
        "state3": state3,
        "state4": state4,
        "actual_action": actual_action,
        "intent_action": actual_action,
        "next_state1": next_state1,
        "next_state2": next_state2,
        "next_state3": next_state3,
        "next_state4": next_state4,
        "reward": reward,
    };
    // TODO actual_action -> intent_action
    request.open('POST', '/api/v1/actions/add');
    request.addEventListener("error", ()=>{
        console.log("Network Error!")
    });
    request.addEventListener("load", (event)=>{
        console.log(event.target.status);  
        if(event.target.status != 200){  
            console.log(event.target.responseText);
            console.log(`Error: ${event.target.status}`);
            return
        }
    });
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(data));
}

function postEvalLog(play_id, action_id, eval){
    const request = new XMLHttpRequest();
    const data = {
        "play_id" : play_id,
        "action_id": action_id,
        "eval": eval,
    };
    request.open("POST", "/api/v1/evaluations/add");
    request.addEventListener("error", ()=>{
        console.log("Network Error!")
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

function postTaskFinish(play_id, n_steps, is_goal){
    const request = new XMLHttpRequest();
    const data = {
        "play_id": play_id,
        "n_steps": n_steps,
        "is_goal": is_goal,
    };
    request.open("POST", '/api/v1/plays/finish');
    request.addEventListener("error", ()=>{
        console.log("Network Error!")
    });
    request.addEventListener("load", (event)=>{
        console.log(event.target.status);
        if(event.target.status != 200){
            console.log(`Error: ${event.target.status}`);
            console.log(event.target.responseText);
            return
        }

    });
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify(data));
}

function getActionHistory(given_play_id){
    const request = new XMLHttpRequest();
    let param = "play_id="+given_play_id
    request.responseType = "json"
    request.open("GET", '/api/v1/action_history?'+param);
    request.addEventListener("error", ()=>{
        console.log("Network Error!")
    });
    request.addEventListener("load", (event)=>{
        console.log(event.target.status);
        if(event.target.status == 200){
            const json = request.response;
            history = json.action_history;
            // 再生開始
            init_replay();
            if(task_id==1){
                replay(1000);
            }
            if(task_id==2){
                replay(50);
            }
            
        }
        if(event.target.status != 200){
            console.log(`Error: ${event.target.status}`);
            console.log(event.target.responseText);
            return
        }
        
    });
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.send();
}