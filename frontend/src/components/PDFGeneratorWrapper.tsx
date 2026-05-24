// src/components/PDFGeneratorWrapper.tsx
import { PDFDownloadLink } from '@react-pdf/renderer';
import CVDocument from './CVDocument';
import type { Proyecto, Estudio, Experiencia } from '../types';

interface PDFWrapperProps {
  proyectos: Proyecto[];
  estudios: Estudio[];
  experiencias: Experiencia[];
}

export default function PDFGeneratorWrapper({ proyectos, estudios, experiencias }: PDFWrapperProps) {
  return (
    <PDFDownloadLink
      document={<CVDocument proyectos={proyectos} estudios={estudios} experiencias={experiencias} />}
      fileName="CV_Felipe_Penaloza_FullStack.pdf"
      style={{ width: '220px', height: '46px' }}
      className="inline-flex items-center justify-center rounded-lg font-bold border-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm transition-transform hover:scale-105 text-sm"
    >
      {({ loading }) => 
        loading ? (
          <span className="animate-pulse">Generando PDF...</span>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Descargar CV ATS
          </>
        )
      }
    </PDFDownloadLink>
  );
}