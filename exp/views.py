from django.shortcuts import render
from .forms import UserForm
from django.utils import timezone
from django.shortcuts import redirect
from .utils import set_cookie
from django.http import HttpResponseRedirect, HttpResponse
from .models import Play, Task, User, Evaluation, Trajectory, Experience
import csv

def render_description(request):
    # messages = []
    if request.method == 'POST':
        form = UserForm(request.POST)
        acceptance = int(request.POST.get("is_acceptance"))
        if form.is_valid():
            # import pdb; pdb.set_trace()
            user = form.save()
            response = HttpResponseRedirect('./exp/tasks/fourroom/play/description')
            set_cookie(response, 'user_id', user.id, 365*24*60*60)
            return response
    else:
        form = UserForm()
    return render(request, 'exp/description.html', {"form":form})

def render_play_description(request):
    return render(request, 'exp/tasks/fourrooms/play_description.html', {})

def render_reflection_description(request):
    return render(request, 'exp/tasks/fourrooms/ref_description.html', {})

def render_fourroom(request):
    return render(request, 'exp/tasks/fourrooms/fourroom.html', {})

def render_register_trajectory(request):
    return render(request, 'exp/tasks/fourrooms/register.html', {})

def render_fourroom_reflection(request):
    # user_idとtask_type，taskが必要←requestに含まれる必要．
    user_id = request.COOKIES['user_id']
    task_type = request.COOKIES['task_type']
    task_id = request.COOKIES['task_id']
    user = User.objects.get(id=user_id)
    task = task_id
    play_ids = Play.objects.filter(user=user, task=task, task_type=task_type).values('id')
    return render(request, 'exp/tasks/fourrooms/fourroom_ref.html', {'play_ids':play_ids})

def render_pinball_reflection(request):
    user_id = request.COOKIES['user_id']
    task_type = request.COOKIES['task_type']
    task_id = request.COOKIES['task_id']
    user = User.objects.get(id=user_id)
    task = task_id
    play_ids = Play.objects.filter(user=user, task=task, task_type=task_type).values('id')[:3]
    return render(request, 'exp/tasks/pinball/pinball_ref.html', {'play_ids':play_ids})

def render_decide_subgoals(request):
    task_id = request.COOKIES['task_id']
    trajectory_ids = Trajectory.objects.filter(task=task_id).values("id")[:4]
    return render(request, 'exp/tasks/fourrooms/decide_subgoals.html', {"trajectory_ids":trajectory_ids})

def render_pinball(request):
    return render(request, 'exp/tasks/pinball/pinball.html', {})

def render_start_page(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.created_datetime = timezone.now()
            post.save()
            response = HttpResponseRedirect('./exp/description')
            set_cookie(response, 'user_id', post.id, 365*24*60*60)
            return response
    else:
        form = UserForm()
    return render(request, 'exp/start.html', {'form' : form})

def render_end_page(request):
    return render(request, 'exp/end.html', {})

def export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="trajectory.csv"'
    writer = csv.writer(response)
    csv_header = ["id", "trajectory_id", "order", "state", "action", "next_state"]
    writer.writerow(csv_header)
    # for evaluation in Evaluation.objects.all():
    #     writer.writerow(evaluation.to_list())
    

    for experience in Experience.objects.all():
        writer.writerow(experience.to_list())
    return response