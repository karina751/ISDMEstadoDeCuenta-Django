import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { FaMoneyBillWave } from 'react-icons/fa';

/**
 * Componente que muestra las cuotas en estado 'Vencida' o 'Pendiente'.
 * - Añade funcionalidad de selección múltiple y pago consolidado.
 */
const CuotasPendientes = ({ cuotasImpagas, manejarPago }) => {
    // Estado para almacenar los IDs de las cuotas seleccionadas
    const [cuotasSeleccionadas, setCuotasSeleccionadas] = useState([]);

    // Calcular la deuda total de las cuotas seleccionadas
    const calcularTotalSeleccionado = () => {
        return cuotasImpagas
            .filter(cuota => cuotasSeleccionadas.includes(cuota.id_plan))
            .reduce((total, cuota) => {
                // Usamos el importe total (Base + Recargo)
                const totalAPagar = parseFloat(cuota.importe_total_con_recargo);
                return total + totalAPagar;
            }, 0);
    };

    // Manejar la selección/deselección de un checkbox
    const manejarSeleccion = (id_plan, estado) => {
        // Solo permitir seleccionar cuotas VENCIDAS, no PENDIENTES
        if (estado === 'Pendiente') return; 
        
        setCuotasSeleccionadas(prevSeleccionadas => {
            if (prevSeleccionadas.includes(id_plan)) {
                // Deseleccionar
                return prevSeleccionadas.filter(id => id !== id_plan);
            } else {
                // Seleccionar
                return [...prevSeleccionadas, id_plan];
            }
        });
    };

    // Manejar el clic en el botón de pago consolidado
    const manejarPagoConsolidado = () => {
        const total = calcularTotalSeleccionado();
        manejarPago(total); // Llama a la función de pago con el total consolidado
        setCuotasSeleccionadas([]); // Limpia la selección después del pago
    };

    const totalSeleccionado = calcularTotalSeleccionado();
    const haySeleccionadas = cuotasSeleccionadas.length > 0;
    
    // **VARIABLE ELIMINADA: Eliminamos 'cuotasPagables'**

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <h4 className="mb-4">Cuotas Pendientes</h4>
                
                {/* Controles y Botón de Pago Consolidado */}
                <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                    <h5>
                        Total a Pagar (Seleccionadas): 
                        <span className="text-danger ms-2">
                            ${totalSeleccionado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </span>
                    </h5>
                    <Button
                        variant="success"
                        onClick={manejarPagoConsolidado}
                        disabled={!haySeleccionadas}
                    >
                        <FaMoneyBillWave /> Pagar {cuotasSeleccionadas.length} Cuotas
                    </Button>
                </div>


                {cuotasImpagas.length === 0 ? (
                    <p className="text-center text-muted">No tienes cuotas pendientes. ¡Estás al día!</p>
                ) : (
                    <Table responsive hover className="tabla-cuotas">
                        <thead>
                            <tr>
                                <th>Sel.</th> 
                                <th>Período</th>
                                <th>Importe Base</th> 
                                <th>Recargo (5%)</th> 
                                <th>Total a Pagar</th> 
                                <th>Vencimiento</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuotasImpagas.map(cuota => {
                                const importeBase = parseFloat(cuota.datos_cuota.importe);
                                const recargo = parseFloat(cuota.datos_cuota.recargo_importe);
                                
                                const totalAPagar = importeBase + recargo;
                                const esVencida = cuota.estado === 'Vencida';
                                
                                return (
                                    <tr key={cuota.id_plan}>
                                        {/* Columna de Checkbox */}
                                        <td>
                                            <Form.Check 
                                                type="checkbox"
                                                checked={cuotasSeleccionadas.includes(cuota.id_plan)}
                                                disabled={!esVencida} // Solo se marcan las VENCIDAS
                                                onChange={() => manejarSeleccion(cuota.id_plan, cuota.estado)}
                                            />
                                        </td>
                                        
                                        <td>{cuota.datos_cuota.periodo}</td> 
                                        <td>${importeBase.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</td> 
                                        
                                        <td className={recargo > 0 ? 'text-danger' : ''}>
                                            ${recargo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </td>
                                        
                                        <td>
                                            <strong className={esVencida ? 'text-danger' : 'text-warning'}>
                                                ${totalAPagar.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                            </strong>
                                        </td>

                                        <td>{cuota.datos_cuota.vencimiento}</td>
                                        
                                        <td>
                                            <Badge 
                                                bg={esVencida ? 'danger' : 'warning'}
                                                className="etiqueta-estado"
                                            >
                                                {cuota.estado}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button 
                                                variant="primary" 
                                                size="sm" 
                                                onClick={() => manejarPago(totalAPagar)}
                                                disabled={!esVencida} // Solo se paga individualmente si está VENCIDA
                                            >
                                                <FaMoneyBillWave /> Pagar
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default CuotasPendientes;