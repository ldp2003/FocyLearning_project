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

  const updatePassword = async (userId, newPassword) => {
  try {
    const response = await fetch(`https://6705f762031fd46a8311820f.mockapi.io/user/${userId}`, {
      method: "PUT", // Hoặc PATCH
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
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
