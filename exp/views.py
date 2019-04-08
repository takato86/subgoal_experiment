from django.shortcuts import render
from .forms import UserForm
from django.utils import timezone
from django.shortcuts import redirect

def render_fourroom(request):
    return render(request, 'exp/fourroom.html', {})

def render_pinball(request):
    return render(request, 'exp/pinball.html', {})

def render_start_page(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.created_datetime = timezone.now()
            post.save()
            return redirect('./fourroom')
    else:
        form = UserForm()
    return render(request, 'exp/start.html', {'form' : form})
