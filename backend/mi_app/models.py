from django.db import models

class Alumno(models.Model):
    id_alumno = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    dni = models.CharField(max_length=20, unique=True) 
    direccion = models.CharField(max_length=100)
    email = models.CharField(max_length=100)

    # Para distinguir entre 'Alumno' y 'Administrativo'
    rol = models.CharField(max_length=20, default='Alumno') 

    class Meta:
        db_table = 'Alumno'
    
    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Carrera(models.Model):
    id_carrera = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'Carrera'

    def __str__(self):
        return self.nombre

# ----------------------------------------------------------------------
# 2. Tablas de Relación y Cuotas
# ----------------------------------------------------------------------

class Cuota(models.Model):
    id_cuota = models.IntegerField(primary_key=True)
    periodo = models.CharField(max_length=20)
    importe = models.DecimalField(max_digits=10, decimal_places=2)
    vencimiento = models.DateField()
    # Usamos on_delete=models.CASCADE para la creación.
    # Si usamos DO_NOTHING con managed=False, Django no crea la tabla.
    fk_id_carrera = models.ForeignKey(Carrera, models.CASCADE, db_column='FK_id_carrera')

    # Recargo fijo aplicado a la cuota
    recargo_importe = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) 

    class Meta:
        db_table = 'Cuota' 
        
    def __str__(self):
        return f"Cuota {self.periodo} - {self.fk_id_carrera.nombre}"


class PlanEstudio(models.Model):
    id_plan = models.IntegerField(primary_key=True)
    # Claves Foráneas: Usamos CASCADE en lugar de DO_NOTHING para la creación
    fk_id_alumno = models.ForeignKey(Alumno, models.CASCADE, db_column='FK_id_alumno')
    fk_id_carrera = models.ForeignKey(Carrera, models.CASCADE, db_column='FK_id_carrera')

    class Meta:
        db_table = 'Plan_Estudio'


class PlanCuotasAlumno(models.Model):
    id_plan = models.IntegerField(primary_key=True)
    estado = models.CharField(max_length=20)
    # Claves Foráneas: Usamos CASCADE
    fk_id_alumno = models.ForeignKey(
        Alumno, 
        models.CASCADE, 
        db_column='FK_id_alumno', 
        related_name='planes_cuotas'
    )
    fk_id_cuota = models.ForeignKey(Cuota, models.CASCADE, db_column='FK_id_cuota') # CAMBIO

    class Meta:
        db_table = 'Plan_Cuotas_Alumno'

# ----------------------------------------------------------------------
# 3. Tablas de Pago y Comprobante
# ----------------------------------------------------------------------

class Pago(models.Model):
    id_pago = models.IntegerField(primary_key=True)
    fecha_pago = models.DateTimeField()
    importe_pagado = models.DecimalField(max_digits=10, decimal_places=2)
    forma_pago = models.CharField(max_length=50)
    fk_id_plan = models.ForeignKey(PlanCuotasAlumno, models.CASCADE, db_column='FK_id_plan')

    class Meta:
        db_table = 'Pago'


class Comprobante(models.Model):
    id_comprobante = models.IntegerField(primary_key=True)
    nro_comprobante = models.CharField(max_length=50)
    fecha_emision = models.DateTimeField() # Fecha y hora exacta de la emisión (requiere input manual)
    fk_id_pago = models.ForeignKey(Pago, models.CASCADE, db_column='FK_id_pago') # Relación con Pago. Si se elimina el Pago, se elimina el Comprobante (CASCADE)

    class Meta:
        db_table = 'Comprobante'