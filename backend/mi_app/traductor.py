# mi_app/traductor.py

from rest_framework import serializers
from .models import Alumno, Cuota, PlanCuotasAlumno, Pago, Comprobante

# --- Nivel de detalle más bajo: Comprobante y Pago ---

class TraductorComprobante(serializers.ModelSerializer):
    class Meta:
        model = Comprobante
        fields = '__all__'

class TraductorPago(serializers.ModelSerializer):
    # Relación inversa: Comprobante al Pago
    comprobantes = TraductorComprobante(many=True, read_only=True, source='comprobante_set')
    class Meta:
        model = Pago
        # Usamos los nombres de campos en la base de datos
        fields = ['id_pago', 'fecha_pago', 'importe_pagado', 'forma_pago', 'comprobantes']

# --- Traductor del Modelo Base Cuota ---
class TraductorCuotaBase(serializers.ModelSerializer):
    class Meta:
        model = Cuota
        # **IMPORTANTE:** Se expone el nuevo campo de recargo
        fields = ['id_cuota', 'periodo', 'importe', 'recargo_importe', 'vencimiento'] 

# --- Nivel medio: Plan de Cuotas (TraductorPlanCuotas) ---
class TraductorPlanCuotas(serializers.ModelSerializer):
    # Utilizamos el Traductor del modelo base Cuota para obtener los datos
    datos_cuota = TraductorCuotaBase(source='fk_id_cuota', read_only=True)
    
    # Suma el importe base y el recargo
    importe_total_con_recargo = serializers.SerializerMethodField()
    
    # Obtiene los pagos asociados a este plan de cuotas
    pagos = TraductorPago(many=True, read_only=True, source='pago_set')
    
    class Meta:
        model = PlanCuotasAlumno
        # Se añaden los campos calculados a la salida de la API
        fields = ['id_plan', 'estado', 'datos_cuota', 'pagos', 'importe_total_con_recargo']
        
    # Método para calcular el importe total a pagar (incluye recargo solo en VENCIDAS)
    def get_importe_total_con_recargo(self, obj):
        return obj.fk_id_cuota.importe + obj.fk_id_cuota.recargo_importe


# --- Nivel superior: Alumno (TraductorAlumno) ---

class TraductorAlumno(serializers.ModelSerializer):
    planes_de_pago = TraductorPlanCuotas(many=True, read_only=True, source='planes_cuotas') 

    class Meta:
        model = Alumno
        # Añadimos 'rol' para que React lo reciba
        fields = ['id_alumno', 'nombre', 'apellido', 'dni', 'email', 'rol', 'planes_de_pago']