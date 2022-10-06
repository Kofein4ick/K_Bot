# Generated by Django 4.1.1 on 2022-10-01 21:10

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Questions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number_question', models.IntegerField(verbose_name='Номер вопроса')),
                ('question', models.CharField(max_length=250, verbose_name='Вопрос')),
                ('number_answer', models.IntegerField(verbose_name='Номер ответа')),
                ('variant_answer', models.CharField(max_length=250, verbose_name='Вариант ответа')),
            ],
            options={
                'verbose_name': 'Вопросы и ответы',
                'verbose_name_plural': 'Вопросы и ответы',
            },
        ),
    ]