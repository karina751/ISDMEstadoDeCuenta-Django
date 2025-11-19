# mi_app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views # Importamos el módulo completo de vistas
from .views import VistaAlumnoAPI # Importamos nuestra nueva clase API

# Crea un router que registrará automáticamente las URLs
router = DefaultRouter()
# Registra nuestra vista para que sea accesible a través de /api/alumnos/
router.register(r'alumnos', VistaAlumnoAPI) 

# Las URLs de la aplicación
urlpatterns = [
    # URLs para las vistas con templates (HTML)
    path('alumnos/', views.lista_alumnos, name='lista_alumnos'), 
    path('alumnos/<int:alumno_id>/', views.estado_cuenta_detalle, name='estado_cuenta'),
    
    # NUEVAS URLs para la API (accesibles a través de /app/api/alumnos/)
    path('api/', include(router.urls)), 
]