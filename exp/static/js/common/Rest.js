function postTaskStart(user_id, task_id, task_type){
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
            let experiment = document.getElementById('experiment');
            play_id = json.play_id
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

function postActionLog(play_id, state1, state2, state3, state4, actual_action, intent_action){
    const request = new XMLHttpRequest();
    let data = {
        "play_id" : play_id,
        "state1": state1,
        "state2": state2,
        "state3": state3,
        "state4": state4,
        "actual_action": actual_action,
        "intent_action": actual_action,
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

function postEvalLog(play_id, state1, state2, state3, state4, action, eval){
    const request = new XMLHttpRequest();
    const data = {
        "play_id" : play_id,
        "state1": state1,
        "state2": state2,
        "state3": state3,
        "state4": state4,
        "action": action,
        "eval": eval,
    };
    request.open("POST", "");
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
        if(event.target.status != 200){
            console.log(`Error: ${event.target.status}`);
            return
        }
        console.log(event.target.status);
        console.log(event.target.responseText);
    });
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify(data));
}

function getTaskIds(user_id, task_type){
    const request = new XMLHttpRequest();
    const data = {
        "user_id": user_id,
        "task_type": task_type,
    };
    const parameter = '?user_id='+user_id+'&task_type='+task_type;
    request.responseType = "json"
    request.open("GET", ""+parameter);
    request.addEventListener("error", ()=>{
        console.log("Network Error!")
    });
    request.addEventListener("load", (event)=>{
        if(event.target.status == 200){
            const json = request.response;
            const obj = JSON.parse(json);
            // TODO
        }
        if(event.target.status != 200){
            console.log(`Error: ${event.target.status}`);
            return
        }
        console.log(event.target.status);
        console.log(event.target.responseText);
    });
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.send();
}

function getTaskHistory(task_id){
    const request = new XMLHttpRequest();
    const options = {
        url: '',
        method: 'GET',
        json:{
            "task_id": task_id,
        }
    };
    request.responseType = "json"
    request.open(options);
    request.addEventListener("error", ()=>{
        console.log("Network Error!")
    });
    request.addEventListener("load", (event)=>{
        if(event.target.status == 200){
            const json = request.response;
            const obj = JSON.parse(json);
            // TODO
        }
        if(event.target.status != 200){
            console.log(`Error: ${event.target.status}`);
            return
        }
        console.log(event.target.status);
        console.log(event.target.responseText);
    });
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.send();
}