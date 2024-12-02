import React from 'react';
import { describe, test, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResetPasswordForm } from './reset';
import { DarkModeContext } from '../../context/DarkModeContext';

describe('ResetPasswordForm Component', () => {
    test('renders correctly and handles interactions', () => {
        const mockSetEmail = vi.fn();
        const mockHandleSubmit = vi.fn();

        render(
            <DarkModeContext.Provider value={{ darkMode: false }}>
                <ResetPasswordForm
                    email="test@example.com"
                    setEmail={mockSetEmail}
                    handleSubmit={mockHandleSubmit}
                />
            </DarkModeContext.Provider>,
        );

        const emailInput = screen.getByLabelText('Correo Electrónico');
        const submitButton = screen.getByRole('button', { name: /enviar instrucciones/i });

        expect(emailInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();

        fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });
        expect(mockSetEmail).toHaveBeenCalledWith('newemail@example.com');

        fireEvent.click(submitButton);
        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    test('applies dark mode styles', () => {
        const mockSetEmail = vi.fn();
        const mockHandleSubmit = vi.fn();

        render(
            <DarkModeContext.Provider value={{ darkMode: true }}>
                <ResetPasswordForm
                    email="test@example.com"
                    setEmail={mockSetEmail}
                    handleSubmit={mockHandleSubmit}
                />
            </DarkModeContext.Provider>,
        );

        const submitButton = screen.getByRole('button', { name: /enviar instrucciones/i });
        expect(submitButton).toHaveClass('bg-gray-700 text-white');
    });

    test('applies light mode styles', () => {
        const mockSetEmail = vi.fn();
        const mockHandleSubmit = vi.fn();

        render(
            <DarkModeContext.Provider value={{ darkMode: false }}>
                <ResetPasswordForm
                    email="test@example.com"
                    setEmail={mockSetEmail}
                    handleSubmit={mockHandleSubmit}
                />
            </DarkModeContext.Provider>,
        );

        const submitButton = screen.getByRole('button', { name: /enviar instrucciones/i });
        expect(submitButton).toHaveClass('bg-indigo-600 text-white');
    });
});
