import { render, screen } from '@testing-library/react';
import ProyectoCard from './ProyectoCard';
import type { Proyecto } from '../types';

// 1. Preparamos un "Mock" (objeto falso) de un proyecto
const mockProyecto = {
  id: 1,
  titulo: 'Plataforma Sencillito',
  descripcion: 'Sistema de pagos online escalable.',
  urlDemo: 'https://demo.com',
  urlRepo: 'https://github.com',
  activo: true,
  fechaCreacion: '2026-04-20',
  tecnologias: [{ id: 1, nombre: 'React' }, { id: 2, nombre: 'Tailwind' }]
} as Proyecto;

describe('Componente ProyectoCard', () => {
  
  it('renderiza el título y la descripción del proyecto correctamente', () => {
    // Renderizamos el componente pasándole nuestras props falsas
    render(<ProyectoCard proyecto={mockProyecto} />);

    // Buscamos que los textos existan en el DOM (Document Object Model)
    expect(screen.getByText('Plataforma Sencillito')).toBeInTheDocument();
    expect(screen.getByText('Sistema de pagos online escalable.')).toBeInTheDocument();
  });

  it('renderiza las insignias (badges) de las tecnologías', () => {
    render(<ProyectoCard proyecto={mockProyecto} />);

    // Verificamos que el mapeo de tecnologías funciona
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Tailwind')).toBeInTheDocument();
  });
  
});