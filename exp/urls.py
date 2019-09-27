from django.urls import path 
from . import views

urlpatterns = [
    path('', views.render_description, name='description'),
    path('exp/tasks/fourroom/play/description', views.render_play_description, name='play_fourroom_description'),
    path('exp/tasks/fourroom/play', views.render_fourroom, name='fourroom'),
    path('exp/tasks/fourroom/reflection/description', views.render_reflection_description, name='reflection_fourroom_description'),
    path('exp/tasks/fourroom/reflection', views.render_fourroom_reflection, name='fourroom_reflection'),
    path('exp/tasks/pinball/play', views.render_pinball, name='pinball'),
    path('exp/tasks/pinball/reflection', views.render_pinball_reflection, name='pinball_reflection'),
    path('export_csv', views.export_csv, name='export_csv'),
    path('exp/description', views.render_description, name='description'),
    path('exp/tasks/fourroom/trajectory/register', views.render_register_trajectory, name='register_trajectory'),
    path('exp/tasks/fourroom/decide_subgoals', views.render_decide_subgoals, name='decide_subgoals'),
    path('exp/end', views.render_end_page, name='end_page'),
]