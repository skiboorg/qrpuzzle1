from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db.models.signals import post_save
from chat.models import *

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):

    username = None
    first_name = None
    last_name = None
    email = models.EmailField('Эл. почта', blank=False , null=True, unique=True)
    nickname = models.CharField('Ник', max_length=50, blank=False, null=True)
    avatar = models.ImageField('Аватар', upload_to='user/avatar', blank=True, null=True)
    balance = models.IntegerField('Баланс', default=300)
    rating = models.IntegerField('Рейтинг', default=0)
    age = models.IntegerField('Возраст', default=0)
    last_image = models.IntegerField(default=0)
    region = models.CharField('Регион', max_length=50, blank=True, null=True)
    sex = models.CharField('Пол', max_length=50, blank=True, null=True)
    study = models.CharField('Образование', max_length=50, blank=True, null=True)
    profile_ok = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_user_avatar(self):
        if self.avatar:
            return self.avatar.url
        else:
            return 'https://placehold.it/60'



def user_post_save(sender, instance, created, **kwargs):
    if created:
        newChat = Chat.objects.create(user=instance)
        Message.objects.create(chat=newChat,message='Тест приветственного сообщения')

post_save.connect(user_post_save, sender=User)


class Feedback(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    message = models.TextField('Текст', blank=False, null=True)
    img = models.ImageField('IMG', upload_to='feedback/images', blank=False, null=True)


class CallBack(models.Model):
    name = models.CharField('Имя', max_length=50, blank=True, null=True)
    email = models.CharField('Email', max_length=50, blank=True, null=True)
    message = models.TextField('Текст', blank=False, null=True)
