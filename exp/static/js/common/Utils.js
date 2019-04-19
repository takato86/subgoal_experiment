function arange_state(state){
    if(state instanceof Array){
        diff = 4 - state.length;
        for(let i=0; i<diff; i++){
            state.push(null);
        }
        return state
    }else{
        return [state, null, null, null];
    }
}

function restore_state(log){
    let states = [log["state1"], log["state2"], log["state3"], log["state4"]];
    let null_counter = 0;
    for(state of states){
        if(state == null){
            null_counter++;
        }
    }
    let ret_array = [];
    switch(null_counter){
        case 0:
                ret_array = [log["state4"]];
        case 1:
                ret_array.unshift(log["state3"]);
        case 2:
                ret_array.unshift(log["state1"], log["state2"]);
                return ret_array;
        case 3: 
                return log["state1"];
        default:
                console.error("null_counter value is invalid");
    }
}
