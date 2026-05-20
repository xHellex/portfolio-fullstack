import '@testing-library/jest-dom';

// Mapeamos matchMedia para que JSDOM no explote cuando un componente intente leer el tema del sistema
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false, // Simulamos que el sistema NO está en modo oscuro
    media: query,
    onchange: null,
    addListener: () => {}, // mock deprecated
    removeListener: () => {}, // mock deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});