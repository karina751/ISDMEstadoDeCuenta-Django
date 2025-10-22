from django.shortcuts import render
from .models import Alumno, Carrera # Importamos los modelos que creaste

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
        # (Esto requeriría un JOIN complejo, por ahora lo simplificamos)
        cuotas_plan = alumno.plancuotasalumno_set.all() 
        
        contexto = {
            'alumno': alumno,
            'cuotas': cuotas_plan
        }
        
        return render(request, 'mi_app/estado_cuenta.html', contexto)
    
    except Alumno.DoesNotExist:
        return render(request, 'mi_app/404.html', {'mensaje': 'Alumno no encontrado'})