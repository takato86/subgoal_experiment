from django.urls import path
from api import views

app_name = 'api'
urlpatterns = [
    path('v1/fourrooms/subgoals', views.save_fourrooms_subgoals,
         name='save_fourrooms_subgoals'),
    path('v1/pinball/subgoals', views.save_pinball_subgoals,
         name='save_pinball_subgoals')
]
