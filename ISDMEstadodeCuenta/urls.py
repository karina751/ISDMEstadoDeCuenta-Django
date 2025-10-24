from django.contrib import admin
from django.urls import path, include 

urlpatterns = [
    # 1. Ruta para el administrador de Django
    path('admin/', admin.site.urls),
    
    # 2. Redirige la URL raíz ('/') a las URLs definidas en mi_app/urls.py
    # ESTE ES EL PUNTO CLAVE QUE NO DEBE CAUSAR RECURSIÓN
    path('', include('mi_app.urls')), 
]