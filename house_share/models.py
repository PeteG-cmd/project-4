
from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()
# from django.contrib.auth.models import User


# Create your models here.

class Address(models.Model):
  house_name = models.CharField(max_length=30)
  house_number = models.IntegerField()
  street = models.CharField(max_length=30)
  street_two = models.CharField(max_length=30)
  town = models.CharField(max_length=30)
  city = models.CharField(max_length=30)
  postcode = models.CharField(max_length=10)
  country = models.CharField(max_length=30)
  
  def __str__(self):
    return f'{self.house_name}'


class Residence(models.Model):
  short_name = models.CharField(max_length=30, unique=True)
  address = models.ForeignKey(Address, related_name='residences', null=True, on_delete=models.CASCADE)
  tenants = models.ManyToManyField(User, related_name='residences')
  past_tenants = models.ManyToManyField(User, related_name='past_residences')
  admin_user = models.ForeignKey(User, related_name='residence', on_delete=models.CASCADE)
  join_requests = models.ManyToManyField(User, related_name='new_residence')


  def __str__(self):
    return f'{self.short_name}'

  

class Expense(models.Model):
  company_name = models.CharField(max_length=40)
  description = models.CharField(max_length=200, blank=True)
  expense_dated = models.DateField()
  date_from = models.DateField(null=True)
  date_to = models.DateField(null=True)
  amount = models.FloatField()
  image = models.ImageField(upload_to='bill_image', null=True)
  residence = models.ForeignKey(Residence, related_name='expenses', on_delete=models.CASCADE)
  users_liable = models.ManyToManyField(User, related_name='expenses', blank=True)
  admin_user = models.ForeignKey(User, related_name='expense', on_delete=models.CASCADE)

  def __str__(self):
    return f'{self.company_name}'


class Split(models.Model):
  expense = models.ForeignKey(Expense, related_name='splits', on_delete=models.CASCADE)
  # residence = models.ForeignKey(Residence, related_name='splits', on_delete=models.CASCADE)
  user = models.ForeignKey(User, related_name='splits', on_delete=models.CASCADE)
  percentage_to_pay = models.FloatField()
  paid_flag = models.BooleanField()
  admin_user = models.ForeignKey(User, related_name='split', on_delete=models.CASCADE)

  def __str__(self):
    return f'{self.user.username}, at {self.residence.short_name}, is paying for {self.percentage_to_pay}% of this Expense'


class Move(models.Model):
  residence = models.ForeignKey(Residence, related_name='moves', on_delete=models.CASCADE)
  user = models.ForeignKey(User, related_name='moves', on_delete=models.CASCADE)
  moved_in = models.DateField()
  moved_out = models.DateField()
  status = models.CharField(max_length=30)

  def __str__(self):
    return f'Move Dates for: {self.user.username}'


class Room(models.Model):
  available_from = models.DateField()
  for_duration = models.CharField(max_length = 25)
  room_details = models.CharField(max_length = 250)
  image = models.ImageField(upload_to='room_image', null=True)
  cost_per_week = models.FloatField()
  residence = models.ForeignKey(Residence, related_name='rooms', on_delete=models.CASCADE)
  admin_user = models.ForeignKey(User, related_name='rooms', on_delete=models.CASCADE)

  def __str__(self):
    return f'Room in {self.residence.short_name}, posted by {self.user.username}'