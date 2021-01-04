# Generated by Django 3.0.6 on 2020-05-13 18:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import game.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('size_x', models.IntegerField()),
                ('size_y', models.IntegerField()),
                ('time', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('image', models.ImageField(upload_to=game.models.game_images_dir)),
                ('code', models.CharField(default=uuid.uuid4, max_length=36)),
                ('level', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='game.Level')),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, upload_to='games/')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('start', models.DateTimeField(auto_now_add=True)),
                ('end', models.DateTimeField(auto_now_add=True)),
                ('time', models.IntegerField(default=0)),
                ('level', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='game.Level')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
