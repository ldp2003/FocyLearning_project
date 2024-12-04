import React, { createContext, useState, useContext } from 'react';


const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext); 
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData); 
  };

  const logout = () => {
    setUser(null); 
  };

   
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData); 
  };
  


  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
