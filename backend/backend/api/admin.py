from django.contrib import admin

# Register your models here.

from .models import Catalog, CatalogueFic

admin.site.register(Catalog)
admin.site.register(CatalogueFic)