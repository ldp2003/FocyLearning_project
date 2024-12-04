import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import Button from '../components/button';
import { useUser } from '../contexts/UserContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();

  const validateLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage('Vui lòng nhập email và mật khẩu.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://6705f762031fd46a8311820f.mockapi.io/user');
      if (response.ok) {
        const users = await response.json();
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
          login(user);
          navigation.navigate('Main');
        } else {
          setErrorMessage('Email hoặc mật khẩu không chính xác.');
        }
      } else {
        setErrorMessage('Không thể kết nối tới server.');
      }
    } catch (error) {
      setErrorMessage('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Đăng nhập</Text>
      <Image source={require('../assets/fox-logo.png')} style={styles.avatar} />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#78C2E3"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#78C2E3"
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang đăng nhập...</Text>
          <ActivityIndicator size="large" color="#0597D8" />
        </View>
      ) : (
        <Button title="Bắt đầu thôi!" onPress={validateLogin} />
      )}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Tôi quên mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e0f7fa',
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
  },
  backText: {
    fontSize: 35,
    color: '#78C2E3',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0597D8',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0597D8',
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#0597D8',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#0597D8',
    marginBottom: 10,
  },
});

export default LoginScreen;
