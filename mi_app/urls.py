from django.urls import path
from . import views

urlpatterns = [
    # URL principal: /alumnos/
    path('alumnos/', views.lista_alumnos, name='lista_alumnos'),
    
    # URL de detalle: /alumnos/50/ (donde 50 es el ID del alumno)
    path('alumnos/<int:alumno_id>/', views.estado_cuenta_detalle, name='estado_cuenta'),
]