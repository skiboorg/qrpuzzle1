# Generated by Django 3.1.4 on 2021-03-15 18:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customuser', '0011_feedback_is_show'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feedback',
            name='img',
            field=models.ImageField(blank=True, null=True, upload_to='feedback/images', verbose_name='IMG'),
        ),
        migrations.AlterField(
            model_name='user',
            name='balance',
            field=models.IntegerField(default=1000, verbose_name='Баланс'),
        ),
    ]
