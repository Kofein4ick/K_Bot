# Generated by Django 3.2.15 on 2022-10-10 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BotBack', '0008_remove_answers_secondanswertext'),
    ]

    operations = [
        migrations.AddField(
            model_name='answers',
            name='Link',
            field=models.TextField(blank=True),
        ),
    ]
