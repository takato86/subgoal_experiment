from django.shortcuts import render
from .forms import UserForm
from django.utils import timezone
from .utils import set_cookie
from django.http import HttpResponseRedirect, HttpResponse
from .models import User, FourroomsSubgoal, PinballSubgoal
import csv


def render_description(request):
    # messages = []
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            # import pdb; pdb.set_trace()
            user = form.save()
            response = HttpResponseRedirect('tasks/fourrooms/description')
            set_cookie(response, 'user_id', user.id, 365*24*60*60)
            return response
    else:
        form = UserForm()
    return render(request, 'exp/tasks/description.html', {"form":form})


def render_fourrooms_description(request):
    return render(request, 'exp/tasks/fourrooms/description.html', {})


def render_fourrooms_decide_subgoals(request):
    return render(request, 'exp/tasks/fourrooms/decide_subgoals.html')


def render_pinball_description(request):
    return render(request, 'exp/tasks/pinball/description.html', {})


def render_pinball_decide_subgoals(request):
    return render(request, 'exp/tasks/pinball/decide_subgoals.html', {})


def render_start_page(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.created_datetime = timezone.now()
            post.save()
            response = HttpResponseRedirect('/tasks/description')
            set_cookie(response, 'user_id', post.id, 365*24*60*60)
            return response
    else:
        form = UserForm()
    return render(request, 'exp/tasks/start.html', {'form' : form})


def render_end_page(request):
    return render(request, 'exp/tasks/end.html', {})


def export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="fourrooms_subgoals.csv"'
    writer = csv.writer(response)
    csv_header = ["id", "user_id", "task_id", "state"]
    writer.writerow(csv_header)
    for subgoal in FourroomsSubgoal.objects.all():
        writer.writerow(subgoal.to_list())
    return response
