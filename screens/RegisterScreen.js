import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useUser } from '../contexts/UserContext'; // Import Context để lưu thông tin người dùng

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { login } = useUser(); // Hàm login từ Context

  const handleRegister = async () => {
    // Reset lỗi cũ
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    let formIsValid = true;

    // Kiểm tra hợp lệ
    if (!name) {
      formIsValid = false;
      setErrors((prevErrors) => ({ ...prevErrors, name: 'Vui lòng nhập tên của bạn!' }));
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      formIsValid = false;
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Vui lòng nhập email hợp lệ!' }));
    }

    if (password.length < 6) {
      formIsValid = false;
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Mật khẩu phải có ít nhất 6 ký tự!' }));
    }

    if (password !== confirmPassword) {
      formIsValid = false;
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: 'Mật khẩu xác nhận không khớp!' }));
    }

    if (!formIsValid) {
      return;
    }

    // Gửi dữ liệu tới MockAPI
    try {
      const response = await fetch('https://6705f762031fd46a8311820f.mockapi.io/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();
      console.log('Kết quả:', result);

      if (response.ok) {
        Alert.alert('Thành công', 'Đăng ký thành công!');
        login(result); // Lưu thông tin vào Context
        navigation.navigate('Main'); // Chuyển tới màn hình chính
      } else {
        Alert.alert('Lỗi', 'Không thể đăng ký. Thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      Alert.alert('Lỗi', 'Không thể kết nối tới server.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Đăng ký</Text>
      <Image source={require('../assets/fox-logo.png')} style={styles.logo} />

      <TextInput
        placeholder="Tên của bạn"
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholderTextColor='#78C2E3'
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor='#78C2E3'
        keyboardType="email-address"
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor='#78C2E3'
        secureTextEntry
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <TextInput
        placeholder="Xác nhận mật khẩu"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor='#78C2E3'
        secureTextEntry
      />
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Đăng ký thôi!</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Tôi đã có tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0597D8',
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
  registerButton: {
    backgroundColor: '#0597D8',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#0597D8',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default RegisterScreen;
