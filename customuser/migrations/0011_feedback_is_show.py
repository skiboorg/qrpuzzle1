# Generated by Django 3.1.4 on 2021-03-15 18:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customuser', '0010_feedback_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='is_show',
            field=models.BooleanField(default=False),
        ),
    ]
