from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField

class Settings(models.Model):
    rules = RichTextUploadingField('Правила', blank=True, null=True)
    about = RichTextUploadingField('О нас', blank=True, null=True)
    info = RichTextUploadingField('Инфо', blank=True, null=True)
