# Generated by Django 3.2.13 on 2022-10-25 04:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0012_auto_20221025_0407'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gamestate',
            name='ended',
            field=models.DateTimeField(blank=True),
        ),
    ]