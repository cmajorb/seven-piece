# Generated by Django 3.2.5 on 2022-09-03 22:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_auto_20220902_1604'),
    ]

    operations = [
        migrations.AddField(
            model_name='piece',
            name='range',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
