# Generated by Django 4.1.1 on 2022-10-05 13:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bot', '0005_answers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answers',
            name='next_question',
            field=models.IntegerField(default='Null', editable=False),
        ),
    ]