from django.shortcuts import render
from .forms import UserForm
from django.utils import timezone
from .utils import set_cookie
from django.http import HttpResponseRedirect, HttpResponse
from .models import User, FourroomsSubgoal, PinballSubgoal
import csv


def render_description_1(request):
    # messages = []
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            # import pdb; pdb.set_trace()
            user = form.save()
            response = HttpResponseRedirect('/tasks/1/fourrooms/description')
            set_cookie(response, 'user_id', user.id, 365*24*60*60)
            return response
    else:
        form = UserForm()
    return render(request, 'exp/tasks/description_1.html', {"form": form})


def render_description_2(request):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            # import pdb; pdb.set_trace()
            user = form.save()
            response = HttpResponseRedirect('/tasks/2/pinball/description')
            set_cookie(response, 'user_id', user.id, 365*24*60*60)
            return response
    else:
        form = UserForm()
    return render(request, 'exp/tasks/description_2.html', {"form": form})


def render_fourrooms_description(request):
    return render(request, 'exp/tasks/fourrooms/description.html', {})


def render_fourrooms_decide_subgoals_1(request):
    return render(request, 'exp/tasks/fourrooms/decide_subgoals_1.html')


def render_fourrooms_decide_subgoals_2(request):
    return render(request, 'exp/tasks/fourrooms/decide_subgoals_2.html')


def render_pinball_description(request):
    return render(request, 'exp/tasks/pinball/description.html', {})


def render_pinball_decide_subgoals_1(request):
    return render(request, 'exp/tasks/pinball/decide_subgoals_1.html', {})


def render_pinball_decide_subgoals_2(request):
    return render(request, 'exp/tasks/pinball/decide_subgoals_2.html', {})


def render_end_page(request):
    return render(request, 'exp/tasks/end.html', {})


def export_fourrooms_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="fourrooms_subgoals.csv"'
    writer = csv.writer(response)
    csv_header = ["id", "task_id", "user_id", "order", "state"]
    writer.writerow(csv_header)
    for subgoal in FourroomsSubgoal.objects.all():
        writer.writerow(subgoal.to_list())
    return response


def export_pinball_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="pinball_subgoals.csv"'
    writer = csv.writer(response)
    csv_header = ["id", "task_id", "user_id","order", "x", "y", "rad"]
    writer.writerow(csv_header)
    for subgoal in PinballSubgoal.objects.all():
        writer.writerow(subgoal.to_list())
    return response


def visualize_fourrooms(request):
    return render(request, 'exp/tasks/fourrooms/visualize.html', {})


def visualize_pinball(request):
    return render(request, 'exp/tasks/pinball/visualize.html', {})
