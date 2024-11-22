import React from 'react';
import { UserProvider } from './contexts/UserContext';
import AppNavigator from './navigations/AppNavigator'; 

const App = () => {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
};

export default App;
