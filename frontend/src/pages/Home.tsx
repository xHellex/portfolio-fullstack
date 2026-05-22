import { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { Proyecto, Estudio, Experiencia, Perfil } from '../types';
import ProyectoCard from '../components/ProyectoCard';
import CVDocument from '../components/CVDocument';
import { api } from '../services/api'; 
import miFoto from '../assets/me.webp'; // Tu foto

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-[300px] animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 grow"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
  </div>
);

export default function Home() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  // 1. PEGA LA FUNCIÓN AQUÍ (Antes del return)
  const formatearFecha = (fechaCruda: string | undefined | null) => {
    if (!fechaCruda) return "Presente"; 
    const fecha = new Date(`${fechaCruda}T00:00:00`); 
    const opciones: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' }; 
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1).replace('.', '');
  };

  useEffect(() => {
    // 1. Cargar datos
    Promise.all([api.getProyectos(), api.getEstudios(), api.getExperiencias(), api.getPerfil()])
      .then(([p, e, exp, perf]) => { setProyectos(p); setEstudios(e); setExperiencias(exp); setPerfil(perf); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });

    // 2. Animación On-Scroll
    const revealOnScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((reveal) => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) reveal.classList.add('active');
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    setTimeout(revealOnScroll, 500); // Llamada inicial
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  // 3. Modo Oscuro
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Función interna para aplicar el tema y limpiar el contrario
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemPrefersDark);
    } else {
      applyTheme(theme === 'dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="relative min-h-screen overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      {/* FONDO ANIMADO DE BLOBS */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 dark:opacity-30 animate-blob z-0"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 dark:opacity-30 animate-blob animation-delay-2000 z-0"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 dark:opacity-30 animate-blob animation-delay-4000 z-0"></div>

      {/* CONTENIDO PRINCIPAL (El z-10 asegura que el contenido esté sobre los blobs) */}
      <div className="relative z-10 p-8 md:px-16 lg:px-24">
        
        {/* SELECTOR DE TEMA (MODO OSCURO) */}
        <div className="flex justify-end mb-8">
          <div className="inline-flex items-center p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <button onClick={() => setTheme('light')} className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${theme === 'light' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>Claro</button>
            <button onClick={() => setTheme('system')} className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${theme === 'system' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>Auto</button>
            <button onClick={() => setTheme('dark')} className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${theme === 'dark' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>Oscuro</button>
          </div>
        </div>
      
        {/* CABECERA (HERO SECTION) */}
        <header className="reveal mb-24 flex flex-col md:flex-row items-center justify-between gap-12 border-b border-gray-200 dark:border-gray-800 pb-16 max-w-7xl mx-auto">
          <div className="flex-1 space-y-6">
            <div className="flex flex-col items-start gap-4">
              {perfil?.disponibilidad && (
                <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 shadow-sm transition-all duration-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>Disponible para trabajar
                </span>
              )}
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
                Hola, soy <span className="text-indigo-600 dark:text-indigo-400">Felipe Peñaloza</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl whitespace-pre-line">{perfil?.resumen || "Cargando..."}</p>
            
            <div className="flex flex-wrap gap-3 pt-4">
              <a href="https://github.com/xHellex" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm transition-transform hover:scale-105 text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                GitHub
              </a>

              <a href="https://www.linkedin.com/in/felipe-andres-penaloza-oyarzun/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium bg-[#0A66C2] text-white hover:bg-[#084e96] shadow-sm transition-transform hover:scale-105 text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>

              <a href="https://wa.me/56983426103?text=Hola%20Felipe,%20vi%20tu%20portafolio%20y%20me%20gustaría%20contactarte." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium bg-[#25D366] text-white hover:bg-[#1da851] shadow-sm transition-transform hover:scale-105 text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>

              {!loading && (
                <PDFDownloadLink
                  document={<CVDocument proyectos={proyectos} estudios={estudios} experiencias={experiencias} />}
                  fileName="CV_Felipe_Penaloza.pdf"
                  style={{ width: '220px', height: '46px' }} /* FORZADO ABSOLUTO EN REACT */
                  className="inline-flex items-center justify-center rounded-lg font-bold border-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm transition-transform hover:scale-105 text-sm"
                >
                  {({ loading: pdfLoading }) => 
                    pdfLoading ? (
                      <span className="animate-pulse">Actualizando PDF...</span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Descargar CV PDF
                      </>
                    )
                  }
                </PDFDownloadLink>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0 relative group">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
               <img src={miFoto} alt="Felipe Peñaloza" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
            </div>
          </div>
        </header>

        {/* LÍNEA DE TIEMPO (EXPERIENCIA Y EDUCACIÓN) */}
        <section className="reveal max-w-4xl mx-auto mb-32">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-12">Trayectoria & Educación</h2>
          
          <div className="border-l-2 border-indigo-200 dark:border-indigo-800 pl-6 md:pl-10 space-y-16 ml-3 md:ml-0">
            {experiencias.map(exp => (
              <div key={`exp-${exp.id}`} className="relative group">
                <div className="absolute -left-[35px] md:-left-[51px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-gray-900 bg-indigo-600 dark:bg-indigo-400 shadow-sm group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
                  {formatearFecha(exp.fechaInicio)} — {exp.actual ? 'Presente' : formatearFecha(exp.fechaFin)}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{exp.cargo} <span className="text-gray-500 dark:text-gray-400 font-medium text-lg">en {exp.empresa}</span></h3>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{exp.descripcion}</p>
              </div>
            ))}

            {estudios.map(est => (
              <div key={`est-${est.id}`} className="relative group">
                <div className="absolute -left-[35px] md:-left-[51px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-gray-900 bg-blue-500 dark:bg-blue-400 shadow-sm group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
                  {formatearFecha(est.fechaInicio)} — {est.actual ? 'Presente' : formatearFecha(est.fechaFin)}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{est.titulo} <span className="text-gray-500 dark:text-gray-400 font-medium text-lg">en {est.institucion}</span></h3>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{est.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN PROYECTOS */}
        <section className="reveal max-w-7xl mx-auto mb-20">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-12">Proyectos Destacados</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? ( <><SkeletonCard /><SkeletonCard /><SkeletonCard /></> ) : (
              proyectos.filter(p => p.activo).map((proyecto) => (
                <div key={proyecto.id} className="reveal">
                  <ProyectoCard proyecto={proyecto} />
                </div>
              ))
            )}
          </div>
        </section>
        
      </div>
    </div>
  );
}