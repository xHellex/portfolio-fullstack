import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Proyecto, Estudio, Experiencia } from '../types';

// Definimos los estilos para el PDF imprimible (Tamaño Carta/A4)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#333333',
    lineHeight: 1.5,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
    paddingBottom: 15,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111111',
  },
  subtitle: {
    fontSize: 13,
    color: '#4f46e5',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 11,
    color: '#111111',
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 10,
    color: '#6b7280',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#4f46e5',
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    color: '#4.b5563',
    textAlign: 'justify',
  },
  techBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  techBadge: {
    fontSize: 9,
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  }
});

interface CVProps {
  proyectos: Proyecto[];
  estudios: Estudio[];
  experiencias: Experiencia[];
}

export default function CVDocument({ proyectos, estudios, experiencias }: CVProps) {
  return (
    <Document title="CV_Felipe_Penaloza.pdf">
      <Page size="LETTER" style={styles.page}>
        
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <Text style={styles.name}>Felipe Andrés Peñaloza Oyarzún</Text>
          <Text style={styles.subtitle}>Desarrollador Full Stack | Analista Computacional</Text>
        </View>

        {/* SECCIÓN: EXPERIENCIA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
          {experiencias.map((exp) => (
            <View key={exp.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.cargo}</Text>
                <Text style={styles.itemDate}>
                  {exp.fechaInicio} — {exp.actual ? 'Presente' : exp.fechaFin}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>{exp.empresa}</Text>
              <Text style={styles.description}>{exp.descripcion}</Text>
            </View>
          ))}
        </View>

        {/* SECCIÓN: ESTUDIOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educación y Formación</Text>
          {estudios.map((est) => (
            <View key={est.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{est.titulo}</Text>
                <Text style={styles.itemDate}>
                  {est.fechaInicio} — {est.actual ? 'Presente' : est.fechaFin}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>{est.institucion}</Text>
              <Text style={styles.description}>{est.descripcion}</Text>
            </View>
          ))}
        </View>

        {/* SECCIÓN: PROYECTOS DESTACADOS (Traídos de la BBDD) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proyectos Destacados</Text>
          {proyectos.filter(p => p.activo).map((proj) => (
            <View key={proj.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{proj.titulo}</Text>
              </View>
              <Text style={styles.description}>{proj.descripcion}</Text>
              <View style={styles.techBadgeContainer}>
                {proj.tecnologias.map(t => (
                  <Text key={t.id} style={styles.techBadge}>{t.nombre}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

      </Page>
    </Document>
  );
}