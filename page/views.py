from django.http import HttpResponseRedirect
from django.shortcuts import render
from game.models import Game,Level
from .models import *
from customuser.models import User
def index1(request):
    return render(request, 'page/index.html', locals())
def index(request):
    style = 'dark'
    indexPage = True
    aboutText = Settings.objects.first().about
    rulesText = Settings.objects.first().rules
    indoText = Settings.objects.first().info
    level1 = Level.objects.get(id=1)
    level2 = Level.objects.get(id=2)
    level3 = Level.objects.get(id=3)

    return render(request, 'page/entrance.html', locals())

def register(request):
    return render(request, 'page/reg.html', locals())
def login(request):
    return render(request, 'page/login.html', locals())

def game(request):
    aboutText = Settings.objects.first().about
    rulesText = Settings.objects.first().rules
    indoText = Settings.objects.first().info
    level1 = Level.objects.get(id=1)
    level2 = Level.objects.get(id=2)
    level3 = Level.objects.get(id=3)

    return render(request, 'page/game.html', locals())


def slider(request):
    return render(request, 'page/slider.html', locals())


def clear_rating(request):
    if request.user.is_superuser:
        users = User.objects.all()
        for user in users:
            user.rating = 0
            user.save()
        return HttpResponseRedirect('/lk')
def lk(request):
    aboutText = Settings.objects.first().about
    rulesText = Settings.objects.first().rules
    indoText = Settings.objects.first().info
    level1 = Level.objects.get(id=1)
    level2 = Level.objects.get(id=2)
    level3 = Level.objects.get(id=3)
    if request.user.is_authenticated:
        allGames = Game.objects.filter(player=request.user).order_by('-date')
        user = request.user
        return render(request, 'page/lk.html', locals())
    else:
        return render(request, 'page/index.html', locals())
