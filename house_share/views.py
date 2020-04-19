from django.shortcuts import render

from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.status import HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_204_NO_CONTENT

from .models import Address, Residence, Expense, Split, Move, Room
from django.contrib.auth import get_user_model
User = get_user_model()
from .serializers import AddressSerializer, ResidenceSerializer, PopulatedAddressSerializer, PopulatedResidenceSerializer, ExpenseSerializer, PopulatedExpenseSerializer, SplitSerializer, PopulatedSplitSerializer, MoveSerializer, PopulatedMoveSerializer, RoomSerializer, PopulatedRoomSerializer, UserSerializer, PopulatedUserSerializer

from rest_framework import permissions
from rest_framework.permissions import BasePermission

from rest_framework.permissions import IsAuthenticated # Import the is authenticated

class isOwnerOrReadOnly(BasePermission):

  def has_object_permission(self, request, view, obj):
    if request.method in permissions.SAFE_METHODS :
      return True
    
    return request.user == obj.admin_user
   




class AddressListView(ListCreateAPIView):

    queryset = Address.objects.all()
    serializer_class = AddressSerializer

    def get(self, request):
      address = Address.objects.all()
      serializer = PopulatedAddressSerializer(address, many=True)
      return Response(serializer.data)
   

    def post(self, request):
      serializer = AddressSerializer(data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)

      return Response(serializer.data, status=HTTP_422_UNPROCESSABLE_ENTITY)


class AddressDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

    def get(self, request, pk):
      address = Address.objects.get(pk=pk)
      serializer = PopulatedAddressSerializer(address)
      return Response(serializer.data)

    def put(self, request, pk):
      address = Address.objects.get(pk=pk)
      serializer = AddressSerializer(address, data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_202_ACCEPTED)

      return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

    def delete(self, request, pk):
      address = Address.objects.get(pk=pk)
      address.delete()
      return Response(status=HTTP_204_NO_CONTENT)


class ResidenceListView(ListCreateAPIView):
    queryset = Residence.objects.all()
    serializer_class = ResidenceSerializer

    def get(self, request):
      residences = Residence.objects.all()
      serializer = PopulatedResidenceSerializer(residences, many=True)
      return Response(serializer.data)

   
    def post(self, request):

      request.data['admin_user'] = request.user.id
      request.data['tenants'] = [request.user.id]
      serializer = ResidenceSerializer(data=request.data)
      
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)

      return Response(serializer.data, status=HTTP_422_UNPROCESSABLE_ENTITY)
    
    def put(self, request):
      short_name = request.data['short_name']
      residence = Residence.objects.get(short_name=short_name)
      # request.data['tenants'].push(request.user.id)
      if residence.join_requests.add(request.user.id):
        return Response(residence, status=HTTP_202_ACCEPTED)

      return Response({ 'error': 'This account does not exist' })


class ResidenceDetailView(RetrieveUpdateDestroyAPIView):
  queryset = Residence.objects.all()
  serializer_class = ResidenceSerializer

  def get(self, request, pk):
    residence = Residence.objects.get(pk=pk)
    serializer = PopulatedResidenceSerializer(residence)
    return Response(serializer.data)

  def put(self, request, pk):
    residence = Residence.objects.get(pk=pk)
    serializer = ResidenceSerializer(residence, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=HTTP_202_ACCEPTED)

    return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

  def delete(self, request, pk):
    residence = Residence.objects.get(pk=pk)
    residence.delete()
    return Response(status=HTTP_204_NO_CONTENT)


