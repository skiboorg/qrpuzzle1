import decimal
import json

from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from .models import Game, Level

LEVELS = {150:1, 120:2, 100:3}

def start(request):
    print('start game')
    print(request.POST)
    Game.objects.filter(player__isnull=True).delete()

    try:
        puzzle_length = int(request.POST.get('puzzle_length'))
        # level = LEVELS[puzzle_length]
        level = Level.objects.get(id=LEVELS[puzzle_length])
        print(level)
    except:
        return JsonResponse({'code': 400, 'error': 'Invalid puzzle_length'})
    else:
        if request.user.is_authenticated:
            game = Game(player=request.user, game_type=int(request.POST.get('game_type')))
        else:
            game = Game(game_type=int(request.POST.get('game_type')))
        print('game',game)
        game.level = level
        game.save()
        print('game info', game.id)

        return JsonResponse({'code': 200, 'image': game.image.url, 'game_id': game.id, 'level': level.id,'timer':level.timer})

def win(request):
    request_unicode = request.body.decode('utf-8')
    request_body = json.loads(request_unicode)
    game = Game.objects.get(id=request_body['game_id'])
    game.result = True
    game.save()
    if game.player:
        game.player.rating += game.level.rating
        print(game.player.balance)
        print(game.level.balance / 100)
        game.player.balance += game.player.balance * decimal.Decimal((game.level.balance / 100))
        game.player.save()
        return JsonResponse({'rating': game.player.rating})
    else:
        return JsonResponse({'rating': 0})


def theme_light(request):
    request.session['theme']  = 'light'
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
def theme_dark(request):
    request.session['theme'] = 'dark'
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))