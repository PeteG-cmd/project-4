from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.status import HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_204_NO_CONTENT
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
User = get_user_model()
from django.conf import settings
import jwt
from .serializers import UserSerializer

class RegisterView(CreateAPIView):

    serializer_class = UserSerializer

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            user = User.objects.get(email=request.data.get('email'))
            serializer = UserSerializer(user)
            token = jwt.encode({'sub': user.id}, settings.SECRET_KEY, algorithm='HS256')
            return Response({'token': token, 'message': f'Welcome to House Share {user.username}!', 'user': serializer.data })

        return Response(serializer.errors, status=422)


class LoginView(APIView):

    def get_user(self, email):
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            raise PermissionDenied({'message': 'Invalid credentials'})

    def post(self, request):

        email = request.data.get('email')
        password = request.data.get('password')
        
        user = self.get_user(email)
        serializer = UserSerializer(user)

        if not user.check_password(password):
            raise PermissionDenied({'message': 'Invalid credentials'})

        token = jwt.encode({'sub': user.id}, settings.SECRET_KEY, algorithm='HS256')
        return Response({'token': token, 'message': f'Welcome back {user.username} !', 'user': serializer.data })


class UpdateProfileViev(RetrieveUpdateDestroyAPIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def put(self, request):
      user = request.user
      print(user.password)
      print(request.data)
     
      request.data['username'] = request.user.username
      request.data['first_name'] = request.user.first_name
      request.data['second_name'] = request.user.second_name
      request.data['password'] = request.user.password
      request.data['password_confirmation'] = request.user.password
      
     
      print(request.data['image'])
      print(request.data)
      serializer = UserSerializer(user, data=request.data)
      if serializer.is_valid():
        serializer.save(update_fields=['image'])
        return Response(serializer.data, status=HTTP_202_ACCEPTED)

      return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
