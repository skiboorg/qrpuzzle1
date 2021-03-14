
from django.urls import path
from . import views

urlpatterns = [

    path('', views.index1, name='index1'),
    path('entrance', views.index, name='index'),
    path('login', views.login, name='login'),
    path('about', views.about, name='about'),
    path('rating', views.rating, name='rating'),
    path('rules', views.rules, name='rules'),
    path('info', views.info, name='info'),
    path('feedbacks', views.feedbacks, name='feedbacks'),
    path('contacts', views.callback, name='contacts'),
    path('register', views.register, name='register_page'),
    path('game/', views.game, name='game'),
    path('slider/', views.slider, name='slider'),
    path('lk/', views.lk, name='lk'),
    path('clear_rating/', views.clear_rating, name='clear_rating'),

]
