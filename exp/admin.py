from django.contrib import admin
from .models import Task, Action, Evaluation


admin.site.register(Task)
admin.site.register(Action)
admin.site.register(Evaluation)
