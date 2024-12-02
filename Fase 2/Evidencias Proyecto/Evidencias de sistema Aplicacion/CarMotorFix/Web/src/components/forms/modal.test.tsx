import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { DarkModeContext } from '../../context/DarkModeContext';
import Modal from './modal';

describe('Componente Modal', () => {
    it('renderiza el modal cuando isOpen es true', () => {
        render(
            <DarkModeContext.Provider value={{ darkMode: false }}>
                <Modal isOpen={true} onClose={vi.fn()} loading={false}>
                    <p>Contenido del Modal</p>
                </Modal>
            </DarkModeContext.Provider>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Contenido del Modal')).toBeInTheDocument();
    });

    it('no renderiza el modal cuando isOpen es false', () => {
        render(
            <DarkModeContext.Provider value={{ darkMode: false }}>
                <Modal isOpen={false} onClose={vi.fn()} loading={false}>
                    <p>Contenido del Modal</p>
                </Modal>
            </DarkModeContext.Provider>
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('llama a onClose al hacer clic en el botón de cerrar', () => {
        const mockOnClose = vi.fn();
        render(
            <DarkModeContext.Provider value={{ darkMode: false }}>
                <Modal isOpen={true} onClose={mockOnClose} loading={false}>
                    <p>Contenido del Modal</p>
                </Modal>
            </DarkModeContext.Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /Close modal/i }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('muestra el spinner de carga cuando loading es true', () => {
        render(
            <DarkModeContext.Provider value={{ darkMode: false }}>
                <Modal isOpen={true} onClose={vi.fn()} loading={true}>
                    <p>Contenido del Modal</p>
                </Modal>
            </DarkModeContext.Provider>
        );

        expect(screen.queryByText('Contenido del Modal')).not.toBeInTheDocument();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('aplica estilos de modo oscuro cuando darkMode es true', () => {
        render(
            <DarkModeContext.Provider value={{ darkMode: true }}>
                <Modal isOpen={true} onClose={vi.fn()} loading={false}>
                    <p>Contenido del Modal</p>
                </Modal>
            </DarkModeContext.Provider>
        );

        const modal = screen.getByRole('dialog');
        expect(modal).toHaveClass('bg-gray-900');
    });
});
