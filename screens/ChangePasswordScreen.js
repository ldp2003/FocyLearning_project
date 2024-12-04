import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUser } from "../contexts/UserContext";

export default function ChangePasswordScreen({ navigation }) {
  const { user, updatePassword } = useUser(); 
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
    return;
  }

  if (newPassword !== confirmPassword) {
    Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp.");
    return;
  }

  if (currentPassword !== user.password) { 
    Alert.alert("Lỗi", "Mật khẩu cũ không chính xác.");
    return;
  }

  try {
    const updatedUser = await updatePassword(user.id, newPassword); 
    Alert.alert("Thành công", "Đổi mật khẩu thành công!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  } catch (error) {
    Alert.alert("Lỗi", error.message || "Đổi mật khẩu không thành công. Vui lòng thử lại.");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu cũ"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f4fa",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#0597D8",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#0597D8",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});