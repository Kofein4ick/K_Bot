# Generated by Django 3.2.15 on 2022-10-14 12:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BotBack', '0020_auto_20221013_2310'),
    ]

    operations = [
        migrations.CreateModel(
            name='FAQ_Resp_Q_A',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Qtext', models.TextField(blank=True)),
                ('Atext', models.TextField(blank=True)),
                ('Link', models.TextField(blank=True)),
            ],
        ),
    ]
