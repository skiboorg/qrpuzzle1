from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('page.urls')),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('user/', include('customuser.urls')),
    path('game/', include('game.urls')),

    path('i18n', include('django.conf.urls.i18n'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += i18n_patterns(
    path('', include('page.urls')),


)