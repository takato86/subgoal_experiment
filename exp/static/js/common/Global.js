// task _type = ["reha", "exp"]
let Player = {}
let Env = {}
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