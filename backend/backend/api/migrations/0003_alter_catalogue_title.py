# Generated by Django 4.0.1 on 2022-04-12 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_catalogue_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalogue',
            name='title',
            field=models.CharField(max_length=100),
        ),
    ]