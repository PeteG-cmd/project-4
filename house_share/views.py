from django.shortcuts import render

from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.status import HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_204_NO_CONTENT

from .models import Address, Residence, Expense, Split, Move, Room
from django.contrib.auth import get_user_model
User = get_user_model()
from .serializers import AddressSerializer, ResidenceSerializer, PopulatedAddressSerializer, PopulatedResidenceSerializer, ExpenseSerializer, PopulatedExpenseSerializer, SplitSerializer, PopulatedSplitSerializer, MoveSerializer, PopulatedMoveSerializer, RoomSerializer, PopulatedRoomSerializer, UserSerializer, PopulatedUserSerializer, PopulatedUserViewSerializer, ExpenseImageSerializer

from rest_framework import permissions
from rest_framework.permissions import BasePermission

from rest_framework.permissions import IsAuthenticated # Import the is authenticated

from datetime import datetime

class isOwnerOrAdminOrReadOnly(BasePermission):

  def has_object_permission(self, request, view, obj):
    if request.method in permissions.SAFE_METHODS :
      return True
    
    return request.user == obj.admin_user or request.user == obj.user

class isCurrentlyInResidenceWithUser(BasePermission):

  def has_object_permission(self, request, view, obj):
    current_user = request.user
    residences = current_user.residences.all()
    for residence in residences:
      tenants = residence.tenants.all()
      for tenant in tenants:
        if tenant == obj:
          return True

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


class ResidenceUsersControll(ListCreateAPIView):
    queryset = Residence.objects.all()
    serializer_class = ResidenceSerializer

    def put(self, request):
      if request.data['event'] == 'accept':
        residence = Residence.objects.get(id=int(request.data['residence_id']))
        residence.tenants.add(User.objects.get(id=request.data['user_id']))
        residence.join_requests.remove(User.objects.get(id=request.data['user_id']))
        serializer_f = PopulatedResidenceSerializer(residence)

        move = request.data
        move['moved_in'] = datetime.today().strftime('%Y-%m-%d')
        move['user'] = move['user_id']
        move['residence'] = move['residence_id']
        move['status'] = 'current'
        serializer = MoveSerializer(data=move)
        if serializer.is_valid():
           serializer.save()
           return Response({ 'join_request': serializer_f.data, 'move_detail': serializer.data} ,  status=HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

      elif request.data['event'] == 'decline':
          residence = Residence.objects.get(id=int(request.data['residence_id']))
          residence.join_requests.remove(User.objects.get(id=request.data['user_id']))
          serializer = PopulatedResidenceSerializer(residence)
          return Response({ 'join_request': serializer.data}, status=HTTP_202_ACCEPTED)



class ResidenceSingleUserControll(ListCreateAPIView):
    queryset = Residence.objects.all()
    serializer_class = ResidenceSerializer

    permission_classes = (isCurrentlyInResidenceWithUser),

    def get(self, request):
      print(request.data)
      current_user = request.user
      serializer = PopulatedUserViewSerializer(current_user)
      return Response(serializer.data, status=HTTP_202_ACCEPTED)

    # This is being used as the detail view for any member of the residence to see. Only the admin user or the user will be able to 'put' from this view, but all residents can get
    def post(self, request):
      print(request.data)
      current_user = request.user
      serializer_f = UserSerializer(current_user)
      user = User.objects.get(id=request.data['id'])
      self.check_object_permissions(request, user)
      serializer = PopulatedUserViewSerializer(user)
      
      return Response({'user_profile': serializer.data, 'current_user': serializer_f.data })


class ResidenceListView(ListCreateAPIView):
    queryset = Residence.objects.all()
    serializer_class = ResidenceSerializer

    def get(self, request):
      residences = Residence.objects.all()
      serializer = PopulatedResidenceSerializer(residences, many=True)
      return Response(serializer.data)

   
    def post(self, request):

      request.data['admin_user'] = request.user.id
      request.data['tenants'] = [request.user.id,]
      print(request.data)

      serializer_f = ResidenceSerializer(data=request.data)
      
      if serializer_f.is_valid():
        serializer_f.save()
        move = request.data
        move['moved_in'] = datetime.today().strftime('%Y-%m-%d')
        move['user'] = request.user.id
        move['residence'] = serializer_f.data['id']
        move['status'] = 'current'
        serializer = MoveSerializer(data=move)
        if serializer.is_valid():
           serializer.save()
           return Response(serializer_f.data, status=HTTP_201_CREATED)

      return Response(serializer_f.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
    
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
      request.data['admin_user'] = request.user.id
      if request.data['splits']:
        f_serializer = ExpenseSerializer(data=request.data)
        if f_serializer.is_valid():
          f_serializer.save()
          # return Response(serializer.data, status=HTTP_201_CREATED)
          splits = request.data['splits']
          print(splits)
          new_data = []
          for split in splits:
          
            split['expense'] = f_serializer.data['id']
            split['admin_user'] = f_serializer.data['admin_user']

            serializer = SplitSerializer(data=split)
            if serializer.is_valid():
              serializer.save()

              new_data.append(serializer.data)
          return Response({ 'Split': new_data, 'Expense': f_serializer.data }, status=HTTP_201_CREATED)
        return Response(f_serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
      return Response({'message': 'There must be at least one split attributed to this Expense' }, status=HTTP_422_UNPROCESSABLE_ENTITY)


class ExpenseDetailView(RetrieveUpdateDestroyAPIView):
  queryset = Expense.objects.all()
  serializer_class = ExpenseSerializer

  permission_classes = (isOwnerOrAdminOrReadOnly),

  def get(self, request, pk):
    print(request.user)
    expense = Expense.objects.get(pk=pk)
    self.check_object_permissions(request, expense)
    serializer = PopulatedExpenseSerializer(expense)
    return Response(serializer.data)

  # This is currently used to add an image to the bill after it is created

  def put(self, request, pk):
    expense = Expense.objects.get(pk=pk)
    self.check_object_permissions(request, expense)
    serializer = ExpenseImageSerializer(expense, data=request.data)
    if serializer.is_valid():
      serializer.save(update_fields=['image'])
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

    permission_classes = (isOwnerOrAdminOrReadOnly),

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
    
    # This is used for marking an expense as paid, and should be limited for use by the split user or admin user. It then returns the split and the detail user view to update the page
    def put(self, request):
      split = Split.objects.get(pk=request.data['id'])
      self.check_object_permissions(request, split)
      serializer_f = SplitSerializer(split, data=request.data)
      if serializer_f.is_valid():
        serializer_f.save()
        user = User.objects.get(id=request.data['user'])
        serializer = PopulatedUserViewSerializer(user)
        return Response({ 'user_profile': serializer.data, 'split': serializer_f.data }, status=HTTP_202_ACCEPTED)

      return Response(serializer_f.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


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

  # This is used to remove a current user from a residence, and put them in to the 'past_tenants'
  def put(self, request):
    print(request.data)
    residence = Residence.objects.get(pk=request.data['residence'])
    residence.tenants.remove(request.user)
    residence.past_tenants.add(request.user)
    serializer_f = ResidenceSerializer(residence)
    move = Move.objects.get(pk=request.data['moves']['id'])
    request.data['moves']['moved_out'] = datetime.today().strftime('%Y-%m-%d')
    serializer = MoveSerializer(move, data=request.data['moves'])
    if serializer.is_valid():
      serializer.save()
      return Response({ 'move': serializer.data, 'residence': serializer_f.data}, status=HTTP_202_ACCEPTED)

    return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


    


