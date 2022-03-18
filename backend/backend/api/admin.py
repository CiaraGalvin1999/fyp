from django.contrib import admin

# Register your models here.

from .models import Catalogue, CatalogueFic, Fic, FicAuthor, Author

admin.site.register(Catalogue)
admin.site.register(CatalogueFic)
admin.site.register(Fic)
admin.site.register(Author)
admin.site.register(FicAuthor)