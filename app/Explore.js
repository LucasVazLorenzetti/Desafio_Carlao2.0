import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDatabase } from './database/useDatabase';

export default function Explore() {
  const { fetchDoctorsWithFilters, fetchAllDoctors } = useDatabase();
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const fetchedDoctors = await fetchAllDoctors();
    setDoctors(fetchedDoctors);
  };

  const handleSearch = async () => {
    const filters = { specialty, location };
    const fetchedDoctors = await fetchDoctorsWithFilters(filters);
    setDoctors(fetchedDoctors);
  };

  const renderDoctorCard = (doctor) => (
    <View key={doctor.id} style={styles.doctorCard}>
      <Image
        source={require('../assets/images/man-1.png')}
        style={styles.doctorImage}
      />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
        <Text style={styles.doctorLocation}>{doctor.location}</Text>
      </View>
      <TouchableOpacity style={styles.scheduleButton} onPress={() => console.log('Agendar consulta')}>
        <Text style={styles.scheduleButtonText}>Agendar consulta</Text>
      </TouchableOpacity>
    </View>
  );

  const specialties = ['Angiologista', 'Otorrinolaringologista', 'Mastologista', 'Dermatologista'];
  const locations = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Digite a especialidade"
          value={specialty}
          onChangeText={setSpecialty}
        />
        <Picker
          selectedValue={location}
          style={styles.picker}
          onValueChange={(itemValue) => setLocation(itemValue)}
        >
          <Picker.Item label="Selecione a localização" value="" />
          {locations.map((loc) => (
            <Picker.Item key={loc} label={loc} value={loc} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.resultsTitle}>Resultado da busca</Text>
      
      {doctors.length > 0 ? (
        doctors.map((doctor) => renderDoctorCard(doctor))
      ) : (
        <Text style={styles.noResultsText}>Nenhum médico encontrado.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    marginLeft: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  doctorSpecialty: {
    color: '#666',
  },
  doctorLocation: {
    color: '#666',
    fontSize: 12,
  },
  scheduleButton: {
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 5,
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});