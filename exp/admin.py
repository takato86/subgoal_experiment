from django.contrib import admin
from .models import Task, Action, Evaluation, Play, User


admin.site.register(Task)
admin.site.register(Action)
admin.site.register(Evaluation)
admin.site.register(Play)
admin.site.register(User)
