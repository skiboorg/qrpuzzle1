from django.contrib import admin
from .models import *


class UserAdmin(admin.ModelAdmin):
    list_display = [
        "email",
        "balance",
        "rating",

    ]
admin.site.register(User, UserAdmin)
admin.site.register(Feedback)
admin.site.register(CallBack)
