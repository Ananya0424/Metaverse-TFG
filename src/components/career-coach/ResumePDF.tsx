import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData } from '../../types/resume';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111111',
  },
  contact: {
    fontSize: 10,
    color: '#444444',
    marginBottom: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222222',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 4,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 10,
    color: '#666666',
  },
  role: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillText: {
    fontSize: 10,
    color: '#333333',
  }
});

export function ResumePDF({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName || 'Your Name'}</Text>
          <Text style={styles.contact}>
            {[
              data.personalInfo.email,
              data.personalInfo.phone,
              data.personalInfo.address
            ].filter(Boolean).join(' | ')}
          </Text>
          <Text style={styles.contact}>
            {[
              data.personalInfo.linkedIn,
              data.personalInfo.github,
              data.personalInfo.portfolio
            ].filter(Boolean).join(' | ')}
          </Text>
        </View>

        {/* Summary */}
        {data.professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{data.professionalSummary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.company}>{exp.company}</Text>
                  <Text style={styles.date}>{exp.startDate} - {exp.endDate}</Text>
                </View>
                <Text style={styles.role}>{exp.role}</Text>
                <Text style={styles.text}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.company}>{edu.institution}</Text>
                  <Text style={styles.date}>{edu.year}</Text>
                </View>
                <Text style={styles.text}>{edu.degree}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((proj, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.company}>{proj.title}</Text>
                </View>
                {proj.link && <Text style={styles.contact}>{proj.link}</Text>}
                <Text style={styles.text}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsGrid}>
              <Text style={styles.skillText}>{data.skills.join(', ')}</Text>
            </View>
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <Text style={styles.text}>{data.certifications.join(', ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
