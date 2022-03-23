# Generated by Django 4.0.1 on 2022-03-15 17:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_rename_catalog_catalogue_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=40, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Fic',
            fields=[
                ('workid', models.IntegerField(default=0, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('summary', models.CharField(max_length=1250)),
            ],
        ),
        migrations.CreateModel(
            name='FicAuthors',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.author')),
                ('fic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.fic')),
            ],
        ),
        migrations.AddConstraint(
            model_name='ficauthors',
            constraint=models.UniqueConstraint(fields=('fic', 'author'), name='fic_author_unique'),
        ),
    ]