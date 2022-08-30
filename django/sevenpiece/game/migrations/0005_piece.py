# Generated by Django 3.2.5 on 2022-08-29 23:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0004_character'),
    ]

    operations = [
        migrations.CreateModel(
            name='Piece',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location_x', models.IntegerField()),
                ('location_y', models.IntegerField()),
                ('character', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='game.character')),
            ],
        ),
    ]
