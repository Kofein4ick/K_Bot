# Generated by Django 4.1.1 on 2022-10-06 00:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bot', '0012_alter_answers_answer_alter_answers_next_question_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='answers',
            name='question',
        ),
        migrations.AddField(
            model_name='answers',
            name='question_id',
            field=models.IntegerField(null=True),
        ),
    ]