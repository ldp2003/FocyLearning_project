// LoginScreen.js
import React,{ useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Button from '../components/button';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        placeholderTextColor='#78C2E3'
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor='#78C2E3'
        secureTextEntry
      />
      <Button title="Bắt đầu thôi!" onPress={() => {navigation.navigate('Main')}} />
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
    justifyContent:'center',
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
});

export default LoginScreen;
