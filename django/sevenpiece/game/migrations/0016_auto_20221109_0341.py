# Generated by Django 3.2.13 on 2022-11-09 03:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('game', '0015_gamestate_start_turn_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='player',
            name='session',
        ),
        migrations.AddField(
            model_name='player',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
