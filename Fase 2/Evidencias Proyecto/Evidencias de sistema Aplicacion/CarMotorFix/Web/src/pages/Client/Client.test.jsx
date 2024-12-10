import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Client from './Client';
import { DarkModeContext } from '../../context/DarkModeContext';
import { MemoryRouter } from 'react-router-dom';

describe('Cotizaciones Section', () => {
    const mockProps = {
        darkMode: false,
        servicios: [
            { id: 1, tp_servicio: 'Cambio de Aceite', costserv: 15000 },
            { id: 2, tp_servicio: 'Revisión de Frenos', costserv: 25000 },
        ],
        vehiculos: [
            { id: 1, modelo: 'Civic', patente: 'ABC123', marca_id: { nombre_marca: 'Honda' } },
        ],
        mecanico: [{ id: 1, prim_nom: 'Juan', prim_apell: 'Pérez' }],
        formData: { catalogo_servicios: [] },
        totalServicios: 40000,
        OT: [],
        showCotizacionModal: false,
        setShowCotizacionModal: vi.fn(),
        handleSubmitCotizacion: vi.fn(),
        handleServicioSelect: vi.fn(),
        handleChangeCotizacion: vi.fn(),
        handleViewCotizacion: vi.fn(),
        columns2: [],
    };

    it('Generar un registro en "Mis autos"', () => {
        const mockContextValue = { darkMode: false };
        render(
            <MemoryRouter>
                <DarkModeContext.Provider value={mockContextValue}>
                    <Client {...mockProps} />
                </DarkModeContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByText('Mis Cotizaciones')).toBeInTheDocument();
        expect(screen.getByText('Solicitar')).toBeInTheDocument();
    });

    it('Generar una solicitud en "Mis Cotizaciones"', () => {
        render(
            <MemoryRouter>
                <DarkModeContext.Provider value={{ darkMode: false }}>
                    <Client {...mockProps} />
                </DarkModeContext.Provider>
            </MemoryRouter>
        );

        const solicitarButton = screen.getByText('Solicitar');
        fireEvent.click(solicitarButton);

        expect(screen.getByText('Nueva Cotización')).toBeInTheDocument();
    });

    it('debería mostrar "No tienes Cotizaciones" si OT está vacío', () => {
        const mockContextValue = { darkMode: false };
        render(
            <MemoryRouter>
                <DarkModeContext.Provider value={mockContextValue}>
                    <Client {...mockProps} />
                </DarkModeContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByText('No tienes Cotizaciones.')).toBeInTheDocument();
    });
});
