# Generated by Django 2.2.7 on 2020-05-17 17:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customuser', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='last_image',
            field=models.IntegerField(default=0),
        ),
    ]
