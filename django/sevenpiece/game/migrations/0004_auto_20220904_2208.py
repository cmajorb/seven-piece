# Generated by Django 3.2.5 on 2022-09-04 22:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('game', '0003_piece_range'),
    ]

    operations = [
        migrations.AddField(
            model_name='gamestate',
            name='turn_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='gamestate',
            name='state',
            field=models.CharField(choices=[('WAITING', 'Waiting for players'), ('READY', 'Ready to play'), ('PLAYING', 'Game in progress'), ('FINISHED', 'Game Over')], default='WAITING', max_length=50),
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.IntegerField(default=0)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='gamestate',
            name='player1',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='player1', to='game.player'),
        ),
        migrations.AddField(
            model_name='gamestate',
            name='player2',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='player2', to='game.player'),
        ),
    ]