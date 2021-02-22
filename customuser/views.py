from django.shortcuts import render
from .forms import *
from django.http import JsonResponse, HttpResponseRedirect
import json
from django.contrib.auth import login, logout,authenticate
from chat.models import *
from .forms import FeedbackForm
def register(request):

    request_unicode = request.body.decode('utf-8')
    request_body = json.loads(request_unicode)
    data = request.POST.copy()
    print(request_body)
    form = SignUpForm(request_body)
    print(form.errors)
    if form.is_valid():
        new_user = form.save()


        login(request, new_user)
        return JsonResponse({'status': 'success'}, safe=False)
    else:
        return JsonResponse({'status':'error','errors': form.errors}, safe=False)

def login_req(request):
    request_unicode = request.body.decode('utf-8')
    request_body = json.loads(request_unicode)
    print(request_body)
    user = authenticate(email=request_body['email'], password=request_body['password'])
    if user is not None:
        login(request, user)
        return JsonResponse({'status': 'success'}, safe=False)
    else:
        return JsonResponse({'status':'error'}, safe=False)

def logout_page(request):
    logout(request)
    return HttpResponseRedirect('/')


def profile_edit(request):
    if request.user.is_authenticated:
        if request.POST:
            print(request.POST)

            form = UpdateForm(request.POST, request.FILES, instance=request.user)
            print(form.errors)
            if form.is_valid():
                user = form.save()

                # if request.POST.get('old_password'):
                #     if not user.is_social_reg:
                #         success = user.check_password(request.POST['old_password'])
                #     else:
                #         success = True
                #     if success:
                #         print('Old pass is good')
                #         if request.POST.get('password1') == request.POST.get('password2') and request.POST.get('password1') != '' and request.POST.get('password2') != '':
                #             print('Change password')
                #             user.set_password(request.POST.get('password1'))
                #         else:
                #             print('NOT Change password')
                #     else:
                #         print('Old pass is bad')
                #         return HttpResponseRedirect("/user/profile/edit")
                user.save()
                return HttpResponseRedirect('/user/profile/edit')
            else:
                form = UpdateForm()
            return HttpResponseRedirect("/lk?tab=settings")


        updateForm = UpdateForm()
        return HttpResponseRedirect("/lk?tab=settings")
    else:
        return HttpResponseRedirect('/')


def get_chats(request):
    chat = Chat.objects.get(user=request.user)
    all_messages=[]
    if chat.message_set:
        for msg in chat.message_set.all():
            all_messages.append(
                {'own_message': True if msg.isUserMessage else False,
                 'text': msg.message,
                 'from': msg.chat.user.nickname if msg.isUserMessage else 'SUPPORT',
                 'date': msg.created.strftime("%d.%m.%Y,%H:%M:%S")}
            )
            msg.isRead = True
            msg.save()
        return JsonResponse(all_messages, safe=False)

def new_msg(request):
    request_unicode = request.body.decode('utf-8')
    request_body = json.loads(request_unicode)
    chat = Chat.objects.get(user=request.user)
    Message.objects.create(chat=chat, isUserMessage=True,message=request_body['text'])
    return JsonResponse({'status':'ok'}, safe=False)

def new_deposit(request):
    request_unicode = request.body.decode('utf-8')
    request_body = json.loads(request_unicode)
    request.user.balance += int(request_body['summ'])
    request.user.save()
    return JsonResponse({'status':'ok'}, safe=False)


