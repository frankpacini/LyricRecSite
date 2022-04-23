from django.urls import path

from . import views

urlpatterns = [
    path('song/<int:id>/', views.index, name='index'),
]