class ExpenseListView(ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    # permission_classes = (IsAuthenticated), # Set the autentication needed

    def get(self, request):
      print(request)
      expenses = Expense.objects.all()
      # self.check_object_permissions(request) #Check user is logged in
      serializer = PopulatedExpenseSerializer(expenses, many=True)
      return Response(serializer.data)

    def post(self, request):
      print(request)
      # request.data['resisence'] = request.user.residence.id
      serializer = ExpenseSerializer(data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)

      return Response(serializer.data, status=HTTP_422_UNPROCESSABLE_ENTITY)


class ExpenseDetailView(RetrieveUpdateDestroyAPIView):
  queryset = Expense.objects.all()
  serializer_class = ExpenseSerializer

  permission_classes = (isOwnerOrReadOnly),

  def get(self, request, pk):
    print(request.user)
    expense = Expense.objects.get(pk=pk)
    self.check_object_permissions(request, expense)
    serializer = PopulatedExpenseSerializer(expense)
    return Response(serializer.data)

  def put(self, request, pk):
    expense = Expense.objects.get(pk=pk)
    self.check_object_permissions(request, expense)
    serializer = ExpenseSerializer(expense, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=HTTP_202_ACCEPTED)

    return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

  def delete(self, request, pk):
    print(request.user)
    expense = Expense.objects.get(pk=pk)
    self.check_object_permissions(request, expense)
    expense.delete()
    return Response(status=HTTP_204_NO_CONTENT)


class SplitListView(ListCreateAPIView):
    queryset = Split.objects.all()
    serializer_class = SplitSerializer

    def get(self, request):
      splits = Split.objects.all()
      serializer = PopulatedSplitSerializer(splits, many=True)
      return Response(serializer.data)

    def post(self, request):
      serializer = SplitSerializer(data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)

      return Response(serializer.data, status=HTTP_422_UNPROCESSABLE_ENTITY)


class SplitDetailView(RetrieveUpdateDestroyAPIView):
  queryset = Split.objects.all()
  serializer_class = SplitSerializer

  def get(self, request, pk):
    split = Split.objects.get(pk=pk)
    serializer = PopulatedSplitSerializer(split)
    return Response(serializer.data)

  def put(self, request, pk):
    split = Split.objects.get(pk=pk)
    serializer = SplitSerializer(split, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=HTTP_202_ACCEPTED)

    return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

  def delete(self, request, pk):
    split = Split.objects.get(pk=pk)
    split.delete()
    return Response(status=HTTP_204_NO_CONTENT)


class MoveListView(ListCreateAPIView):
    queryset = Move.objects.all()
    serializer_class = MoveSerializer

    def get(self, request):
      moves = Move.objects.all()
      serializer = PopulatedMoveSerializer(moves, many=True)
      return Response(serializer.data)

    def post(self, request):
      serializer = MoveSerializer(data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)

      return Response(serializer.data, status=HTTP_422_UNPROCESSABLE_ENTITY)


class MoveDetailView(RetrieveUpdateDestroyAPIView):
  queryset = Move.objects.all()
  serializer_class = MoveSerializer

  def get(self, request, pk):
    move = Move.objects.get(pk=pk)
    serializer = PopulatedMoveSerializer(move)
    return Response(serializer.data)

  def put(self, request, pk):
    move = Move.objects.get(pk=pk)
    serializer = MoveSerializer(move, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=HTTP_202_ACCEPTED)

    return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

  def delete(self, request, pk):
    move = Move.objects.get(pk=pk)
    move.delete()
    return Response(status=HTTP_204_NO_CONTENT)


class RoomListView(ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get(self, request):
      rooms = Room.objects.all()
      serializer = PopulatedRoomSerializer(rooms, many=True)
      return Response(serializer.data)

    def post(self, request):
      serializer = RoomSerializer(data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)

      return Response(serializer.data, status=HTTP_422_UNPROCESSABLE_ENTITY)


class RoomDetailView(RetrieveUpdateDestroyAPIView):
  queryset = Room.objects.all()
  serializer_class = RoomSerializer

  def get(self, request, pk):
    room = Room.objects.get(pk=pk)
    serializer = PopulatedRoomSerializer(room)
    return Response(serializer.data)

  def put(self, request, pk):
    room = Room.objects.get(pk=pk)
    serializer = RoomSerializer(room, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=HTTP_202_ACCEPTED)

    return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

  def delete(self, request, pk):
    room = Move.objects.get(pk=pk)
    room.delete()
    return Response(status=HTTP_204_NO_CONTENT)




class UserProfileDetailView(RetrieveUpdateDestroyAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

  permission_classes = (IsAuthenticated),

  def get(self, request):
    user = request.user
    serializer = PopulatedUserSerializer(user)
    return Response(serializer.data)





