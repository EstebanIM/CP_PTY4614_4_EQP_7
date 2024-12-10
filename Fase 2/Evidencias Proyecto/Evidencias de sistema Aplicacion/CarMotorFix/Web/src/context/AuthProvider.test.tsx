import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { getUserFromLocalCookie, getTokenFromLocalCookie } from '../lib/cookies';
import { login as loginService } from '../services/authService';
import React from 'react';

// Mock de funciones externas
vi.mock('../lib/cookies', () => ({
    getUserFromLocalCookie: vi.fn(),
    getTokenFromLocalCookie: vi.fn(),
}));

vi.mock('../services/authService', () => ({
    login: vi.fn(),
}));

// Componente de prueba para consumir el contexto
const TestComponent = () => {
    const { user, login, loading } = useAuth();

    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            {user ? <p>Usuario: {user.name}</p> : <p>No hay usuario</p>}
            <button onClick={() => login('test@example.com', 'password')}>Iniciar sesión</button>
        </div>
    );
};

describe('AuthProvider', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('muestra "No hay usuario" cuando no hay token', async () => {
        // Configuración del mock para simular que no hay token
        (getTokenFromLocalCookie as jest.Mock).mockReturnValue(null);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Espera a que se muestre el mensaje de que no hay usuario
        await waitFor(() => expect(screen.getByText('No hay usuario')).toBeInTheDocument());
    });

    it('muestra el nombre del usuario cuando hay token y usuario válido', async () => {
        // Configuración de los mocks para token y usuario
        (getTokenFromLocalCookie as jest.Mock).mockReturnValue('valid-token');
        (getUserFromLocalCookie as jest.Mock).mockResolvedValue({ name: 'John Doe' });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Espera a que se muestre el nombre del usuario
        await waitFor(() => expect(screen.getByText('Usuario: John Doe')).toBeInTheDocument());
    });

    it('maneja correctamente el inicio de sesión', async () => {
        // Configuración del mock de loginService
        (loginService as jest.Mock).mockResolvedValue({ name: 'Jane Doe' });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Hacer clic en el botón de inicio de sesión
        const loginButton = await screen.findByRole('button', { name: 'Iniciar sesión' });
        loginButton.click();

        // Esperar a que se muestre el nuevo usuario
        await waitFor(() => expect(screen.getByText('Usuario: Jane Doe')).toBeInTheDocument());

        // Verifica que el servicio de inicio de sesión fue llamado con los datos correctos
        expect(loginService).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('maneja errores al verificar el usuario', async () => {
        // Configuración del mock para simular error al obtener el usuario
        (getTokenFromLocalCookie as jest.Mock).mockReturnValue('valid-token');
        (getUserFromLocalCookie as jest.Mock).mockRejectedValue(new Error('Error de usuario'));

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Espera a que se muestre "No hay usuario" después del error
        await waitFor(() => expect(screen.getByText('No hay usuario')).toBeInTheDocument());
    });
});
