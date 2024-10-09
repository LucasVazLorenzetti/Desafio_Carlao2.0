import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useDatabase } from './database/useDatabase';

export default function Profile() {
  const { registerDoctor, fetchAllDoctors, updateDoctor, deleteDoctor } = useDatabase();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    specialty: '',
    location: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const fetchedDoctors = await fetchAllDoctors();
    setDoctors(fetchedDoctors);
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegisterDoctor = async () => {
    const { name, specialty, location, email, phone } = form;
    if (!name || !specialty || !location) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    try {
      await registerDoctor(name, specialty, location, email, phone);
      Alert.alert('Sucesso', 'Médico registrado com sucesso.');
      setForm({ name: '', specialty: '', location: '', email: '', phone: '' });
      loadDoctors();
    } catch (error) {
      // O erro já é tratado no hook
    }
  };

  const handleDeleteDoctor = async (id) => {
    Alert.alert(
      'Confirmar Deleção',
      'Você tem certeza que deseja deletar este médico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Deletar', style: 'destructive', onPress: async () => {
            await deleteDoctor(id);
            Alert.alert('Sucesso', 'Médico deletado com sucesso.');
            loadDoctors();
          } 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        {/* Cadastro de Médicos */}
        <View style={styles.doctorRegistrationSection}>
          <Text style={styles.sectionTitle}>Cadastrar Novo Médico</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nome do Médico"
            value={form.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Especialidade"
            value={form.specialty}
            onChangeText={(text) => handleInputChange('specialty', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Localização"
            value={form.location}
            onChangeText={(text) => handleInputChange('location', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={form.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            keyboardType="phone-pad"
          />
          
          <TouchableOpacity style={styles.button} onPress={handleRegisterDoctor}>
            <Text style={styles.buttonText}>Cadastrar Médico</Text>
          </TouchableOpacity>
        </View>

        {/* Listagem de Médicos */}
        <View style={styles.doctorListSection}>
          <Text style={styles.sectionTitle}>Médicos Cadastrados</Text>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                <Text style={styles.doctorLocation}>{doctor.location}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteDoctor(doctor.id)}>
                  <Text style={styles.deleteButtonText}>Deletar</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noDoctorsText}>Nenhum médico cadastrado.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
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
  doctorRegistrationSection: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doctorListSection: {
    width: '100%',
    marginBottom: 30,
  },
  doctorCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  doctorLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDoctorsText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});