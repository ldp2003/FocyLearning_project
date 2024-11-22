import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function SettingScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Image style={styles.backButtonText} source={require('../assets/arrow_back.png')}/>
        </TouchableOpacity>
        <Image
          source={require("../assets/fox-avatar.png")}
          style={styles.logo}
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image style={styles.icon} source={require('../assets/Bell.png')}/>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profile}>
        <Image
          source={require("../assets/avt.png")}
          style={styles.avatar}
        />
      </View>

      <ScrollView style={styles.options}>
        {[
          { label: "Hồ sơ", icon: require("../assets/Vector.png") },
          { label: "Tùy chọn thanh toán", icon: require("../assets/Vector1.png") },
          { label: "Chứng chỉ của tôi", icon: require("../assets/Vector2.png") },
          { label: "Điều khoản & Điều kiện", icon: require("../assets/Vector3.png") },
          { label: "Trung tâm trợ giúp", icon: require("../assets/Vector4.png") },
          { label: "Mời bạn bè", icon: require("../assets/Vector5.png") },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <Text style={styles.optionIcon}>{item.icon}</Text>
            <Text style={styles.optionLabel}>{item.label}</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f4fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0597D8",
    paddingTop: 40,
    paddingHorizontal: 10,
    height: 100,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    width: 24,
    height: 24, 
  },
  logo: {
    flex: 1, 
    width: 50,
    height: 50,
    resizeMode: "contain", 
    alignSelf: "center",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  profile: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#0597D8",
  },
  options: {
    flex: 1,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionIcon: {
    fontSize: 20,
    color: "#0597D8",
    width: 30,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  optionArrow: {
    fontSize: 18,
    color: "#0597D8",
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#0597D8",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
