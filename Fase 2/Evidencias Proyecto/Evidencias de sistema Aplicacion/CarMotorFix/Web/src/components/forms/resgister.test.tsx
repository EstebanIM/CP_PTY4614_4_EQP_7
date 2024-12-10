import React, { render, screen, fireEvent } from '@testing-library/react';
import { RegisterForm } from './register';
import { vi, expect } from 'vitest';
import '@testing-library/jest-dom';

const mockSetEmail = vi.fn();
const mockSetPassword = vi.fn();
const mockSetConfirmPassword = vi.fn();
const mockSetName = vi.fn();
const mockSetSurname = vi.fn();
const mockHandleRutChange = vi.fn();

const defaultProps = {
    email: '',
    setEmail: mockSetEmail,
    password: '',
    setPassword: mockSetPassword,
    confirmPassword: '',
    setConfirmPassword: mockSetConfirmPassword,
    name: '',
    setName: mockSetName,
    surname: '',
    setSurname: mockSetSurname,
    rut: '',
    handleRutChange: mockHandleRutChange,
    passwordStrength: 3,
};

describe('RegisterForm', () => {
    beforeEach(() => {
        render(<RegisterForm {...defaultProps} />);
    });

    test('renderiza correctamente los campos de entrada', () => {
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/rut/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
        expect(screen.getByLabelText(/repetir contraseña/i)).toBeInTheDocument();
    });

    test('puedes escribir en los campos de entrada', () => {
        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
        fireEvent.change(screen.getByLabelText(/rut/i), { target: { value: '204386536' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'StrongPassword123!' } });
        fireEvent.change(screen.getByLabelText('Repetir Contraseña'), { target: { value: 'StrongPassword123!' } });

        expect(mockSetName).toHaveBeenCalledWith('Juan');
        expect(mockSetSurname).toHaveBeenCalledWith('Pérez');
        expect(mockHandleRutChange).toHaveBeenCalledWith('204386536');
        expect(mockSetEmail).toHaveBeenCalledWith('juan@example.com');
        expect(mockSetPassword).toHaveBeenCalledWith('StrongPassword123!');
        expect(mockSetConfirmPassword).toHaveBeenCalledWith('StrongPassword123!');
    });

    test('el toggle de visibilidad de la contraseña funciona', () => {
        const passwordInput = screen.getByLabelText('Contraseña') as HTMLInputElement;
        const togglePasswordButton = screen.getByLabelText(/toggle password visibility/i);

        expect(passwordInput.type).toBe('password');

        fireEvent.click(togglePasswordButton);
        expect(passwordInput.type).toBe('text');

        fireEvent.click(togglePasswordButton);
        expect(passwordInput.type).toBe('password');
    });

    test('el botón de submit está presente', () => {
        expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
    });

    test('la barra de fortaleza de la contraseña cambia de color según la fortaleza', () => {
        const strengthBar = screen.getByRole('progressbar');
        const strengthIndicator = strengthBar.querySelector('div');
        expect(strengthIndicator).toHaveClass('bg-green-500');
    });
});
