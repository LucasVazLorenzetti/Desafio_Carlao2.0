import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CheckBox } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { useDatabase } from './database/useDatabase';
import { useSQLiteContext } from 'expo-sqlite';

/**
 * Login component handles user authentication and registration.
 */
export default function App() {
  const router = useRouter();
  const { registerUser, loginUser } = useDatabase();
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Registration Form 1 State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  // Registration Form 2 State
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [telefone, setTelefone] = useState('');

  const [isEnderecoDisabled, setIsEnderecoDisabled] = useState(false);
  const [isComplementoDisabled, setIsComplementoDisabled] = useState(false);

  const db = useSQLiteContext();

  /**
   * Handles user login.
   */
  const handleLogin = async () => {
    try {
      const user = await loginUser(username, password);
      if (user) {
        router.push('/');
      } else {
        Alert.alert('Erro', 'Nome de usuário ou senha inválidos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante o login');
      console.error(error);
    }
  };

  /**
   * Handles user registration.
   */
  const handleRegister = async () => {
    if (password !== repeatPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    if (!selectedPlan) {
      Alert.alert('Erro', 'Selecione um plano de saúde');
      return;
    }
    try {
      Alert.alert(
        'Dados de Registro',
        `Usuário: ${username}\nSenha: ${password}\nNome: ${name}\nEmail: ${email}\nEndereço: ${endereco}\nNúmero: ${numero}\nComplemento: ${complemento}\nCEP: ${cep}\nTelefone: ${telefone}\nPlano: ${selectedPlan}`
      );

      // Using a transaction to ensure all operations succeed or fail together
      await db.withTransactionAsync(async () => {
        await registerUser(username, password, name, email, endereco, numero, complemento, cep, telefone, selectedPlan);
      });

      Alert.alert('Sucesso', 'Usuário registrado com sucesso');
      setCurrentPage('login');
    } catch (error) {
      Alert.alert('Erro', 'Falha no registro');
      console.error(error);
    }
  };

  /**
   * Fetches address information based on CEP.
   */
  const fetchCep = async () => {
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) {
      Alert.alert('Erro', 'CEP inválido');
      return;
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado');
        return;
      }
      if (!endereco) {
        setEndereco(data.logradouro || '');
        setIsEnderecoDisabled(true);
      }
      if (!complemento) {
        setComplemento(data.complemento || '');
        setIsComplementoDisabled(true);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar o CEP');
      console.error(error);
    }
  };

  const renderLoginForm = () => (
    <>
      <Text style={styles.title}>Faça login em sua conta</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu usuário"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Ainda não tem conta? </Text>
        <TouchableOpacity onPress={() => setCurrentPage('registration1')}>
          <Text style={styles.signupLink}>Faça seu cadastro!</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderRegistrationForm1 = () => (
    <>
      <Text style={styles.title}>Insira alguns dados básicos:</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          value={name}
          onChangeText={setName}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu endereço de email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Crie uma senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Repita a senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira sua senha"
          secureTextEntry
          value={repeatPassword}
          onChangeText={setRepeatPassword}
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={() => setCurrentPage('registration2')}>
        <Text style={styles.buttonText}>Avançar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setCurrentPage('login')}>
        <Text style={styles.backToLogin}>Voltar para o login</Text>
      </TouchableOpacity>
    </>
  );

  const renderRegistrationForm2 = () => (
    <>
      <Text style={styles.title}>Agora, mais alguns dados sobre você:</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu CEP"
          keyboardType="numeric"
          value={cep}
          onChangeText={setCep}
          onBlur={fetchCep}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu endereço"
          value={endereco}
          onChangeText={setEndereco}
          editable={!isEnderecoDisabled}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu número"
          keyboardType="numeric"
          value={numero}
          onChangeText={setNumero}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Complemento</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu complemento"
          value={complemento}
          onChangeText={setComplemento}
          editable={!isComplementoDisabled}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentPage('registration1')}>
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentPage('healthPlan')}>
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderHealthPlanSelection = () => {
    const plans = ['Sulamerica', 'Unimed', 'Bradesco', 'Amil', 'Biosaúde', 'Biovida', 'Outros', 'Não tenho plano'];

    return (
      <>
        <Text style={styles.title}>Para finalizar, qual seu plano de saúde?</Text>
        
        <View style={styles.checkboxContainer}>
          <Text style={styles.subtitle}>Selecione um plano:</Text>
          {plans.map((plan) => (
            <CheckBox
              key={plan}
              title={plan}
              checked={selectedPlan === plan}
              onPress={() => setSelectedPlan(plan)}
              containerStyle={styles.checkboxContainerItem}
              textStyle={styles.checkboxText}
              checkedColor="#003366"
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentPage('registration2')}>
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Cadastrar!</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Image
          source={require('../assets/images/Logo-WithImage.png')}
          style={styles.logo}
        />
        {currentPage === 'login' && renderLoginForm()}
        {currentPage === 'registration1' && renderRegistrationForm1()}
        {currentPage === 'registration2' && renderRegistrationForm2()}
        {currentPage === 'healthPlan' && renderHealthPlanSelection()}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 5,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 15,
    color: '#003366',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    color: '#003366',
    fontWeight: 'bold',
  },
  backToLogin: {
    marginTop: 15,
    color: '#003366',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  secondaryButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#003366',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginLeft: 0,
    alignItems: 'flex-start',
    width: '100%',
  },
  checkboxContainerItem: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  checkboxText: {
    fontWeight: 'normal',
  },
});