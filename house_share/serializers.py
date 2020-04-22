
from rest_framework import serializers
from .models import Address, Residence, Expense, Split, Move, Room
from django.contrib.auth import get_user_model
User = get_user_model()

# import the jwt user model here, and just use whatever fields i want


class AddressSerializer(serializers.ModelSerializer):
  class Meta:
      model = Address
      fields = ('id', 'house_name', 'house_number', 'street', 'street_two', 'town', 'city', 'postcode', 'country')

class ResidenceSerializer(serializers.ModelSerializer):
  class Meta:
    model = Residence
    fields = ('id', 'short_name', 'address', 'tenants', 'admin_user')

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'first_name', 'second_name', 'image')

class ExpenseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Expense
    fields = ('id', 'company_name', 'description', 'expense_dated', 'date_from', 'date_to', 'amount', 'image', 'residence', 'admin_user')

class SplitSerializer(serializers.ModelSerializer):
  class Meta:
    model = Split
    fields = ('id', 'expense', 'user', 'percentage_to_pay', 'paid_flag', 'admin_user')

class MoveSerializer(serializers.ModelSerializer):
  class Meta:
    model = Move
    fields = ('id', 'moved_in', 'moved_out', 'status', 'user', 'residence')

class RoomSerializer(serializers.ModelSerializer):
  class Meta:
    model = Room
    fields = ('id', 'available_from', 'for_duration', 'room_details', 'image', 'cost_per_week', 'residence', 'user')




class PopulatedExpensesSplitSerializer(serializers.ModelSerializer):

  splits = SplitSerializer(many=True)

  class Meta:
    model = Expense
    fields = ('id', 'company_name', 'description', 'expense_dated', 'date_from', 'date_to', 'amount', 'image', 'residence', 'users_liable', 'splits', 'admin_user')


class PopulatedAddressSerializer(serializers.ModelSerializer):

  residences = ResidenceSerializer(many=True)

  class Meta:
      model = Address
      fields = ('id', 'house_name', 'house_number', 'street', 'street_two', 'town', 'city', 'postcode', 'country', 'residences')


class PopulatedResidenceSerializer(ResidenceSerializer):

  address = AddressSerializer()
  moves = MoveSerializer(many=True)
  tenants = UserSerializer(many=True)
  admin_user = UserSerializer()
  rooms = RoomSerializer(many = True)
  join_requests = UserSerializer(many=True)
  expenses = PopulatedExpensesSplitSerializer(many=True)
 
  class Meta:
    model = Residence
    fields = ('id', 'short_name', 'address', 'tenants', 'moves', 'admin_user', 'rooms', 'join_requests', 'expenses')


class PopulatedUserSerializer(serializers.ModelSerializer):

  residences = PopulatedResidenceSerializer(many=True)
  new_residence = PopulatedResidenceSerializer(many=True)
  # expenses = ExpenseSerializer(many=True)

  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'first_name', 'second_name', 'image', 'residences', 'new_residence')


class PopulatedExpenseSerializer(ExpenseSerializer):

  residence = ResidenceSerializer()
  users_liable = UserSerializer(many=True)
  admin_user = UserSerializer()
  splits = SplitSerializer(many=True)

  class Meta:
    model = Expense
    fields = ('id', 'company_name', 'description', 'expense_dated', 'date_from', 'date_to', 'amount', 'image', 'residence', 'users_liable', 'splits', 'admin_user')


class PopulatedSplitSerializer(serializers.ModelSerializer):

  user = UserSerializer()
  expense = ExpenseSerializer()
  residence = ResidenceSerializer()

  class Meta:
    model = Split
    fields = ('id', 'expense', 'residence', 'user', 'percentage_to_pay', 'paid_flag')


class PopulatedMoveSerializer(serializers.ModelSerializer):

  user = UserSerializer()
  residence = ResidenceSerializer()

  class Meta:
    model = Move
    fields = ('id', 'moved_in', 'moved_out', 'status', 'user', 'residence')


class PopulatedRoomSerializer(serializers.ModelSerializer):

  user = UserSerializer()
  residence = ResidenceSerializer()

  class Meta:
    model = Room
    fields = ('id', 'available_from', 'for_duration', 'room_details', 'image', 'cost_per_week', 'residence', 'user')

