
from django.urls import path
from .views import AddressListView, AddressDetailView, ResidenceListView, ResidenceDetailView, ExpenseListView, ExpenseDetailView, SplitListView, SplitDetailView, MoveListView, MoveDetailView, RoomListView, RoomDetailView, UserProfileDetailView

urlpatterns = [
    path('address/', AddressListView.as_view()),
    path('address/<int:pk>/', AddressDetailView.as_view()),
    path('residence/', ResidenceListView.as_view()),
    path('residence/<int:pk>/', ResidenceDetailView.as_view()),
    path('expense/', ExpenseListView.as_view()),
    path('expense/<int:pk>/', ExpenseDetailView.as_view()),
    path('split/', SplitListView.as_view()),
    path('split/<int:pk>/', SplitDetailView.as_view()),
    path('move/', MoveListView.as_view()),
    path('move/<int:pk>/', MoveDetailView.as_view()),
    path('room/', RoomListView.as_view()),
    path('room/<int:pk>/', RoomDetailView.as_view()),
    path('userprofile/', UserProfileDetailView.as_view())
]