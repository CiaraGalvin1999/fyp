# Generated by Django 4.0.1 on 2022-03-15 17:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_author_fic_ficauthors_ficauthors_fic_author_unique'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='FicAuthors',
            new_name='FicAuthor',
        ),
        migrations.RemoveConstraint(
            model_name='cataloguefic',
            name='fic_unique_in_catalog',
        ),
        migrations.RemoveField(
            model_name='cataloguefic',
            name='workid',
        ),
        migrations.AddField(
            model_name='cataloguefic',
            name='fic',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='api.fic'),
            preserve_default=False,
        ),
        migrations.AddConstraint(
            model_name='cataloguefic',
            constraint=models.UniqueConstraint(fields=('catalogue', 'fic'), name='fic_unique_in_catalog'),
        ),
    ]
