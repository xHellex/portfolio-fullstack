import type { Perfil, Proyecto, Estudio, Experiencia } from '../types';

const API_URL = 'http://localhost:8080/api/v1';

// Función mágica que busca la llave en la memoria del navegador
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Si hay token, lo adjunta
  };
};

export const api = {
  // === AUTH ===
  login: (credentials: any) => fetch(`${API_URL}/auth/login`, { 
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) 
  }).then(res => { if (!res.ok) throw new Error(); return res.json(); }),

  // === GETS (Públicos) ===
  getPerfil: () => fetch(`${API_URL}/perfil`).then(res => res.json()),
  getProyectos: () => fetch(`${API_URL}/proyectos`).then(res => res.json()),
  getEstudios: () => fetch(`${API_URL}/estudios`).then(res => res.json()),
  getExperiencias: () => fetch(`${API_URL}/experiencias`).then(res => res.json()),
  getTecnologias: () => fetch(`${API_URL}/tecnologias`).then(res => res.json()),

  // === POSTS & DELETES (Protegidos por Token) ===
  savePerfil: (data: Perfil) => fetch(`${API_URL}/perfil`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }),
  saveProyecto: (data: Partial<Proyecto>) => fetch(`${API_URL}/proyectos`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }),
  saveEstudio: (data: Estudio) => fetch(`${API_URL}/estudios`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }),
  saveExperiencia: (data: Experiencia) => fetch(`${API_URL}/experiencias`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }),
  vincularTecnologia: (proyectoId: number, techId: number) => fetch(`${API_URL}/proyectos/${proyectoId}/tecnologias/${techId}`, { method: 'POST', headers: getAuthHeaders() }),
  deleteProyecto: (id: number) => fetch(`${API_URL}/proyectos/${id}`, { method: 'DELETE', headers: getAuthHeaders() }),
};