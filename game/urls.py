
from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.start, name='start'),
    path('win/', views.win, name='win'),
    path('theme_dark/', views.theme_dark, name='theme_dark'),
    path('theme_light/', views.theme_light, name='theme_light'),

]
