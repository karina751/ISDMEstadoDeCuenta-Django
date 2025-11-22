from django.contrib import admin # Importa el panel de administración de Django
from django.urls import path, include # Importa funciones para definir rutas
# Lista que contiene todas las URLs (direcciones) de tu sitio web
urlpatterns = [
    path('admin/', admin.site.urls), # 1. Ruta para el panel de administrador
    path('app/', include('mi_app.urls')), # 2. Ruta para conectar con tu aplicación "mi_app"
]