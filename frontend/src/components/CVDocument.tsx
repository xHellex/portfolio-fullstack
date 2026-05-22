import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Proyecto, Estudio, Experiencia } from '../types';

// Estilos estrictamente ATS: Limpios, de una columna, alto contraste y tipografía estándar.
const styles = StyleSheet.create({
  page: {
    padding: '40px 50px',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111827', 
    lineHeight: 1.5,
  },
  headerContainer: {
    marginBottom: 20,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    color: '#000000',
    lineHeight: 1.2, 
    marginBottom: 8, 
  },
  subtitle: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 4, 
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#000000',
    borderBottomWidth: 1.5,
    borderBottomColor: '#111827',
    paddingBottom: 3,
    marginTop: 15,
    marginBottom: 10,
  },
  entry: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  entryTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
    color: '#000000',
  },
  entryDate: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: '#4b5563',
  },
  entryCompany: {
    fontSize: 10,
    color: '#3b82f6',
    marginBottom: 4,
  },
  entryDesc: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'justify',
  },
  // Estilos para la tabla de habilidades ATS
  skillsContainer: {
    marginTop: 5,
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  skillCategory: {
    fontFamily: 'Helvetica-Bold',
    width: '25%',
    fontSize: 10,
    color: '#111827',
  },
  skillText: {
    width: '75%',
    fontSize: 10,
    color: '#374151',
  }
});

interface CVProps {
  proyectos: Proyecto[];
  estudios: Estudio[];
  experiencias: Experiencia[];
}

// Función interna para que el PDF también tenga fechas bonitas (Mes Año)
const formatearFechaPDF = (fechaCruda: string | undefined | null) => {
  if (!fechaCruda) return "Presente";
  const fecha = new Date(`${fechaCruda}T00:00:00`);
  const opciones: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
  const str = fecha.toLocaleDateString('es-ES', opciones);
  return str.charAt(0).toUpperCase() + str.slice(1).replace('.', '');
};

export default function CVDocument({ proyectos, estudios, experiencias }: CVProps) {
  return (
    <Document title="CV_Felipe_Penaloza_FullStack.pdf">
      <Page size="A4" style={styles.page}>
        
        {/* ENCABEZADO */}
        <View style={styles.headerContainer}>
          <Text style={styles.name}>Felipe Andrés Peñaloza Oyarzún</Text>
          <Text style={styles.subtitle}>Desarrollador Full Stack | Analista Computacional</Text>
        </View>

        {/* EXPERIENCIA LABORAL */}
        <View>
          <Text style={styles.sectionTitle}>EXPERIENCIA LABORAL</Text>
          {experiencias.map((exp) => (
            <View key={exp.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{exp.cargo}</Text>
                <Text style={styles.entryDate}>
                  {formatearFechaPDF(exp.fechaInicio)} — {exp.actual ? 'Presente' : formatearFechaPDF(exp.fechaFin)}
                </Text>
              </View>
              <Text style={styles.entryCompany}>{exp.empresa}</Text>
              <Text style={styles.entryDesc}>{exp.descripcion}</Text>
            </View>
          ))}
        </View>

        {/* EDUCACIÓN Y FORMACIÓN */}
        <View wrap={false}>
          <Text style={styles.sectionTitle}>EDUCACIÓN Y FORMACIÓN</Text>
          {estudios.map((est) => (
            <View key={est.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{est.titulo}</Text>
                <Text style={styles.entryDate}>
                  {formatearFechaPDF(est.fechaInicio)} — {est.actual ? 'Presente' : formatearFechaPDF(est.fechaFin)}
                </Text>
              </View>
              <Text style={styles.entryCompany}>{est.institucion}</Text>
              <Text style={styles.entryDesc}>{est.descripcion}</Text>
            </View>
          ))}
        </View>

        {/* PROYECTOS DESTACADOS */}
        {proyectos.filter(p => p.activo).length > 0 && (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>PROYECTOS DESTACADOS</Text>
            {proyectos.filter(p => p.activo).map((proj) => (
              <View key={proj.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{proj.titulo}</Text>
                </View>
                {/* Mostramos las tecnologías concatenadas si existen */}
                {proj.tecnologias && proj.tecnologias.length > 0 && (
                  <Text style={styles.entryCompany}>
                    Tecnologías: {proj.tecnologias.map(t => t.nombre).join(', ')}
                  </Text>
                )}
                <Text style={styles.entryDesc}>{proj.descripcion}</Text>
              </View>
            ))}
          </View>
        )}

        {/* HABILIDADES TÉCNICAS (Tabla Estática ATS) */}
        <View wrap={false}>
          <Text style={styles.sectionTitle}>HABILIDADES TÉCNICAS</Text>
          <View style={styles.skillsContainer}>
            <View style={styles.skillRow}>
              <Text style={styles.skillCategory}>Frontend:</Text>
              <Text style={styles.skillText}>React JS, JavaScript (ES6+), Astro, HTML5, CSS3/SASS, Tailwind, Bootstrap.</Text>
            </View>
            <View style={styles.skillRow}>
              <Text style={styles.skillCategory}>Backend & BD:</Text>
              <Text style={styles.skillText}>Java, Spring Boot, Spring Security, PostgreSQL, Oracle (PL/SQL).</Text>
            </View>
            <View style={styles.skillRow}>
              <Text style={styles.skillCategory}>DevOps & Cloud:</Text>
              <Text style={styles.skillText}>Docker, Render, Vercel, Neon.tech, Git/GitHub, CI/CD.</Text>
            </View>
            <View style={styles.skillRow}>
              <Text style={styles.skillCategory}>Herramientas:</Text>
              <Text style={styles.skillText}>Drupal, Liferay, WordPress, AEM, Figma, Scrum.</Text>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
}