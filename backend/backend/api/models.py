from django.db import models
from django.contrib.auth.models import User
from itertools import chain

# Create your models here.

class Author(models.Model):
    username = models.CharField(max_length=40, null = True) # Max username length on A03 is 40 characters

    def __str__(self):
        return(self.username)
    
    def __repr__(self):
        return str(self.to_dict())

    def to_dict(self):
        return {
            'username': self.username,
        }


class Fic(models.Model):
    workid = models.IntegerField(default=0, primary_key=True)
    title = models.CharField(max_length=255) # Max title length on AO3 is 255 characters
    summary = models.CharField(max_length=1250) # Max summary length on AO3 is 1250 characters
    authors = models.ManyToManyField('Author', through='FicAuthor')

    def __str__(self):
        return(self.title)

    def to_dict(instance):
        opts = instance._meta
        data = {}
        for f in chain(opts.concrete_fields, opts.private_fields):
            data[f.name] = f.value_from_object(instance)
        for f in opts.many_to_many:
            data[f.name] = [i.to_dict() for i in f.value_from_object(instance)]
        return data

class FicAuthor(models.Model):
    fic = models.ForeignKey('Fic', on_delete=models.CASCADE)
    author = models.ForeignKey('Author', on_delete=models.CASCADE)

    class Meta:
        constraints = [ models.UniqueConstraint(fields=['fic', 'author'], name='fic_author_unique') ]

# Catalogue will have a title and an associated user which will be a foreign key to the default User model provided by Django
class Catalogue(models.Model):
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    fics = models.ManyToManyField('Fic', through='CatalogueFic')

    # Catalogue title must be unique for given user
    class Meta:
        constraints = [ models.UniqueConstraint(fields=['title', 'user'], name='catalogue_title_unique') ]

    def __str__(self):
        return self.title

    def to_dict(instance):
        opts = instance._meta
        data = {}
        for f in chain(opts.concrete_fields, opts.private_fields):
            if not f.name == 'created_at':
                data[f.name] = f.value_from_object(instance)
        for f in opts.many_to_many:
            data[f.name] = [i.to_dict() for i in f.value_from_object(instance)]
        return data

    def title_and_id(self):
        return {
            'id': self.id,
            'title': self.title
        }
    def recentActivityData(self):
        return {
            'id': self.id,
            'title': self.title,
            'userID': self.user.id,
            'username': self.user.username
        }


#Contains what fanfictions are in a catalogue
class CatalogueFic(models.Model):
    catalogue = models.ForeignKey('Catalogue', on_delete=models.CASCADE)
    fic = models.ForeignKey('Fic', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    # Ensures that catalogue doesn't have same fic twice
    class Meta:
        constraints = [ models.UniqueConstraint(fields=['catalogue', 'fic'], name='fic_unique_in_catalog') ]

    def as_dict(self):
        # Returning username of user who created catalogue, name of catalogue, and title of fic
        return {
            'username': self.catalogue.user.username,
            'userID': self.catalogue.user.id,
            'catalogueTitle': self.catalogue.title,
            'catalogueID': self.catalogue.id,
            'ficTitle': self.fic.title,
            'ficID': self.fic.workid
        }
