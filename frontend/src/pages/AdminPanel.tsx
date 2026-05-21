import { useState, useEffect } from 'react';
import type { Tecnologia, Proyecto } from '../types'; 
import { api } from '../services/api'; 

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [mensaje, setMensaje] = useState('');

  // Estados de Formularios
  const [perfilData, setPerfilData] = useState({ resumen: '', disponibilidad: false });
  const [expData, setExpData] = useState({ empresa: '', cargo: '', fechaInicio: '', fechaFin: '', descripcion: '', actual: false });
  const [estData, setEstData] = useState({ institucion: '', titulo: '', fechaInicio: '', fechaFin: '', descripcion: '', actual: false });
  const [proyData, setProyData] = useState({ titulo: '', descripcion: '', urlDemo: '', urlRepo: '' });
  const [techData, setTechData] = useState({ nombre: '', categoria: 'Frontend' });

  // Estados de Listas/Catálogos
  const [proyectosList, setProyectosList] = useState<Proyecto[]>([]);
  const [catalogoTecnologias, setCatalogoTecnologias] = useState<Tecnologia[]>([]);
  const [tecnologiasSeleccionadas, setTecnologiasSeleccionadas] = useState<number[]>([]);

  useEffect(() => {
    // 1. Verificación de Seguridad
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return; 
    }

    // 2. Cargar datos iniciales
    api.getProyectos().then(data => setProyectosList(data)).catch(console.error);
    
    // Cargar Catálogo de Tecnologías
    fetch('https://portfolio-fullstack-x1xm.onrender.com/api/v1/tecnologias')
      .then(res => res.json())
      .then(data => setCatalogoTecnologias(data))
      .catch(console.error);
  }, []);

  const showMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 4000); 
  };

  const handleCheckboxChange = (id: number) => {
    setTecnologiasSeleccionadas(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // --- HANDLERS ---
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleSavePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://portfolio-fullstack-x1xm.onrender.com/api/v1/perfil', {
        method: 'POST',
        headers: getAuthHeaders(), // <-- ¡Aquí está la magia!
        body: JSON.stringify(perfilData),
      });
      if (response.ok) showMensaje('¡Perfil actualizado con éxito!');
      else showMensaje('Error de autorización al guardar.');
    } catch (error) {
      console.error(error);
      showMensaje('Error al guardar el perfil.');
    }
  };

  const handleSaveExperiencia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://portfolio-fullstack-x1xm.onrender.com/api/v1/experiencias', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(expData),
      });
      if (response.ok) {
        showMensaje('¡Experiencia guardada!');
        setExpData({ empresa: '', cargo: '', fechaInicio: '', fechaFin: '', descripcion: '', actual: false });
      }
    } catch (error) {
      console.error(error);
      showMensaje('Error al guardar la experiencia.');
    }
  };

  const handleSaveEstudio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://portfolio-fullstack-x1xm.onrender.com/api/v1/estudios', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(estData),
      });
      if (response.ok) {
        showMensaje('¡Estudio guardado!');
        setEstData({ institucion: '', titulo: '', fechaInicio: '', fechaFin: '', descripcion: '', actual: false });
      }
    } catch (error) {
      console.error(error);
      showMensaje('Error al guardar el estudio.');
    }
  };

  const handleSaveTecnologia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://portfolio-fullstack-x1xm.onrender.com/api/v1/tecnologias', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(techData)
      });
      if (response.ok) {
        const nuevaTech = await response.json();
        setCatalogoTecnologias([...catalogoTecnologias, nuevaTech]);
        setTechData({ nombre: '', categoria: 'Frontend' });
        showMensaje("¡Tecnología añadida con éxito!");
      }
    } catch (error) {
      console.error("Error guardando tecnología:", error);
    }
  };

  const handleSaveProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
    const payloadProyecto = {
      ...proyData,
      activo: true,
      fechaCreacion: new Date().toISOString().split('T')[0],
      tecnologias: tecnologiasSeleccionadas.map(id => ({ id })) 
    };

    try {
      const response = await fetch('https://portfolio-fullstack-x1xm.onrender.com/api/v1/proyectos', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payloadProyecto),
      });
      if (response.ok) {
        showMensaje('¡Proyecto publicado!');
        setProyData({ titulo: '', descripcion: '', urlDemo: '', urlRepo: '' });
        setTecnologiasSeleccionadas([]);
      }
    } catch (error) {
      console.error(error);
      showMensaje('Error al guardar proyecto.');
    }
  };

  const handleDeleteProyecto = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este proyecto permanentemente?")) return;
    try {
      await fetch(`https://portfolio-fullstack-x1xm.onrender.com/api/v1/proyectos/${id}`, { 
          method: 'DELETE',
          headers: getAuthHeaders() // <-- También necesario para eliminar
      });
      showMensaje('Proyecto eliminado.');
      setProyectosList(proyectosList.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      showMensaje('Error al eliminar.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login';  
  };

  // Clases CSS
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Centro de Mando (CMS)</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 shadow-sm">
            Cerrar Sesión
          </button>
        </div>

        {/* NAVEGACIÓN DE PESTAÑAS (Agregada la pestaña de Tecnologías) */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-6 border border-gray-100 overflow-x-auto">
          {['perfil', 'experiencia', 'estudios', 'tecnologias', 'proyectos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[100px] py-2.5 text-sm font-medium rounded-lg capitalize transition-colors ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {mensaje && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200 flex items-center gap-3 text-sm font-medium animate-pulse">
            {mensaje}
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          
          {/* TAB: PERFIL */}
          {activeTab === 'perfil' && ( /* ... Tu código del perfil ... */
            <form onSubmit={handleSavePerfil} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Datos del Perfil</h2>
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
                <label className={labelClass}>Resumen / Sobre Mí</label>
                <textarea required rows={5} className={inputClass} value={perfilData.resumen} onChange={(e) => setPerfilData({...perfilData, resumen: e.target.value})} placeholder="Desarrollador Full Stack apasionado por..." />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Guardar Perfil</button>
            </form>
          )}

          {/* TAB: EXPERIENCIA */}
          {activeTab === 'experiencia' && ( /* ... Tu código de experiencia ... */
            <form onSubmit={handleSaveExperiencia} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Añadir Experiencia Laboral</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Empresa</label><input required type="text" className={inputClass} value={expData.empresa} onChange={(e) => setExpData({...expData, empresa: e.target.value})} /></div>
                <div><label className={labelClass}>Cargo</label><input required type="text" className={inputClass} value={expData.cargo} onChange={(e) => setExpData({...expData, cargo: e.target.value})} /></div>
                <div><label className={labelClass}>Fecha Inicio</label><input required type="date" className={inputClass} value={expData.fechaInicio} onChange={(e) => setExpData({...expData, fechaInicio: e.target.value})} /></div>
                <div><label className={labelClass}>Fecha Fin</label><input type="date" className={inputClass} value={expData.fechaFin} onChange={(e) => setExpData({...expData, fechaFin: e.target.value})} disabled={expData.actual} /></div>
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
          {activeTab === 'estudios' && ( /* ... Tu código de estudios ... */
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

          {/* TAB: TECNOLOGÍAS */}
          {activeTab === 'tecnologias' && (
            <div className="space-y-8">
              <form onSubmit={handleSaveTecnologia} className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Añadir Tecnología al Catálogo</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nombre de la Tecnología</label>
                    <input required type="text" className={inputClass} placeholder="Ej: React, Spring Boot..." value={techData.nombre} onChange={(e) => setTechData({...techData, nombre: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>Categoría</label>
                    <select className={inputClass} value={techData.categoria} onChange={(e) => setTechData({...techData, categoria: e.target.value})}>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Base de Datos">Base de Datos</option>
                      <option value="DevOps">DevOps / Cloud</option>
                      <option value="Herramientas">Herramientas / CMS</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Guardar Tecnología</button>
              </form>

              <div className="mt-8">
                <h3 className="font-bold text-gray-700 mb-4">Tecnologías en Base de Datos:</h3>
                <div className="flex flex-wrap gap-2">
                  {catalogoTecnologias.map(tech => (
                    <span key={tech.id} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{tech.nombre}</span>
                  ))}
                  {catalogoTecnologias.length === 0 && <span className="text-gray-500 text-sm">Aún no has creado tecnologías.</span>}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROYECTOS */}
          {activeTab === 'proyectos' && (
             <div className="space-y-8">
               <form onSubmit={handleSaveProyecto} className="space-y-4">
                 <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Añadir Proyecto</h2>
                 <div><label className={labelClass}>Título</label><input required type="text" className={inputClass} value={proyData.titulo} onChange={(e) => setProyData({...proyData, titulo: e.target.value})} /></div>
                 <div><label className={labelClass}>Descripción</label><textarea required rows={3} className={inputClass} value={proyData.descripcion} onChange={(e) => setProyData({...proyData, descripcion: e.target.value})} /></div>
                 <div className="grid grid-cols-2 gap-4">
                   <div><label className={labelClass}>URL Demo</label><input type="url" className={inputClass} value={proyData.urlDemo} onChange={(e) => setProyData({...proyData, urlDemo: e.target.value})} /></div>
                   <div><label className={labelClass}>URL Repo</label><input type="url" className={inputClass} value={proyData.urlRepo} onChange={(e) => setProyData({...proyData, urlRepo: e.target.value})} /></div>
                 </div>
                 
                 {/* CHECKBOXES DE TECNOLOGÍAS */}
                 <div className="col-span-2 mt-4">
                   <label className="block text-sm font-medium text-gray-700 mb-2">Tecnologías Utilizadas (Selecciona las que apliquen)</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                     {catalogoTecnologias.map((tech) => (
                       <label key={tech.id} className="flex items-center space-x-2 cursor-pointer">
                         <input
                           type="checkbox"
                           value={tech.id}
                           checked={tecnologiasSeleccionadas.includes(tech.id!)}
                           onChange={() => handleCheckboxChange(tech.id!)}
                           className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                         />
                         <span className="text-sm text-gray-700">{tech.nombre}</span>
                       </label>
                     ))}
                     {catalogoTecnologias.length === 0 && <span className="text-xs text-red-500 col-span-4">Primero debes crear tecnologías en la pestaña anterior.</span>}
                   </div>
                 </div>
                 <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Publicar Proyecto</button>
               </form>

               {/* GESTIÓN DE PROYECTOS PUBLICADOS */}
               <div className="border-t border-gray-200 pt-8 mt-8">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Gestionar Proyectos Publicados</h3>
                 <ul className="divide-y divide-gray-100 bg-gray-50 rounded-xl border border-gray-200">
                   {proyectosList.map(p => (
                     <li key={p.id} className="p-4 flex justify-between items-center hover:bg-gray-100 transition-colors">
                       <div>
                         <span className="font-semibold text-gray-800 block">{p.titulo}</span>
                       </div>
                       <button 
                         onClick={() => p.id && handleDeleteProyecto(p.id)} 
                         className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                       >
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