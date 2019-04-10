from django.shortcuts import render
from .forms import UserForm
from django.utils import timezone
from django.shortcuts import redirect
from .utils import set_cookie
from django.http import HttpResponseRedirect
from .models import Play, Task, User

def render_fourroom(request):
    return render(request, 'exp/fourroom.html', {})

def render_fourroom_reflection(request):
    # user_idとtask_type，taskが必要←requestに含まれる必要．
    user_id = request.COOKIES['user_id']
    task_type = request.COOKIES['task_type']
    task_id = request.COOKIES['task_id']
    user = User.objects.get(id=user_id)
    task = Task.objects.get(id=task_id)
    play_ids = Play.objects.filter(user=user, task=task, task_type=task_type).values('id')
    return render(request, 'exp/fourroom_ref.html', {'play_ids':play_ids})

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
