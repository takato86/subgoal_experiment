from django.shortcuts import render
from .forms import UserForm
from django.utils import timezone
from django.shortcuts import redirect
from .utils import set_cookie
from django.http import HttpResponseRedirect, HttpResponse
from .models import Play, Task, User, Evaluation
import csv

def render_fourroom(request):
    return render(request, 'exp/fourroom.html', {})

def render_fourroom_reflection(request):
    # user_idとtask_type，taskが必要←requestに含まれる必要．
    user_id = request.COOKIES['user_id']
    task_type = request.COOKIES['task_type']
    task_id = request.COOKIES['task_id']
    user = User.objects.get(id=user_id)
    task = Task.objects.get(id=task_id)
    play_ids = Play.objects.filter(user=user, task=task, task_type=task_type).values('id')[:3]
    return render(request, 'exp/fourroom_ref.html', {'play_ids':play_ids})

def render_pinball_reflection(request):
    user_id = request.COOKIES['user_id']
    task_type = request.COOKIES['task_type']
    task_id = request.COOKIES['task_id']
    user = User.objects.get(id=user_id)
    task = Task.objects.get(id=task_id)
    play_ids = Play.objects.filter(user=user, task=task, task_type=task_type).values('id')[:3]
    return render(request, 'exp/pinball_ref.html', {'play_ids':play_ids})

def render_pinball(request):
    return render(request, 'exp/pinball.html', {})

def render_start_page(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.created_datetime = timezone.now()
            post.save()
            response = HttpResponseRedirect('./fourroom')
            set_cookie(response, 'user_id', post.id, 365*24*60*60)
            return response
    else:
        form = UserForm()
    return render(request, 'exp/start.html', {'form' : form})

def export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="eval.csv"'
    writer = csv.writer(response)
    csv_header = ["eval_id", "play_id", "user_id", "task_name", "state1", "state2", "state3", "state4", "intent_action", "actual_action", "next_state1", "next_state2", "next_state3", "next_state4", "timestamp"]
    writer.writerow(csv_header)
    for evaluation in Evaluation.objects.all():
        writer.writerow(evaluation.to_list())
    return response