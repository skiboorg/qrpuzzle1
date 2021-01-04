from modeltranslation.translator import register, TranslationOptions
from .models import *


@register(Settings)
class SeoTagTranslationOptions(TranslationOptions):
    fields = ( 'rules','about','info',)






