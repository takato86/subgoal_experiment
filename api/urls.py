from django.urls import path
from api import views

app_name = 'api'
urlpatterns = [
    path('v1/plays/start', views.play_start, name='play_start'),
    path('v1/plays/finish', views.play_finish, name='play_finish'),
    path('v1/actions/add', views.add_action, name='add_action'),   
    path('v1/action_history', views.get_action_history, name='get_action_history'),
]