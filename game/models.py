import os
import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

import segno
from PIL import Image as PILImage
from io import BytesIO
from django.core.files import File
import random
from faker import Faker
from customuser.models import User
import puzzle_game.settings
from django_random_queryset import RandomManager
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

class Level(models.Model):
    name = models.CharField('Название',max_length=50,null=True,blank=True)
    timer = models.IntegerField('Таймер в минутах',default=0)
    rating = models.IntegerField('+рейтинг',default=0)
    balance = models.IntegerField('+баланс в %',default=0)

    def __str__(self):
        return f'{self.id}: {self.name}'


def game_images_dir(instance, filename):
    extension = filename.split('.')[-1]
    return '{}/%Y/%m/%d/.{}'.format(os.path.join(settings.GAMEIMAGES, str(instance.code)), extension)

class Image(models.Model):
    lev = models.ForeignKey(Level, related_name='images', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to=game_images_dir)
    code = models.CharField(max_length=36, default=uuid.uuid4)

    def __str__(self):
        return '{id}: {title}'.format(id=self.id, title=self.title)

class GameImage(models.Model):
    image = models.ImageField(blank=True, upload_to='game_images/')
    objects = RandomManager()


class Game(models.Model):
    player = models.ForeignKey(User, blank=True, on_delete=models.CASCADE, null=True)
    # lev = models.ForeignKey(Level, on_delete=models.PROTECT, null=True, blank=True)
    # image = models.ForeignKey(Image, on_delete=models.PROTECT)
    level = models.ForeignKey(Level, blank=True, on_delete=models.CASCADE, null=True)
    game_type = models.IntegerField(blank=True,null=True)
    image = models.ImageField(blank=True, upload_to='games/')
    date = models.DateTimeField(auto_now_add=True, blank=True)
    start = models.DateTimeField(auto_now_add=True, blank=True)
    result = models.BooleanField(default=False)

    def __str__(self):
        return '{id}: {user}'.format(id=self.id, user=self.player)

    def get_result(self):
        if self.result:
            return 'WIN'
        else:
            return 'LOSE'

    def get_win_rating(self):
        return self.level.rating

    def save(self, *args, **kwargs):
        if not self.image:
            self.image = self.create_qr()
        super().save(*args, **kwargs)

    def create_qr(self):
        image = None
        name = str(uuid.uuid4())
        if self.game_type == 2:
            color = tuple(random.choice(range(100)) for _ in range(3))
            fake = Faker()
            qr = segno.make_qr(fake.text(2000), version=33, error='L', mask=3)
            qr.save(f'{settings.MEDIA_ROOT}\games\{name}.png', scale=10, dark=color, light=(240, 240, 240), border=0)
            image_bytes_stream = BytesIO()
            temp_image = PILImage.open(f'{settings.MEDIA_ROOT}\games\{name}.png')
            temp_image.seek(0)
            temp_image = temp_image.resize((600, 600))
            temp_image.save(image_bytes_stream, format='png', quality=100)
            default_storage.delete('games/{}.png'.format(name))
            image = File(image_bytes_stream, name='{}.png'.format(name))
        elif self.game_type == 1:
            if self.player:
                # print(self.player)
                # images = GameImage.objects.all()
                # for img in images:
                #     if self.player.last_image != img.id :
                #         temp_image = img
                #         self.player.last_image = img.id
                #         self.player.save()
                #         break
                #     else:
                temp_image = GameImage.objects.random(1).first()
                self.player.last_image = temp_image.id
                self.player.save()
            else:
                temp_image = GameImage.objects.random(1).first()

            image_bytes_stream = BytesIO()
            temp_image = PILImage.open(f'{settings.BASE_DIR}{temp_image.image.url}')
            temp_image.seek(0)
            # temp_image = temp_image.resize((800, 800))
            temp_image.save(image_bytes_stream, format='png', quality=100)
            image = File(image_bytes_stream, name='{}.png'.format(name))

        return image