import React, { createContext, useState, useContext } from 'react';

// Tạo context để quản lý trạng thái người dùng
const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext); // Hook để dễ dàng truy cập vào user
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Trạng thái người dùng

  const login = (userData) => {
    setUser(userData); // Cập nhật thông tin người dùng khi đăng nhập
  };

  const logout = () => {
    setUser(null); // Xóa thông tin người dùng khỏi trạng thái
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
