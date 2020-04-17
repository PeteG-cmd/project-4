from django.contrib import admin

# Register your models here.

from .models import Address, Residence, Expense, Split, Move, Room

admin.site.register(Address)
admin.site.register(Residence)
admin.site.register(Expense)
admin.site.register(Split)
admin.site.register(Move)
admin.site.register(Room)
