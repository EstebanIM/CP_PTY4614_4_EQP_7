import { describe, test, expect, vi } from 'vitest';
import { login, register, resetPassword } from './authService';
import { fetcher } from '../lib/strApi';
import { setToken } from '../lib/cookies';

vi.mock('../lib/strApi', () => ({
    fetcher: vi.fn(),
}));
vi.mock('../lib/cookies', () => ({
    setToken: vi.fn(),
}));

const STRAPI_URL = 'http://localhost:1337';

describe('Auth functionality tests', () => {
    test('login: successful login', async () => {
        // Mock del response exitoso
        const mockUser = { user: { id: 1, username: 'testUser' }, jwt: 'testToken' };
        (fetcher as jest.Mock).mockResolvedValueOnce(mockUser);

        const result = await login('test@example.com', 'password123');

        expect(fetcher).toHaveBeenCalledWith(`${STRAPI_URL}/api/auth/local`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: 'test@example.com', password: 'password123' }),
        });
        expect(setToken).toHaveBeenCalledWith(mockUser);
        expect(result).toEqual(mockUser.user);
    });

    test('login: failed login', async () => {
        (fetcher as jest.Mock).mockResolvedValueOnce({
            error: { message: 'Invalid credentials' },
        });

        await expect(login('test@example.com', 'wrongPassword')).rejects.toThrow('Invalid credentials');
    });

    test('resetPassword: successful reset request', async () => {
        (fetcher as jest.Mock).mockResolvedValueOnce({});

        const result = await resetPassword('test@example.com');

        expect(fetcher).toHaveBeenCalledWith(`${STRAPI_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com' }),
        });
        expect(result).toEqual({ success: true, message: 'Solicitud de recuperación enviada con éxito' });
    });

    test('resetPassword: fails to send request', async () => {
        (fetcher as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        await expect(resetPassword('test@example.com')).rejects.toThrow(
            'Error en la recuperación de contraseña: Network error',
        );
    });
});
