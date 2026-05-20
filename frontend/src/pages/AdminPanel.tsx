import { useState, useEffect } from 'react';
import type { Tecnologia, Proyecto } from '../types'; // <-- Añade Proyecto
import { api } from '../services/api'; // <-- Importa la API

export default function AdminPanel() {
  // Estado para controlar qué pestaña está activa
  const [activeTab, setActiveTab] = useState('perfil');
  const [mensaje, setMensaje] = useState('');

  // Estados para los formularios
  const [perfilData, setPerfilData] = useState({ resumen: '', disponibilidad: false });
  const [expData, setExpData] = useState({ empresa: '', cargo: '', fechaInicio: '', fechaFin: '', descripcion: '', actual: false });
  const [estData, setEstData] = useState({ institucion: '', titulo: '', fechaInicio: '', fechaFin: '', descripcion: '', actual: false });
  const [proyData, setProyData] = useState({ titulo: '', descripcion: '', urlDemo: '', urlRepo: '' });
  
  const [tecnologiasDisponibles, setTecnologiasDisponibles] = useState<Tecnologia[]>([]);
  const [tecnologiasSeleccionadas, setTecnologiasSeleccionadas] = useState<number[]>([]);
  const [proyectosList, setProyectosList] = useState<Proyecto[]>([]);

  useEffect(() => {
    // VERIFICACIÓN DE SEGURIDAD
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return; // Detenemos la ejecución si no hay token
    }
    api.getTecnologias().then(data => setTecnologiasDisponibles(data)).catch(console.error);
    api.getProyectos().then(data => setProyectosList(data)).catch(console.error);
  }, []);

  const toggleTecnologia = (id: number) => {
    setTecnologiasSeleccionadas(prev => 
      prev.includes(id) ? prev.filter(techId => techId !== id) : [...prev, id]
    );
  };

  const showMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 4000); // El mensaje desaparece solo a los 4 seg
  };

  // HANDLERS PARA GUARDAR DATOS
  const handleSavePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfilData),
      });
      if (response.ok) {
        showMensaje('¡Perfil actualizado con éxito!');
      }
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      showMensaje('Error al guardar el perfil.');
    }
  };

  const handleSaveExperiencia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/experiencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expData),
      });
      if (response.ok) {
        showMensaje('¡Experiencia guardada!');
        setExpData({ empresa: '', cargo: '', fechaInicio: '', fechaFin: '', descripcion: '', actual: false });
      }
    } catch (error) {
      console.error("Error al guardar experiencia:", error); // <-- Agregamos esto
      showMensaje('Error al guardar la experiencia.');
    }
  };

  const handleSaveEstudio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/estudios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estData),
      });
      if (response.ok) {
        showMensaje('¡Estudio guardado!');
        setEstData({ institucion: '', titulo: '', fechaInicio: '', fechaFin: '', descripcion: '', actual: false });
      }
    } catch (error) {
      console.error("Error al guardar estudio:", error); // <-- Agregamos esto
      showMensaje('Error al guardar el estudio.');
    }
  };

  const handleSaveProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...proyData, activo: true, fechaCreacion: new Date().toISOString().split('T')[0] }),
      });
      if (response.ok) {
        const pCreado = await response.json();
        for (const techId of tecnologiasSeleccionadas) {
          await fetch(`http://localhost:8080/api/v1/proyectos/${pCreado.id}/tecnologias/${techId}`, { method: 'POST' });
        }
        showMensaje('¡Proyecto publicado!');
        setProyData({ titulo: '', descripcion: '', urlDemo: '', urlRepo: '' });
        setTecnologiasSeleccionadas([]);
      }
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      showMensaje('Error al guardar proyecto.');
    }
  };

  const handleDeleteProyecto = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este proyecto permanentemente?")) return;
    
    try {
      await api.deleteProyecto(id);
      showMensaje('Proyecto eliminado.');
      // Actualizamos la lista local para que desaparezca de inmediato sin recargar la página
      setProyectosList(proyectosList.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      showMensaje('Error al eliminar.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Destruye la llave VIP
    window.location.href = '/login';  // Te expulsa al login
  };

  // Clases CSS reutilizables para los inputs
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Centro de Mando (CMS)</h1>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>

        {/* NAVEGACIÓN DE PESTAÑAS */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-6 border border-gray-100">
          {['perfil', 'experiencia', 'estudios', 'proyectos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg capitalize transition-colors ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* NOTIFICACIÓN FLOTANTE */}
        {mensaje && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200 flex items-center gap-3 text-sm font-medium animate-pulse">
            {mensaje}
          </div>
        )}

        {/* CONTENEDOR DE FORMULARIOS */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          
          {/* TAB: PERFIL */}
          {activeTab === 'perfil' && (
            <form onSubmit={handleSavePerfil} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Datos del Perfil</h2>
              
              {/* INTERRUPTOR ON/OFF (TOGGLE) */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">Disponibilidad Inmediata</h3>
                  <p className="text-sm text-gray-500">Muestra un badge indicando que estás abierto a nuevas ofertas.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={perfilData.disponibilidad} onChange={(e) => setPerfilData({...perfilData, disponibilidad: e.target.checked})} />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div>
                <label className={labelClass}>Resumen / Sobre Mí (Aparecerá en el inicio y en el PDF)</label>
                <textarea required rows={5} className={inputClass} value={perfilData.resumen} onChange={(e) => setPerfilData({...perfilData, resumen: e.target.value})} placeholder="Desarrollador Full Stack apasionado por..." />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Guardar Perfil</button>
            </form>
          )}

          {/* TAB: EXPERIENCIA */}
          {activeTab === 'experiencia' && (
            <form onSubmit={handleSaveExperiencia} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Añadir Experiencia Laboral</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Empresa</label><input required type="text" className={inputClass} value={expData.empresa} onChange={(e) => setExpData({...expData, empresa: e.target.value})} /></div>
                <div><label className={labelClass}>Cargo</label><input required type="text" className={inputClass} value={expData.cargo} onChange={(e) => setExpData({...expData, cargo: e.target.value})} /></div>
                <div><label className={labelClass}>Fecha Inicio (YYYY-MM-DD)</label><input required type="date" className={inputClass} value={expData.fechaInicio} onChange={(e) => setExpData({...expData, fechaInicio: e.target.value})} /></div>
                <div>
                  <label className={labelClass}>Fecha Fin</label>
                  <input type="date" className={inputClass} value={expData.fechaFin} onChange={(e) => setExpData({...expData, fechaFin: e.target.value})} disabled={expData.actual} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="actualExp" checked={expData.actual} onChange={(e) => setExpData({...expData, actual: e.target.checked, fechaFin: ''})} className="w-4 h-4 text-indigo-600" />
                <label htmlFor="actualExp" className="text-sm font-medium text-gray-700">Trabajo aquí actualmente</label>
              </div>
              <div><label className={labelClass}>Descripción / Logros</label><textarea required rows={4} className={inputClass} value={expData.descripcion} onChange={(e) => setExpData({...expData, descripcion: e.target.value})} /></div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Guardar Experiencia</button>
            </form>
          )}

          {/* TAB: ESTUDIOS */}
          {activeTab === 'estudios' && (
            <form onSubmit={handleSaveEstudio} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Añadir Educación</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Institución</label><input required type="text" className={inputClass} value={estData.institucion} onChange={(e) => setEstData({...estData, institucion: e.target.value})} /></div>
                <div><label className={labelClass}>Título</label><input required type="text" className={inputClass} value={estData.titulo} onChange={(e) => setEstData({...estData, titulo: e.target.value})} /></div>
                <div><label className={labelClass}>Fecha Inicio</label><input required type="date" className={inputClass} value={estData.fechaInicio} onChange={(e) => setEstData({...estData, fechaInicio: e.target.value})} /></div>
                <div><label className={labelClass}>Fecha Fin</label><input type="date" className={inputClass} value={estData.fechaFin} onChange={(e) => setEstData({...estData, fechaFin: e.target.value})} disabled={estData.actual} /></div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="actualEst" checked={estData.actual} onChange={(e) => setEstData({...estData, actual: e.target.checked, fechaFin: ''})} className="w-4 h-4 text-indigo-600" />
                <label htmlFor="actualEst" className="text-sm font-medium text-gray-700">Estudio aquí actualmente</label>
              </div>
              <div><label className={labelClass}>Descripción</label><textarea required rows={4} className={inputClass} value={estData.descripcion} onChange={(e) => setEstData({...estData, descripcion: e.target.value})} /></div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Guardar Estudio</button>
            </form>
          )}

          {/* TAB: PROYECTOS */}
          {activeTab === 'proyectos' && (
             <div className="space-y-8">
               
               {/* FORMULARIO DE PROYECTOS COMPLETO */}
               <form onSubmit={handleSaveProyecto} className="space-y-4">
                 <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Añadir Proyecto</h2>
                 <div><label className={labelClass}>Título</label><input required type="text" className={inputClass} value={proyData.titulo} onChange={(e) => setProyData({...proyData, titulo: e.target.value})} /></div>
                 <div><label className={labelClass}>Descripción</label><textarea required rows={3} className={inputClass} value={proyData.descripcion} onChange={(e) => setProyData({...proyData, descripcion: e.target.value})} /></div>
                 <div className="grid grid-cols-2 gap-4">
                   <div><label className={labelClass}>URL Demo</label><input type="url" className={inputClass} value={proyData.urlDemo} onChange={(e) => setProyData({...proyData, urlDemo: e.target.value})} /></div>
                   <div><label className={labelClass}>URL Repo</label><input type="url" className={inputClass} value={proyData.urlRepo} onChange={(e) => setProyData({...proyData, urlRepo: e.target.value})} /></div>
                 </div>
                 
                 {/* Selector de Tecnologías (Esto resuelve el error de variables sin usar) */}
                 <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tecnologías utilizadas</label>
                    <div className="flex flex-wrap gap-2">
                      {tecnologiasDisponibles.map(tech => (
                        <button key={tech.id} type="button" onClick={() => toggleTecnologia(tech.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${tecnologiasSeleccionadas.includes(tech.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-600'}`}>
                          {tech.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                 <button type="submit" className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Guardar Proyecto</button>
               </form>

               {/* LISTA Y BOTÓN ELIMINAR */}
               <div className="border-t border-gray-200 pt-8 mt-8">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Gestionar Proyectos Publicados</h3>
                 <ul className="divide-y divide-gray-100 bg-gray-50 rounded-xl border border-gray-200">
                   {proyectosList.map(p => (
                     <li key={p.id} className="p-4 flex justify-between items-center hover:bg-gray-100 transition-colors">
                       <div>
                         <span className="font-semibold text-gray-800 block">{p.titulo}</span>
                         <span className="text-xs text-gray-500">{p.tecnologias.length} tecnologías vinculadas</span>
                       </div>
                       <button 
                         onClick={() => handleDeleteProyecto(p.id)} 
                         className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         Eliminar
                       </button>
                     </li>
                   ))}
                   {proyectosList.length === 0 && <li className="p-4 text-center text-gray-500 text-sm">No hay proyectos publicados aún.</li>}
                 </ul>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}