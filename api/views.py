from django.shortcuts import render
import json
from django.http import HttpResponse
from exp.models import Play, Action, Evaluation
# Create your views here.

def render_json_responce(request, data, status=None):
    json_str = json.dumps(data, ensure_ascii=False, indent=2)
    callback = request.GET.get('callback')
    if not callback:
        callback = request.POST.get('callback')
    if callback:
        json_str = "%s(%s)" % (callback, json_str)
        response = HttpResponse(json_str, content_type='application/javascript; charset=UTF-8', status=status)
    else:
        response = HttpResponse(json_str, content_type='application/json; charset=UTF-8', status=status)
    return response

def play_start(request):
    request_json = json.loads(request.body)
    user_id = request_json['user_id']
    task_id = request_json['task_id']
    goal = request_json['goal']
    task_type = request_json['task_type']
    play = Play()
    play_id = play.start(task_id, user_id, goal, task_type)
    data = {'play_id':play_id}
    return render_json_responce(request, data)

def play_finish(request):
    request_json = json.loads(request.body)
    play_id = request_json['play_id']
    n_steps = request_json['n_steps']
    is_goal = request_json['is_goal']
    play = Play.objects.get(id=play_id)
    play.finish(n_steps, is_goal)
    data = {}
    return render_json_responce(request, data)

def add_action(request):
    request_json = json.loads(request.body)
    play_id = request_json['play_id']
    play = Play.objects.get(id=play_id)
    state1 = request_json['state1']
    state2 = request_json['state2']
    state3 = request_json['state3']
    state4 = request_json['state4']
    actual_action = request_json['actual_action']
    intent_action = request_json['intent_action']
    next_state1 = request_json['next_state1']
    next_state2 = request_json['next_state2']
    next_state3 = request_json['next_state3']
    next_state4 = request_json['next_state4']
    reward = request_json['reward']
    action = Action.objects.create(play=play, state1=state1,state2=state2,state3=state3,state4=state4,intent_action=intent_action, actual_action=actual_action, next_state1=next_state1, next_state2=next_state2, next_state3=next_state3, next_state4=next_state4, reward=reward)
    action.save()
    data = {}
    return render_json_responce(request, data)

def add_eval(request):
    request_json = json.loads(request.body)
    play_id = request_json["play_id"]
    action_id = request_json["action_id"]
    play = Play.objects.get(id=play_id)
    action = Action.objects.get(id=action_id)
    eval_val = request_json["eval"]
    evaluation = Evaluation.objects.create(play=play, action=action, evaluation=eval_val)
    evaluation.save()
    data = {}
    return render_json_responce(request, data)

def get_action_history(request):
    if 'play_id' in request.GET:
        play_id = request.GET.get('play_id')
    data = {}
    play = Play.objects.get(id=play_id)
    action_history = []
    
    for action in Action.objects.filter(play=play):
        action_history.append(action.to_dict())
    data = {'action_history' : action_history, 'goal':play.goal}
    return render_json_responce(request, data)
