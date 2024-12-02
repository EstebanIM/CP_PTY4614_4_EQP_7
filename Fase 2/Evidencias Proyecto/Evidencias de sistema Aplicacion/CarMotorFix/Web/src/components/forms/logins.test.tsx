import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, expect } from 'vitest';
import { LoginForm } from './logins';

describe('LoginForm', () => {
    it('debería renderizar los campos de email y contraseña y el botón de envío', () => {
        render(
            <LoginForm
                email=""
                setEmail={vi.fn()}
                password=""
                setPassword={vi.fn()}
                handleSubmit={vi.fn()}
            />
        );

        // Verificar que los campos de entrada y el botón existen
        expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    });

    it('debería llamar a setEmail cuando el usuario escribe en el campo de email', () => {
        const mockSetEmail = vi.fn();
        render(
            <LoginForm
                email=""
                setEmail={mockSetEmail}
                password=""
                setPassword={vi.fn()}
                handleSubmit={vi.fn()}
            />
        );

        const emailInput = screen.getByLabelText(/Correo Electrónico/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('debería llamar a setPassword cuando el usuario escribe en el campo de contraseña', () => {
        const mockSetPassword = vi.fn();
        render(
            <LoginForm
                email=""
                setEmail={vi.fn()}
                password=""
                setPassword={mockSetPassword}
                handleSubmit={vi.fn()}
            />
        );

        const passwordInput = screen.getByLabelText(/Contraseña/i);
        fireEvent.change(passwordInput, { target: { value: '123456' } });

        expect(mockSetPassword).toHaveBeenCalledWith('123456');
    });

    it('debería llamar a handleSubmit cuando se hace clic en el botón "Iniciar Sesión"', () => {
        const mockHandleSubmit = vi.fn();
        render(
            <LoginForm
                email="test@example.com"
                setEmail={vi.fn()}
                password="123456"
                setPassword={vi.fn()}
                handleSubmit={mockHandleSubmit}
            />
        );

        const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
        fireEvent.click(submitButton);

        expect(mockHandleSubmit).toHaveBeenCalled();
    });
});
