from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.forms import ModelForm
from .models import *


class SignUpForm(UserCreationForm):
    email = forms.EmailField(max_length=254, help_text='Required. Inform a valid email address.')

    class Meta:
        model = User
        fields = ('email', 'nickname',  'password1', 'password2', )

class UpdateForm(UserChangeForm):
    class Meta:
        model = User
        fields = ('email', 'nickname', 'age', 'study', 'region', 'avatar','sex' )

        error_messages = {
             'email': {
                 'unique': "Указанный адрес уже кем-то используется",
             },}

class FeedbackForm(ModelForm):
    class Meta:
        model = Feedback
        fields = ('img','message')

class CallbackForm(ModelForm):
    class Meta:
        model = CallBack
        fields = ('name','email','message')
