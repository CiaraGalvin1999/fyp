from django.db import models
from django.contrib.auth.models import User
import datetime

# Create your models here.

# Catalogue will have a title and an associated user which will be a foreign key to the default User model provided by Django
class Catalogue(models.Model):
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    # Catalogue title must be unique for given user
    class Meta:
        constraints = [ models.UniqueConstraint(fields=['title', 'user'], name='catalogue_title_unique') ]

    def __str__(self):
        return self.title

class Fic(models.Model):
    workid = models.IntegerField(default=0, primary_key=True)
    title = models.CharField(max_length=255) # Max title length on AO3 is 255 characters
    summary = models.CharField(max_length=1250) # Max summary length on AO3 is 1250 characters

    def __str__(self):
        return(self.title)


class Author(models.Model):
    username = models.CharField(max_length=40, null = True) # Max username length on A03 is 40 characters

class FicAuthor(models.Model):
    fic = models.ForeignKey(Fic, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null = True)

    class Meta:
        constraints = [ models.UniqueConstraint(fields=['fic', 'author'], name='fic_author_unique') ]
        

# Contains what fanfictions are in a catalogue
class CatalogueFic(models.Model):
    catalogue = models.ForeignKey(Catalogue, on_delete=models.CASCADE)
    fic = models.ForeignKey(Fic, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    # Ensures that catalogue doesn't have same fic twice
    class Meta:
        constraints = [ models.UniqueConstraint(fields=['catalogue', 'fic'], name='fic_unique_in_catalog') ]
