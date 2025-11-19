# backend/mi_app/scripts/cargar_datos.py

from datetime import date, datetime
from django.db.utils import IntegrityError
from mi_app.models import Alumno, Carrera, Cuota, PlanCuotasAlumno, Pago, Comprobante 
from django.db import connection, transaction 

# Variables contadoras globales
id_pago_counter = 8000 
id_comprobante_counter = 9000

# --- 1. Definir Carreras (CORRECCIÓN CRÍTICA: SOLO INSERCIÓN SEGURA) ---
def obtener_o_crear_carrera(nombre="Ingeniería de Software"):
    """Función que asegura la existencia de la fila Carrera 101 sin manejo de errores complejos."""
    # Intentamos insertar directamente. Si ya existe (por una ejecución previa), fallará el INSERT,
    # pero usamos get_or_create para manejar esto de forma segura.
    try:
        carrera, created = Carrera.objects.get_or_create(
            id_carrera=101, 
            defaults={'nombre': nombre}
        )
        return carrera
    except Exception as e:
        # Si la inserción falla, asumimos que es por el ID duplicado.
        return Carrera.objects.get(id_carrera=101)


# --- 2. Función Principal de Carga (CON LÓGICA DE NEGOCIO FINAL) ---
def cargar_datos_iniciales():
    """Carga los datos iniciales de alumnos, cuotas, pagos y comprobantes."""
    print("Iniciando carga de datos iniciales...")

    global id_pago_counter 
    global id_comprobante_counter 

    # 1. Limpieza Total (Necesaria para inserciones clean)
    try:
        print("Limpiando datos antiguos...")
        # ORDEN INVERSO DE DEPENDENCIA
        Comprobante.objects.all().delete()
        Pago.objects.all().delete()
        PlanCuotasAlumno.objects.all().delete()
        Cuota.objects.all().delete() 
        Alumno.objects.all().delete()
        Carrera.objects.all().delete() # Aseguramos que la tabla Carrera esté vacía de datos
        print("Limpieza de datos temporales completada.")
    except Exception as e:
        print(f"Error o advertencia durante la limpieza (si las tablas no existen): {e}") 
        
    
    # 2. INSERCIÓN CRÍTICA: Insertar la fila Padre (Carrera 101)
    carrera_default = obtener_o_crear_carrera() # Esto ya no fallará si la tabla existe

    # B. Datos de los alumnos (NUEVAS REGLAS DE NEGOCIO Y ROL)
    datos_alumnos = [
        # Alumno 1: Juan Perez (DEUDA ALTA)
        {
            'nombre': 'Juan', 'apellido': 'Perez', 'dni': '34567890', 'email': 'juan.perez@example.com', 'rol': 'Alumno', 'id_alumno': 1,
            'cuotas': [
                # Pagadas
                {'nro_cuota': 14, 'periodo': 'Febrero 2024', 'importe': 30000, 'vencimiento': '2024-02-10', 'estado': 'Pagada', 'fechaPago': '2024-02-09', 'medioPago': 'Transferencia'},
                {'nro_cuota': 15, 'periodo': 'Marzo 2024', 'importe': 35000, 'vencimiento': '2024-03-10', 'estado': 'Pagada', 'fechaPago': '2024-03-11', 'medioPago': 'Rapipago'},
                {'nro_cuota': 16, 'periodo': 'Abril 2024', 'importe': 40000, 'vencimiento': '2024-04-10', 'estado': 'Pagada', 'fechaPago': '2024-04-10', 'medioPago': 'Mercado Pago'},
                {'nro_cuota': 1, 'periodo': 'Marzo 2025', 'importe': 20000, 'vencimiento': '2025-03-10', 'estado': 'Pagada', 'fechaPago': '2025-03-09', 'medioPago': 'Transferencia'},
                {'nro_cuota': 2, 'periodo': 'Abril 2025', 'importe': 20000, 'vencimiento': '2025-04-10', 'estado': 'Pagada', 'fechaPago': '2025-04-11', 'medioPago': 'Rapipago'},
                
                # VENCIDAS CON RECARGO
                {'nro_cuota': 6, 'periodo': 'Septiembre 2025', 'importe': 90000, 'vencimiento': '2025-09-10', 'estado': 'Vencida'}, 
                {'nro_cuota': 7, 'periodo': 'Octubre 2025', 'importe': 95000, 'vencimiento': '2025-10-10', 'estado': 'Vencida'}, 
                {'nro_cuota': 8, 'periodo': 'Noviembre 2025', 'importe': 100000, 'vencimiento': '2025-11-10', 'estado': 'Vencida'}, 
                
                # PENDIENTE (Diciembre 2025)
                {'nro_cuota': 9, 'periodo': 'Diciembre 2025', 'importe': 100000, 'vencimiento': '2025-12-10', 'estado': 'Pendiente'},
            ]
        },
        # Alumno 2: Maria Lopez (Al Día, solo Diciembre Pendiente)
        {
            'nombre': 'Maria', 'apellido': 'Lopez', 'dni': '12345678', 'email': 'maria.lopez@example.com', 'rol': 'Alumno', 'id_alumno': 2,
            'cuotas': [
                # Pagadas
                {'nro_cuota': 10, 'periodo': 'Marzo 2025', 'importe': 18000, 'vencimiento': '2025-03-10', 'estado': 'Pagada', 'fechaPago': '2025-03-08', 'medioPago': 'Transferencia'},
                {'nro_cuota': 11, 'periodo': 'Abril 2025', 'importe': 18000, 'vencimiento': '2025-04-10', 'estado': 'Pagada', 'fechaPago': '2025-04-09', 'medioPago': 'Mercado Pago'},
                {'nro_cuota': 18, 'periodo': 'Noviembre 2025', 'importe': 18000, 'vencimiento': '2025-11-10', 'estado': 'Pagada', 'fechaPago': '2025-11-09', 'medioPago': 'Transferencia'},
                
                # PENDIENTE
                {'nro_cuota': 19, 'periodo': 'Diciembre 2025', 'importe': 18000, 'vencimiento': '2025-12-10', 'estado': 'Pendiente'},
            ]
        },
        # Perfil Administrativo
        {
            'nombre': 'Secretaria', 'apellido': 'Administrativa', 'dni': '00000001', 'email': 'admin@isme.com', 'rol': 'Administrativo', 'id_alumno': 3,
            'cuotas': []
        }
    ]

    
    # D. Iterar sobre los datos y crear objetos en la DB
    for datos_alumno in datos_alumnos:
        # 1. Crear el Alumno
        try:
            alumno = Alumno.objects.create(
                id_alumno=datos_alumno['id_alumno'],
                nombre=datos_alumno['nombre'],
                apellido=datos_alumno['apellido'],
                dni=datos_alumno['dni'],
                email=datos_alumno.get('email', f"{datos_alumno['nombre']}@isme.com"),
                direccion="Calle Ficticia 123",
                rol=datos_alumno['rol']
            )
            print(f"-> Alumno creado: {alumno.nombre} {alumno.apellido} ({alumno.rol})")
        except IntegrityError:
            print(f"-> Alumno {datos_alumno['nombre']} ya existe (Error de limpieza).")
            alumno = Alumno.objects.get(id_alumno=datos_alumno['id_alumno'])


        # 2. Iterar sobre las cuotas de este alumno
        for datos_cuota in datos_alumno['cuotas']:
            
            # --- Lógica de Recargo del 5% ---
            recargo = 0.00
            if datos_cuota['estado'] == 'Vencida':
                recargo = float(datos_cuota['importe']) * 0.05 
                recargo = round(recargo, 2) 

            # --- Crear Cuota Base (Tabla 'Cuota') ---
            cuota_base, created = Cuota.objects.get_or_create(
                id_cuota=datos_cuota['nro_cuota'] * 100 + alumno.id_alumno, 
                defaults={
                    'periodo': datos_cuota['periodo'],
                    'importe': datos_cuota['importe'],
                    'vencimiento': datos_cuota['vencimiento'],
                    'recargo_importe': recargo, 
                    'fk_id_carrera': carrera_default, # FK de Carrera (id=101)
                }
            )

            # --- Crear PlanCuotasAlumno (Relación estado-alumno) ---
            plan_cuota, created = PlanCuotasAlumno.objects.get_or_create(
                id_plan=datos_cuota['nro_cuota'] * 1000 + alumno.id_alumno, 
                defaults={
                    'estado': datos_cuota['estado'],
                    'fk_id_alumno': alumno,
                    'fk_id_cuota': cuota_base,
                }
            )

            # --- Si está Pagada, crear Pago y Comprobante ---
            if datos_cuota['estado'] == 'Pagada':
                global id_pago_counter
                global id_comprobante_counter
                id_pago_counter += 1
                id_comprobante_counter += 1
                
                fecha_pago_dt = datetime.strptime(datos_cuota['fechaPago'], '%Y-%m-%d')

                pago = Pago.objects.create(
                    id_pago=id_pago_counter,
                    fecha_pago=fecha_pago_dt, 
                    importe_pagado=datos_cuota['importe'], 
                    forma_pago=datos_cuota['medioPago'],
                    fk_id_plan=plan_cuota
                )
                
                Comprobante.objects.create(
                    id_comprobante=id_comprobante_counter,
                    nro_comprobante=f"RC-{id_comprobante_counter}",
                    fecha_emision=fecha_pago_dt,
                    fk_id_pago=pago
                )

                print(f"   -> Cuota {datos_cuota['periodo']} PAGADA.")
            else:
                importe_final = float(datos_cuota['importe']) + float(recargo)
                print(f"   -> Cuota {datos_cuota['periodo']} ({datos_cuota['estado']}) cargada. Importe con recargo: ${importe_final:.2f}")