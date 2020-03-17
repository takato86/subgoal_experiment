import json
from django.http import HttpResponse
from exp.models import PinballSubgoal, FourroomsSubgoal, User


def render_json_responce(request, data, status=None):
    json_str = json.dumps(data, ensure_ascii=False, indent=2)
    callback = request.GET.get('callback')
    if not callback:
        callback = request.POST.get('callback')
    if callback:
        json_str = "%s(%s)" % (callback, json_str)
        response = HttpResponse(json_str,
                                content_type='application/javascript; charset=UTF-8',
                                status=status)
    else:
        response = HttpResponse(json_str,
                                content_type='application/json; charset=UTF-8',
                                status=status)
    return response


def save_fourrooms_subgoals(request):
    request_json = json.loads(request.body)
    contents = request_json["subgoals"]
    user_id = request_json["user_id"]
    user = User.objects.get(id=user_id)
    task = request_json["task_id"]
    for content in contents:
        state = content["state"]
        order = content["order"]
        subgoal = FourroomsSubgoal.objects.create(user=user,
                                                  task=task,
                                                  order=order,
                                                  state=state)
        subgoal.save()
    return render_json_responce(request, {})


def save_pinball_subgoals(request):
    request_json = json.loads(request.body)
    subgoals = request_json["subgoals"]
    user_id = request_json["user_id"]
    user = User.objects.get(id=user_id)
    task_id = request_json["task_id"]
    for subgoal in subgoals:
        x = subgoal["x"]
        y = subgoal["y"]
        rad = subgoal["rad"]
        order = subgoal["order"]
        subgoal = PinballSubgoal.objects.create(user=user,
                                                task=task_id,
                                                order=order,
                                                x=x,
                                                y=y,
                                                rad=rad)
        subgoal.save()
    return render_json_responce(request, {})
