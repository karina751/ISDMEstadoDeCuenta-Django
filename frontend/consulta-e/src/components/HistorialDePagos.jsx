import React, { useState, useMemo } from 'react';
import { Card, Table, Alert, Button, Form } from 'react-bootstrap';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import './HistorialDePagos.css';

/**
 * Componente que muestra el historial de cuotas pagadas y genera el PDF
 * completo del estado de cuenta.
 */
const HistorialDePagos = ({ 
    cuotasPagadas, 
    usuario, 
    cuotasImpagas, 
    deudaTotal, 
    cuotasVencidasCount 
}) => {
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [filtroAnio, setFiltroAnio] = useState('Todos');
    const [ordenarPor, setOrdenarPor] = useState(null);
    const [ordenDireccion, setOrdenDireccion] = useState('asc');

    // ... (Manejo de filtros y ordenación sin cambios) ...

    const manejarFiltroTextoChange = (e) => {
        setFiltroTexto(e.target.value);
    };

    const manejarFiltroEstadoChange = (e) => {
        setFiltroEstado(e.target.value);
    };

    const manejarFiltroAnioChange = (e) => {
        setFiltroAnio(e.target.value);
    };

    const manejarOrdenacion = (campo) => {
        if (ordenarPor === campo) {
            setOrdenDireccion(ordenDireccion === 'asc' ? 'desc' : 'asc');
        } else {
            setOrdenarPor(campo);
            setOrdenDireccion('asc');
        }
    };

    // Resuelve la advertencia ESLint y aplica la lógica de filtrado y ordenación.
    const cuotasFiltradasYOrdenadas = useMemo(() => {
        let cuotasTrabajo = [...cuotasPagadas];

        const filtroMin = filtroTexto.toLowerCase();

        // Filtrar por estado
        if (filtroEstado !== 'Todos') {
            cuotasTrabajo = cuotasTrabajo.filter(cuota => cuota.estado === filtroEstado);
        }

        // Filtrar por año (basado en el periodo de la cuota anidada)
        if (filtroAnio !== 'Todos') {
            cuotasTrabajo = cuotasTrabajo.filter(cuota => {
                if (!cuota.datos_cuota || !cuota.datos_cuota.periodo) return false;
                const anioCuota = cuota.datos_cuota.periodo.split(' ')[1];
                return anioCuota === filtroAnio;
            });
        }
        
        // Filtrar por texto 
        if (filtroTexto) {
            cuotasTrabajo = cuotasTrabajo.filter(cuota =>
                (cuota.datos_cuota && String(cuota.datos_cuota.periodo).toLowerCase().includes(filtroMin)) ||
                (cuota.pagos.length > 0 && String(cuota.pagos[0].forma_pago).toLowerCase().includes(filtroMin))
            );
        }

        // Ordenar los resultados
        if (ordenarPor) {
            cuotasTrabajo.sort((a, b) => {
                let aValue, bValue;

                if (ordenarPor === 'periodo') {
                    aValue = a.datos_cuota.periodo;
                    bValue = b.datos_cuota.periodo;
                } else if (ordenarPor === 'vencimiento') {
                    aValue = a.datos_cuota.vencimiento;
                    bValue = b.datos_cuota.vencimiento;
                } else if (ordenarPor === 'fechaPago' && a.pagos.length > 0) {
                    aValue = a.pagos[0].fecha_pago;
                    bValue = b.pagos[0].fecha_pago;
                } else if (ordenarPor === 'medioPago' && a.pagos.length > 0) {
                    aValue = a.pagos[0].forma_pago;
                    bValue = b.pagos[0].forma_pago;
                } else {
                    return 0;
                }
                
                if (aValue < bValue) return ordenDireccion === 'asc' ? -1 : 1;
                if (aValue > bValue) return ordenDireccion === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return cuotasTrabajo;
    }, [cuotasPagadas, filtroTexto, filtroEstado, filtroAnio, ordenarPor, ordenDireccion]);

    const aniosDisponibles = useMemo(() => {
        const periodos = cuotasPagadas.map(cuota => cuota.datos_cuota?.periodo).filter(p => p);
        const anios = [...new Set(periodos.map(periodo => periodo.split(' ')[1]))];
        return ['Todos', ...anios.sort()];
    }, [cuotasPagadas]);


    const renderSortIcon = (campo) => {
        if (ordenarPor === campo) {
            return ordenDireccion === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    // ------------------------------------------------------------------
    // NUEVA FUNCIÓN: Maneja el clic en el botón "Ver" (Muestra Alerta)
    // ------------------------------------------------------------------
    const manejarVistaComprobante = () => {
        alert("Redireccionando al comprobante de pago (funcionalidad en desarrollo).");
    };


    // ------------------------------------------------------------------
    // FUNCIÓN DE GENERACIÓN DE PDF (FINAL Y COMPLETA)
    // ------------------------------------------------------------------
    const generarPDF = () => {
        const ahora = new Date();
        const formatoFecha = ahora.toLocaleDateString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
        const formatoHora = ahora.toLocaleTimeString('es-AR', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        const fechaCompleta = `${formatoFecha} ${formatoHora}`;

        const doc = new jsPDF();
        const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
        
        let yPosicion = 15; 

        // --- 1. CABECERA Y DATOS DE EMISIÓN ---
        doc.setFontSize(16);
        doc.setTextColor(93, 2, 28); 
        doc.text('Instituto Superior del Milagro', 105, yPosicion, null, null, "center");
        yPosicion += 7;
        
        doc.setFontSize(12);
        doc.text('Estado de Cuenta', 105, yPosicion, null, null, "center");
        yPosicion += 6;
        
        doc.setFontSize(8);
        doc.setTextColor(51, 51, 51); 
        doc.text(`Fecha y Hora de Emisión: ${fechaCompleta}`, 105, yPosicion, null, null, "center");
        yPosicion += 12;

        // --- 2. INFORMACIÓN DEL ALUMNO ---
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); 
        doc.text(`Alumno: ${nombreCompleto}`, 14, yPosicion);
        doc.text(`DNI: ${usuario.dni}`, 14, yPosicion + 5);
        yPosicion += 15;

        // --- 3. RESUMEN DE CUENTA (SIMPLIFICADO - SÓLO DEUDA) ---
        doc.setFontSize(12);
        doc.setTextColor(93, 2, 28); 
        doc.text('Resumen de Cuenta', 14, yPosicion);
        yPosicion += 7;
        
        // Dibujar caja única de Deuda Total y Vencidas
        doc.setFillColor(253, 222, 222); 
        doc.rect(14, yPosicion, 180, 12, 'F'); 
        
        doc.setTextColor(93, 2, 28); 
        doc.setFontSize(10);
        doc.text('DEUDA TOTAL:', 16, yPosicion + 7); 
        doc.setFontSize(12);
        doc.text(`$${deudaTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 45, yPosicion + 7);

        // Agregamos el número de cuotas vencidas como texto simple al lado derecho
        doc.setFontSize(10);
        doc.text('CUOTAS VENCIDAS:', 120, yPosicion + 7);
        doc.setFontSize(12);
        doc.text(`${cuotasVencidasCount}`, 160, yPosicion + 7); 
        
        yPosicion += 20;

        // --- 4. TABLA DE CUOTAS PENDIENTES/VENCIDAS ---
        if (cuotasImpagas.length > 0) {
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0); 
            doc.text('Cuotas Pendientes', 14, yPosicion);
            yPosicion += 5;
            
            autoTable(doc, {
                startY: yPosicion,
                head: [['Período', 'Importe Base', 'Recargo (5%)', 'Total a Pagar', 'Vencimiento', 'Estado']],
                body: cuotasImpagas.map(cuota => {
                    const importeBase = parseFloat(cuota.datos_cuota.importe);
                    const recargo = parseFloat(cuota.datos_cuota.recargo_importe);
                    const totalAPagar = parseFloat(cuota.importe_total_con_recargo);
                    
                    return [
                        cuota.datos_cuota.periodo,
                        `$${importeBase.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`,
                        `$${recargo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
                        `$${totalAPagar.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
                        cuota.datos_cuota.vencimiento,
                        cuota.estado,
                    ];
                }),
                headStyles: { fillColor: [93, 2, 28], fontSize: 8 }, 
                styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
            });
            yPosicion = doc.lastAutoTable.finalY + 8;
        }

        // --- 5. TABLA DE HISTORIAL DE PAGOS ---
        if (cuotasPagadas.length > 0) {
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0); 
            doc.text('Historial de Pagos', 14, yPosicion);
            yPosicion += 5;

            autoTable(doc, {
                startY: yPosicion,
                head: [['Período', 'Importe Pagado', 'Fecha de Pago', 'Medio de Pago']],
                body: cuotasFiltradasYOrdenadas.map(cuota => [
                    cuota.datos_cuota.periodo,
                    `$${parseFloat(cuota.pagos[0]?.importe_pagado || cuota.datos_cuota.importe).toLocaleString('es-AR', { minimumFractionDigits: 0 })}`, 
                    cuota.pagos.length > 0 ? cuota.pagos[0].fecha_pago.split('T')[0] : 'N/A', 
                    cuota.pagos.length > 0 ? cuota.pagos[0].forma_pago : 'N/A',
                ]),
                headStyles: { fillColor: [40, 167, 69], fontSize: 8 }, 
                styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
            });
            yPosicion = doc.lastAutoTable.finalY + 10;
        }


        // --- 6. FOOTER  ---
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(`Este documento fue generado automáticamente el ${fechaCompleta}`, 105, yPosicion + 5, null, null, "center");
        doc.text('Instituto Superior del Milagro - Gestión Administrativa', 105, yPosicion + 10, null, null, "center");


        doc.save('estado_de_cuenta_completo.pdf');
    };

    return (
        <Card className="sombra-pequena seccion-tabla">
            <Card.Header className="bg-success text-white">
                <h5 className="mb-0">Historial de Pagos</h5>
            </Card.Header>
            <Card.Body>
                <div className="controles-tabla">
                    <Form.Group className="mb-2 grupo-filtro">
                        <Form.Label>Filtrar por Período:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Buscar..."
                            value={filtroTexto}
                            onChange={manejarFiltroTextoChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2 grupo-filtro">
                        <Form.Label>Filtrar por Estado:</Form.Label>
                        <Form.Select value={filtroEstado} onChange={manejarFiltroEstadoChange}>
                            <option value="Todos">Todos</option>
                            <option value="Pagada">Pagada</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Vencida">Vencida</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2 grupo-filtro">
                        <Form.Label>Filtrar por Año:</Form.Label>
                        <Form.Select value={filtroAnio} onChange={manejarFiltroAnioChange}>
                            {aniosDisponibles.map(anio => (
                                <option key={anio} value={anio}>{anio}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>
                {cuotasPagadas.length === 0 ? (
                    <Alert variant="info" className="texto-centrado">No hay pagos registrados.</Alert>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th onClick={() => manejarOrdenacion('periodo')} style={{ cursor: 'pointer' }}>
                                    Período {renderSortIcon('periodo')}
                                </th>
                                <th>Importe Pagado</th> 
                                <th>Estado</th>
                                <th onClick={() => manejarOrdenacion('fechaPago')} style={{ cursor: 'pointer' }}>
                                    Fecha de Pago {renderSortIcon('fechaPago')}
                                </th>
                                <th onClick={() => manejarOrdenacion('medioPago')} style={{ cursor: 'pointer' }}>
                                    Medio de Pago {renderSortIcon('medioPago')}
                                </th>
                                <th>Comprobante</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuotasFiltradasYOrdenadas.map((cuota) => (
                                <tr key={cuota.id_plan}>
                                    <td>{cuota.datos_cuota.periodo}</td>
                                    <td>${parseFloat(cuota.pagos[0]?.importe_pagado || cuota.datos_cuota.importe).toLocaleString('es-AR', { minimumFractionDigits: 0 })}</td> 
                                    <td><span className="badge bg-success">{cuota.estado}</span></td>
                                    
                                    <td>{cuota.pagos.length > 0 ? cuota.pagos[0].fecha_pago.split('T')[0] : 'N/A'}</td>
                                    <td>{cuota.pagos.length > 0 ? cuota.pagos[0].forma_pago : 'N/A'}</td>
                                    
                                    <td>
                                        <Button 
                                            variant="link" 
                                            onClick={manejarVistaComprobante} // <--- CAMBIO: Ahora solo lanza la alerta
                                            disabled={cuota.pagos.length === 0}
                                        >
                                            Ver
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                {cuotasPagadas.length > 0 && (
                    <div className="d-flex justify-content-end mt-3">
                        <Button onClick={generarPDF} variant="success">
                            Generar PDF
                        </Button>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default HistorialDePagos;