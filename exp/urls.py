from django.urls import path 
from . import views

urlpatterns = [
    path('', views.render_description, name='description'),
    path('exp/tasks/fourrooms/description', views.render_fourrooms_description,
         name='fourrooms_description'),
    path('exp/tasks/pinball/decide_subgoals', views.render_pinball_decide_subgoals,
         name='pinball_decide_subgoals'),
    path('export_csv', views.export_csv, name='export_csv'),
    path('exp/description', views.render_description, name='description'),
    path('exp/tasks/fourrooms/decide_subgoals', views.render_fourrooms_decide_subgoals,
         name='fourrooms_decide_subgoals'),
    path('exp/end', views.render_end_page, name='end_page'),
]