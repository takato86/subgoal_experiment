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
            response = HttpResponseRedirect('/exp/tasks/fourrooms/description')
            set_cookie(response, 'user_id', user.id, 365*24*60*60)
            return response
    else:
        form = UserForm()
    return render(request, 'exp/description.html', {"form":form})

def render_fourrooms_description(request):
    return render(request, 'exp/tasks/fourrooms/description.html', {})

def render_fourrooms_decide_subgoals(request):
    return render(request, 'exp/tasks/fourrooms/decide_subgoals.html')

def render_pinball_decide_subgoals(request):
    return render(request, 'exp/tasks/pinball/decide_subgoals.html', {})

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
    
    for experience in Experience.objects.all():
        writer.writerow(experience.to_list())
    return response