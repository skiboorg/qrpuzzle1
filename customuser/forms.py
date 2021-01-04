from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User


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
