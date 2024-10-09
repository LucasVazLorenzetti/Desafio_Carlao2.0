import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';
/**
 * Custom hook to provide database operations.
 */
export const useDatabase = () => {
  const db = useSQLiteContext();

  /**
   * Registers a new user in the database.
   * @param {string} username
   * @param {string} password
   * @param {string} name
   * @param {string} email
   * @param {string} endereco
   * @param {string} numero
   * @param {string} complemento
   * @param {string} cep
   * @param {string} telefone
   * @param {string} plano
   * @returns {Promise<any>}
   */
  const registerUser = async (
    username,
    password,
    name,
    email,
    endereco,
    numero,
    complemento,
    cep,
    telefone,
    plano
  ) => {
    try {
      const statement = await db.prepareAsync(
        'INSERT INTO users (username, password, name, email, endereco, numero, complemento, cep, telefone, plano) VALUES ($username, $password, $name, $email, $endereco, $numero, $complemento, $cep, $telefone, $plano)'
      );
      try {
        const result = await statement.executeAsync({
          $username: username,
          $password: password,
          $name: name,
          $email: email,
          $endereco: endereco,
          $numero: numero,
          $complemento: complemento,
          $cep: cep,
          $telefone: telefone,
          $plano: plano,
        });
        return result.lastInsertRowId;
      } finally {
        await statement.finalizeAsync();
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar usuário');
      console.error('Error registering user:', error);
      throw error;
    }
  };

  /**
   * Logs in a user by verifying credentials.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object|null>}
   */
  const loginUser = async (username, password) => {
    try {
      const user = await db.getFirstAsync('SELECT * FROM users WHERE username = ? AND password = ?', [
        username,
        password,
      ]);
      if (user) {
        return user;
      } else {
        Alert.alert('Erro', 'Nome de usuário ou senha inválidos');
        return null;
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao logar no usuário');
      console.error('Error logging in user:', error);
      throw error;
    }
  };

  /**
   * Fetches all users (Example CRUD operation).
   * @returns {Promise<Array>}
   */
  const fetchAllUsers = async () => {
    try {
      const users = await db.getAllAsync('SELECT * FROM users');
      return users;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar usuários');
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  /**
   * Updates a user's information.
   * @param {number} id
   * @param {Object} updates
   * @returns {Promise<number>} Changes count
   */
  const updateUser = async (id, updates) => {
    const { username, password, name, email, endereco, numero, complemento, cep, telefone, plano } = updates;
    try {
      const changes = await db.runAsync(
        'UPDATE users SET username = ?, password = ?, name = ?, email = ?, endereco = ?, numero = ?, complemento = ?, cep = ?, telefone = ?, plano = ? WHERE id = ?',
        [
          username,
          password,
          name,
          email,
          endereco,
          numero,
          complemento,
          cep,
          telefone,
          plano,
          id,
        ]
      );
      return changes;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar usuário');
      console.error('Error updating user:', error);
      throw error;
    }
  };

  /**
   * Deletes a user from the database.
   * @param {number} id
   * @returns {Promise<number>} Changes count
   */
  const deleteUser = async (id) => {
    try {
      const changes = await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
      return changes;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao deletar usuário');
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  /**
   * Registers a new doctor in the database.
   * @param {string} name
   * @param {string} specialty
   * @param {string} location
   * @param {string} email
   * @param {string} phone
   * @returns {Promise<any>}
   */
  const registerDoctor = async (name, specialty, location, email, phone) => {
    try {
      const statement = await db.prepareAsync(
        'INSERT INTO doctors (name, specialty, location, email, phone) VALUES ($name, $specialty, $location, $email, $phone)'
      );
      try {
        const result = await statement.executeAsync({
          $name: name,
          $specialty: specialty,
          $location: location,
          $email: email,
          $phone: phone,
        });
        return result.lastInsertRowId;
      } finally {
        await statement.finalizeAsync();
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar médico');
      console.error('Error registering doctor:', error);
      throw error;
    }
  };

  /**
   * Fetches all doctors.
   * @returns {Promise<Array>}
   */
  const fetchAllDoctors = async () => {
    try {
      const doctors = await db.getAllAsync('SELECT * FROM doctors');
      return doctors;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar médicos');
      console.error('Error fetching doctors:', error);
      throw error;
    }
  };

  /**
   * Fetches doctors with filters.
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  const fetchDoctorsWithFilters = async (filters) => {
    const { specialty, location } = filters;
    let query = 'SELECT * FROM doctors WHERE available = 1';
    const params = [];

    if (specialty && specialty !== '') {
      query += ' AND LOWER(specialty) LIKE LOWER(?)';
      params.push(`%${specialty}%`);
    }

    if (location && location !== '') {
      query += ' AND LOWER(location) LIKE LOWER(?)';
      params.push(`%${location}%`);
    }

    try {
      const doctors = await db.getAllAsync(query, params);
      return doctors;
    } catch (error) {
      console.error('Error fetching doctors with filters:', error);
      throw new Error('Erro ao buscar médicos com filtros');
    }
  };

  /**
   * Updates a doctor's information.
   * @param {number} id
   * @param {Object} updates
   * @returns {Promise<number>} Changes count
   */
  const updateDoctor = async (id, updates) => {
    const { name, specialty, location, email, phone, available } = updates;
    try {
      const changes = await db.runAsync(
        'UPDATE doctors SET name = ?, specialty = ?, location = ?, email = ?, phone = ?, available = ? WHERE id = ?',
        [name, specialty, location, email, phone, available ? 1 : 0, id]
      );
      return changes;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar médico');
      console.error('Error updating doctor:', error);
      throw error;
    }
  };

  /**
   * Deletes a doctor from the database.
   * @param {number} id
   * @returns {Promise<number>} Changes count
   */
  const deleteDoctor = async (id) => {
    try {
      const changes = await db.runAsync('DELETE FROM doctors WHERE id = ?', [id]);
      return changes;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao deletar médico');
      console.error('Error deleting doctor:', error);
      throw error;
    }
  };

  /**
   * Registers a new appointment in the database.
   * @param {number} userId
   * @param {number} doctorId
   * @param {string} date
   * @returns {Promise<any>}
   */
  const registerAppointment = async (userId, doctorId, date) => {
    try {
      const statement = await db.prepareAsync(
        'INSERT INTO appointments (user_id, doctor_id, date) VALUES ($userId, $doctorId, $date)'
      );
      try {
        const result = await statement.executeAsync({
          $userId: userId,
          $doctorId: doctorId,
          $date: date,
        });
        return result.lastInsertRowId;
      } finally {
        await statement.finalizeAsync();
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao agendar consulta');
      console.error('Error registering appointment:', error);
      throw error;
    }
  };

  /**
   * Fetches all appointments for a user.
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  const fetchAppointmentsByUser = async (userId) => {
    try {
      const appointments = await db.getAllAsync(`
        SELECT appointments.*, doctors.name as doctorName, doctors.specialty
        FROM appointments
        JOIN doctors ON appointments.doctor_id = doctors.id
        WHERE appointments.user_id = ?
        ORDER BY appointments.date DESC
      `, [userId]);

      // Adiciona a flag isPast com base na data atual
      const currentDate = new Date();
      const formattedCurrentDate = currentDate.toISOString().split('T')[0];

      const processedAppointments = appointments.map(app => ({
        ...app,
        isPast: new Date(app.date) < currentDate,
      }));

      return processedAppointments;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar consultas');
      console.error('Error fetching appointments:', error);
      throw error;
    }
  };

  /**
   * Cancels an appointment.
   * @param {number} appointmentId
   * @returns {Promise<number>} Changes count
   */
  const cancelAppointment = async (appointmentId) => {
    try {
      const changes = await db.runAsync('DELETE FROM appointments WHERE id = ?', [appointmentId]);
      return changes;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cancelar consulta');
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  };

  /**
   * Reschedules an appointment.
   * @param {number} appointmentId
   * @param {string} newDate
   * @returns {Promise<number>} Changes count
   */
  const rescheduleAppointment = async (appointmentId, newDate) => {
    try {
      const changes = await db.runAsync('UPDATE appointments SET date = ? WHERE id = ?', [newDate, appointmentId]);
      return changes;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao reagendar consulta');
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  };

  return {
    registerUser,
    loginUser,
    fetchAllUsers,
    updateUser,
    deleteUser,
    registerDoctor,
    fetchAllDoctors,
    fetchDoctorsWithFilters,
    updateDoctor,
    deleteDoctor,
    registerAppointment,
    fetchAppointmentsByUser,
    cancelAppointment,
    rescheduleAppointment,
  };
};