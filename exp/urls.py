from django.urls import path 
from . import views

urlpatterns = [
    path('', views.render_start_page, name='render_start_page'),
    path('fourroom', views.render_fourroom, name='render_fourroom'),
    path('pinball', views.render_pinball, name='render_pinball'),
]
