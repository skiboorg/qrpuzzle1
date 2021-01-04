from django.urls import path
from . import views

urlpatterns = [

   path('logout/', views.logout_page, name='logout_page'),
   path('register/', views.register, name='register'),
   path('login_req/', views.login_req, name='login_req'),
   path('get_chats/', views.get_chats, name='get_chats'),
   path('new_msg/', views.new_msg, name='new_msg'),
   # path('profile/', views.profile, name='profile'),
   path('profile/edit', views.profile_edit, name='profile_edit'),
   path('new_deposit', views.new_deposit, name='new_deposit'),
   # path('profile/add', views.profile_add, name='profile_add'),
   # path('profile/video_edit/<video_id>', views.profile_video_edit, name='profile_video_edit'),
   # path('profile/history', views.profile_history, name='profile_history'),

]
