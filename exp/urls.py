from django.urls import path 
from . import views

urlpatterns = [
    path('', views.render_start_page, name='render_start_page'),
    path('fourroom', views.render_fourroom, name='render_fourroom'),
    path('pinball', views.render_pinball, name='render_pinball'),
    path('fourroom_ref', views.render_fourroom_reflection, name='render_fourroom_reflection'),
    path('pinball_ref', views.render_pinball_reflection, name='render_pinball_reflection'),
    path('export_csv', views.export_csv, name='export_csv'),
]
