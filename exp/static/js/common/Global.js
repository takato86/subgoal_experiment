// task _type = ["reha", "exp"]
let Player = {}
let Env = {}
let play_id = -1;
Env.host = location.hostname;
Env.csrftoken = '';
Env.reward = 0;
Player.steps = 0;
Player.pre_state;
Player.cur_state;
Player.history;
let repeat = function(){};