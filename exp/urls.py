from django.urls import path 
from . import views

urlpatterns = [
     path('', views.render_description, name='description'),
     path('tasks/description', views.render_description, name='description'),
     path('tasks/fourrooms/description', views.render_fourrooms_description,
          name='fourrooms_description'),
     path('tasks/fourrooms/decide_subgoals',
          views.render_fourrooms_decide_subgoals,
          name='fourrooms_decide_subgoals'),
     path('tasks/pinball/description', views.render_pinball_description,
          name='pinball_description'),
     path('tasks/pinball/decide_subgoals',
          views.render_pinball_decide_subgoals,
          name='pinball_decide_subgoals'),
     path('tasks/end', views.render_end_page, name='end_page'),
     path('tasks/export_csv', views.export_csv, name='export_csv'),
]
