# Generated by Django 3.2.13 on 2022-10-15 00:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0010_auto_20221011_0136'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cleric',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('game.piece',),
        ),
        migrations.AddField(
            model_name='piece',
            name='shield',
            field=models.BooleanField(default=False),
        ),
    ]