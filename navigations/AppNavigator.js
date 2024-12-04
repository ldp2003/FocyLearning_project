import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import StartScreen from '../screens/StartScreen';
import LoginScreen from '../screens/LoginScreen';
import SurveyScreen from '../screens/SurveyScreen';
import MainScreen from '../screens/MainScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LessonScreen from '../screens/LessonScreen';
import QuizScreen from '../screens/QuizScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import ResultScreen from '../screens/ResultScreen';
import ListScreen from '../screens/ListScreen';

const Stack = createStackNavigator();


const AppNavigator = () => {
 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Survey" component={SurveyScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="List" component={ListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
