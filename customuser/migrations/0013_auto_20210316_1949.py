# Generated by Django 3.1.4 on 2021-03-16 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customuser', '0012_auto_20210315_2148'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='age',
            field=models.IntegerField(blank=True, default=0, verbose_name='Возраст'),
        ),
    ]
