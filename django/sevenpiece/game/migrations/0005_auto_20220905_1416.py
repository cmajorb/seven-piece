# Generated by Django 3.2.5 on 2022-09-05 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0004_auto_20220904_2208'),
    ]

    operations = [
        migrations.AlterField(
            model_name='piece',
            name='health',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='piece',
            name='location_x',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='piece',
            name='location_y',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='piece',
            name='range',
            field=models.IntegerField(default=0),
        ),
    ]
