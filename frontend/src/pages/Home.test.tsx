import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';
import { api } from '../services/api';
import type { Perfil } from '../types';

// Le decimos a Vitest que intercepte este archivo
vi.mock('../services/api');
vi.mock('@react-pdf/renderer', () => ({
  PDFDownloadLink: ({ children }: any) => <div>{children({ loading: false })}</div>,
  Document: () => <div>Documento PDF</div>,
  Page: () => <div>Página</div>,
  Text: () => <div>Texto</div>,
  View: () => <div>Vista</div>,
  StyleSheet: { create: () => ({}) }
}));

describe('Página Home', () => {
  
  it('muestra el badge de disponibilidad si el perfil lo indica', async () => {
    
    // Usamos vi.mocked() para decirle a TypeScript que estas son funciones simuladas (sin usar "any")
    vi.mocked(api.getProyectos).mockResolvedValue([]);
    vi.mocked(api.getEstudios).mockResolvedValue([]);
    vi.mocked(api.getExperiencias).mockResolvedValue([]);
    
    // Creamos un perfil de mentira respetando su Tipo (Type)
    const mockPerfil: Perfil = {
        resumen: 'Desarrollador experto',
        disponibilidad: true
    };
    vi.mocked(api.getPerfil).mockResolvedValue(mockPerfil);

    render(<Home />);

    // waitFor espera a que el useEffect termine de ejecutarse
    await waitFor(() => {
      // Verificamos que el texto del resumen cargó
      expect(screen.getByText('Desarrollador experto')).toBeInTheDocument();
      // Verificamos que la lógica condicional && mostró el badge verde
      expect(screen.getByText('Disponible para trabajar')).toBeInTheDocument();
    });
  });

});