# Generated by Django 4.0.2 on 2022-03-10 12:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='catalog',
            old_name='userID',
            new_name='user',
        ),
    ]
