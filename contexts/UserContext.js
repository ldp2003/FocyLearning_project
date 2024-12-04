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
  
  const updatePassword = async (userId, newPassword) => {
  try {
    const response = await fetch(`https://6705f762031fd46a8311820f.mockapi.io/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể đổi mật khẩu.");
    }

    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, updatePassword }}>
      {children}
    </UserContext.Provider>
  );
};
