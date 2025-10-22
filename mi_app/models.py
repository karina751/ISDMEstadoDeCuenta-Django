from django.db import models

class Alumno(models.Model):
    id_alumno = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    dni = models.CharField(max_length=20)
    direccion = models.CharField(max_length=100)
    email = models.CharField(max_length=100)

    class Meta:
        managed = False 
        db_table = 'Alumno'
    
    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Carrera(models.Model):
    id_carrera = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
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
    # Clave Foránea a Carrera
    fk_id_carrera = models.ForeignKey(Carrera, models.DO_NOTHING, db_column='FK_id_carrera')

    class Meta:
        managed = False
        db_table = 'Cuota'


class PlanEstudio(models.Model):
    id_plan = models.IntegerField(primary_key=True)
    # Claves Foráneas
    fk_id_alumno = models.ForeignKey(Alumno, models.DO_NOTHING, db_column='FK_id_alumno')
    fk_id_carrera = models.ForeignKey(Carrera, models.DO_NOTHING, db_column='FK_id_carrera')

    class Meta:
        managed = False
        db_table = 'Plan_Estudio'


class PlanCuotasAlumno(models.Model):
    id_plan = models.IntegerField(primary_key=True)
    estado = models.CharField(max_length=20)
    # Definición de relación inversa: 'planes_cuotas' para usar en la vista
    fk_id_alumno = models.ForeignKey(
        Alumno, 
        models.DO_NOTHING, 
        db_column='FK_id_alumno', 
        related_name='planes_cuotas'
    )
    fk_id_cuota = models.ForeignKey(Cuota, models.DO_NOTHING, db_column='FK_id_cuota')

    class Meta:
        managed = False
        db_table = 'Plan_Cuotas_Alumno'

# ----------------------------------------------------------------------
# 3. Tablas de Pago y Comprobante
# ----------------------------------------------------------------------

class Pago(models.Model):
    id_pago = models.IntegerField(primary_key=True)
    fecha_pago = models.DateTimeField()
    importe_pagado = models.DecimalField(max_digits=10, decimal_places=2)
    forma_pago = models.CharField(max_length=50)
    # Clave Foránea
    fk_id_plan = models.ForeignKey(PlanCuotasAlumno, models.DO_NOTHING, db_column='FK_id_plan')

    class Meta:
        managed = False
        db_table = 'Pago'


class Comprobante(models.Model):
    id_comprobante = models.IntegerField(primary_key=True)
    nro_comprobante = models.CharField(max_length=50)
    fecha_emision = models.DateTimeField()
    # Clave Foránea
    fk_id_pago = models.ForeignKey(Pago, models.DO_NOTHING, db_column='FK_id_pago')

    class Meta:
        managed = False
        db_table = 'Comprobante'