# Generated by Django 3.2.13 on 2022-09-06 03:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0008_auto_20220905_1525'),
    ]

    operations = [
        migrations.AddField(
            model_name='piece',
            name='attack',
            field=models.IntegerField(default=0),
        ),
    ]