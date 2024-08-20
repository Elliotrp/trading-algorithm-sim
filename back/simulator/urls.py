from django.urls import path
from . import views

urlpatterns = [
    path('simulation/', views.SimulationView.as_view())
]