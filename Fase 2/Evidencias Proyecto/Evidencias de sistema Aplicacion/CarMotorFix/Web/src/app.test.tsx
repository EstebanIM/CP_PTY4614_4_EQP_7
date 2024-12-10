import React from 'react';
import { render } from '@testing-library/react';
import App from './app';

describe('Prueba de humo para app', () => {
    test('Representa app sin bloquearse', () => {
        const { container } = render(<App />);
        expect(container).toBeDefined();
    });

    test('Representa la página de inicio de sesión como la ruta predeterminada', () => {
        const { getByText } = render(<App />);
    });
});
