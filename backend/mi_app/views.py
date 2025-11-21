from django.shortcuts import render
from .models import Alumno, Carrera 
from rest_framework import viewsets
from .traductor import TraductorAlumno 

def lista_alumnos(request):
    """
    Vista que recupera todos los alumnos de la base de datos
    y los pasa a la plantilla.
    """
    # Consulta la base de datos MySQL usando el modelo Alumno
    alumnos = Alumno.objects.all().order_by('apellido')
    
    # Prepara el contexto (los datos que se pasan a la plantilla)
    contexto = {
        'titulo': 'Lista de Alumnos Registrados',
        'alumnos': alumnos
    }
    
    # Renderiza (muestra) la plantilla con los datos
    return render(request, 'mi_app/lista_alumnos.html', contexto)


def estado_cuenta_detalle(request, alumno_id):
    """
    Vista que muestra el detalle del estado de cuenta para un alumno específico.
    """
    try:
        # Recupera el alumno usando el ID de la URL
        alumno = Alumno.objects.get(id_alumno=alumno_id)
        
        # Simula la lógica compleja para obtener todos los datos de pago
        cuotas_plan = alumno.plancuotasalumno_set.all() 
        
        contexto = {
            'alumno': alumno,
            'cuotas': cuotas_plan
        }
        
        return render(request, 'mi_app/estado_cuenta.html', contexto)
    
    except Alumno.DoesNotExist:
        return render(request, 'mi_app/404.html', {'mensaje': 'Alumno no encontrado'})
    

# ----------------------------------------------------------------------
# VISTAS DE LA API REST (para consumo de React)
# ----------------------------------------------------------------------

class VistaAlumnoAPI(viewsets.ReadOnlyModelViewSet):
    """
    Vista de la API para Alumnos. Proporciona una vista de solo lectura
    de los datos de los alumnos, incluyendo sus planes de cuotas, en formato JSON.
    """
    # Objeto de consulta para la base de datos
    queryset = Alumno.objects.all()
    
    # Traductor que se encarga de dar formato JSON
    serializer_class = TraductorAlumno