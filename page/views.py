from django.http import HttpResponseRedirect
from django.shortcuts import render
from game.models import Game,Level
from .models import *
from customuser.models import *
from customuser.forms import *
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

def rating(request):
    users = User.objects.all().order_by('-rating')
    return render(request, 'page/rating.html', locals())
def about(request):
    isInfoPage = True
    aboutText = Settings.objects.first().about
    return render(request, 'page/about.html', locals())


def rules(request):
    isInfoPage = True
    rulesText = Settings.objects.first().rules
    return render(request, 'page/rules.html', locals())


def info(request):
    isInfoPage = True
    indoText = Settings.objects.first().info
    return render(request, 'page/info.html', locals())


def callback(request):
    isInfoPage = True
    if request.POST:
        req = request.POST
        form = CallbackForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    else:
        form = CallbackForm()

    form = CallbackForm()

    return render(request, 'page/contact.html', locals())

def feedbacks(request):
    print(request.POST)

    if request.POST:

        req = request.POST
        form = FeedbackForm(request.POST, request.FILES)
        if form.is_valid():
            new_f = form.save(commit=False)
            new_f.user = request.user
            new_f.save()

            return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

    else:
        form = FeedbackForm()

    form = FeedbackForm()
    allFeedbacks = Feedback.objects.filter(is_show=True)
    return render(request, 'page/feedbacks.html', locals())


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
    lkPage=True
    level1 = Level.objects.get(id=1)
    level2 = Level.objects.get(id=2)
    level3 = Level.objects.get(id=3)
    if request.user.is_authenticated:
        allGames = Game.objects.filter(player=request.user).order_by('-date')
        user = request.user
        return render(request, 'page/lk.html', locals())
    else:
        return render(request, 'page/index.html', locals())
