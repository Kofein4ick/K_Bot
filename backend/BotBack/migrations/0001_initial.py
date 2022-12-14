# Generated by Django 3.2.15 on 2022-10-04 16:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Questions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Answers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('Next_Quest', models.PositiveIntegerField()),
                ('Q_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='BotBack.questions')),
            ],
        ),
    ]
