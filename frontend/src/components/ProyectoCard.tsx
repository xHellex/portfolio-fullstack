import type { Proyecto } from '../types'

// Definimos qué información necesita recibir este componente para funcionar
interface Props {
  proyecto: Proyecto;
}

export default function ProyectoCard({ proyecto }: Props) {
  return (
    
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden group">
      
      
      <div className="p-6 flex flex-col grow">
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">{proyecto.titulo}</h2>
        
        
        <p className="text-gray-600 mb-6 text-sm leading-relaxed grow dark:text-gray-300">
          {proyecto.descripcion}
        </p>
        
        <div className="tecnologias-container mb-6">
          {proyecto.tecnologias.map(tech => (
            <span 
              key={tech.id} 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-600 dark:text-blue-300"
            >
              {tech.nombre}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {proyecto.urlDemo && (
            <a 
              href={proyecto.urlDemo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
            >
              Ver Demo
            </a>
          )}
          {proyecto.urlRepo && (
            <a 
              href={proyecto.urlRepo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Ver Código
            </a>
          )}
        </div>
      </div>
    </article>
  );
}