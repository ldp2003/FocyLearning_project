// StartScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from '../components/button';

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/fox-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Focy Learning</Text>
      <Text style={styles.subtitle}>Học tiếng Anh miễn phí</Text>
      <Button title="Bắt đầu ngay!" onPress={() => navigation.navigate('Survey')} />
      <Button title="Tôi đã có tài khoản" onPress={() => navigation.navigate('Login')} style={styles.secondaryButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2FEFF',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderWidth:1,
    borderRadius:15,
    borderColor: '#0597D8',
    padding:10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0597D8',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#9e9e9e',
    marginBottom: 30,
    fontWeight:'bold'
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderColor: '#0597D8',
    borderWidth: 1,
    color: '#0597D8',
  },
});

export default StartScreen;
