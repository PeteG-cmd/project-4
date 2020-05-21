
from django.db import models
from django.contrib.auth.models import AbstractUser
# from house_share.models import Residence
# Create your models here.

class User(AbstractUser):

    first_name = models.CharField(max_length=20)
    second_name = models.CharField(max_length=20)
    image = models.ImageField(upload_to='profile_image', null=True)

    # residence = models.ForeignKey(Residence, related_name='users', on_delete=models.CASCADE, null=True)