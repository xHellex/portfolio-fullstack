import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';
import { api } from '../services/api';

// Interceptamos la API
vi.mock('../services/api');

describe('Página Login', () => {
  
  it('muestra un error si las credenciales son incorrectas', async () => {
    
    // Simulamos un rechazo de la base de datos de forma segura para TypeScript
    vi.mocked(api.login).mockRejectedValue(new Error('Credenciales inválidas'));

    render(<Login />);

    // 1. Buscamos los inputs y el botón (Asegúrate de tener htmlFor="username" en tu Login.tsx)
    const usernameInput = screen.getByLabelText(/Usuario/i); 
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

    // 2. Simulamos que el usuario escribe
    fireEvent.change(usernameInput, { target: { value: 'felo' } });
    fireEvent.change(passwordInput, { target: { value: 'claveFalsa123' } });

    // 3. Simulamos el click en "Iniciar Sesión"
    fireEvent.click(submitButton);

    // 4. Verificamos que el estado de error cambie y muestre el mensaje en pantalla
    const errorMessage = await screen.findByText('Usuario o contraseña incorrectos');
    expect(errorMessage).toBeInTheDocument();
  });
});