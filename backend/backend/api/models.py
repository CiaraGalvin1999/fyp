from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Catalogue will have a title and an associated user which will be a foreign key to the default User model provided by Django
class Catalog(models.Model):
    title = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

# Contains what fanfictions are in a catalogue
class CatalogueFic(models.Model):
    catalogue = models.ForeignKey(Catalog, on_delete=models.CASCADE)
    workid = models.IntegerField
