# Generated by Django 3.0.6 on 2020-05-16 10:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0004_auto_20200516_1235'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='level',
            field=models.IntegerField(default=0),
        ),
    ]
