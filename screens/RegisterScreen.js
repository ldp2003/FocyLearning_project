import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

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

  const handleRegister = async () => {
  setErrors({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  let formIsValid = true;

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

  if (formIsValid) {
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
          lessons: [
            {
              lessonId: 'lesson1',
              title: 'Từ vựng giao tiếp thông dụng hiện nay',
              progress: 50,
              completedQuestions: [
                {
                  questionId: 'question1',
                  answer: 'Xin chào!',
                  isCorrect: true,
                },
                {
                  questionId: 'question2',
                  answer: 'Tôi là Focy!',
                  isCorrect: true,
                },
              ],
              status: 'completed',
            },
            {
              lessonId: 'lesson2',
              progress: 80,
              completedQuestions: [
                {
                  questionId: 'question3',
                  answer: 'Xin chào bạn!',
                  isCorrect: true,
                },
              ],
              status: 'in-progress',
            },
            {
              lessonId: 'lesson3',
              progress: 0,
              completedQuestions: [],
              status: 'not-started',
            },
          ],
          lastLesson: {
            lessonId: 'lesson2',
            status: 'in-progress',
            title: 'Từ vựng giao tiếp thông dụng hiện nay',
            progress: 80,
            completedQuestions: [
              {
                questionId: 'question3',
                answer: 'Xin chào bạn!',
                isCorrect: true,
              },
            ],
          },
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Đăng ký thành công: ', userData);
        navigation.navigate('Main');
      } else {
        const errorData = await response.json();
        console.error('Lỗi API: ', errorData);
        alert('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu: ', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
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
        placeholder="Tên của cậu"
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
