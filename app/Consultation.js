import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useDatabase } from './database/useDatabase';

export default function Consultation() {
  const { fetchAppointmentsByUser } = useDatabase();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    // Substitua `1` pelo ID do usuário logado
    const userAppointments = await fetchAppointmentsByUser(1);
    setAppointments(userAppointments);
  };

  const renderAppointment = ({ item }) => (
    <View style={[styles.appointmentCard, item.isPast && styles.pastCard]}>
      <Text style={styles.appointmentDoctor}>{item.doctorName} - {item.specialty}</Text>
      <Text style={styles.appointmentDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.id)}>
        <Text style={styles.cancelButtonText}>{item.isPast ? 'Agendar nova consulta' : 'Cancelar'}</Text>
      </TouchableOpacity>
    </View>
  );

  const handleCancel = (appointmentId) => {
    // Navegar ou abrir modal para confirmar cancelamento
    Alert.alert(
      'Cancelar Consulta',
      'Deseja realmente cancelar esta consulta?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => {/* Implementar cancelamento */} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meu perfil</Text>
        
        <Image
          source={require('../assets/images/woman-1.png')}
          style={styles.profileImage}
        />
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações pessoais</Text>
          <Text style={styles.name}>Rafaela Camargo</Text>
          <Text style={styles.details}>19/03/1990</Text>
          <Text style={styles.details}>São Paulo-SP</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Histórico médico</Text>
          <View style={styles.medicalList}>
            <Text style={styles.medicalItem}>• Laringite</Text>
            <Text style={styles.medicalItem}>• Faringite</Text>
          </View>
        </View>

        {/* Consultas do Usuário */}
        <View style={styles.appointmentsSection}>
          <Text style={styles.sectionTitle}>Minhas Consultas</Text>
          {appointments.length > 0 ? (
            <FlatList
              data={appointments}
              renderItem={renderAppointment}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <Text style={styles.noAppointmentsText}>Você não tem consultas agendadas.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  infoSection: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  medicalList: {
    marginLeft: 10,
  },
  medicalItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  appointmentsSection: {
    width: '100%',
    marginTop: 20,
  },
  appointmentCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  pastCard: {
    backgroundColor: '#e6f2ff',
  },
  appointmentDoctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noAppointmentsText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});