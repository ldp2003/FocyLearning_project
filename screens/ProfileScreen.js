import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";

export default function App({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Image
          source={require('../assets/fox-avatar.png')}
          style={styles.avatar}
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image source={require('../assets/avt.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.banner}>
        <Image source={require('../assets/bia.png')} style={styles.bannerImage} />
        <View style={styles.profilePicture}>
          <Image source={require('../assets/avt.png')} style={styles.profileImage} />
        </View>
      </View>

      <View style={styles.stats}>
        <Text style={styles.name}>J97</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>25</Text>
          <Text style={styles.statLabel}>Đã Lưu</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Đang Học</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>98</Text>
          <Text style={styles.statLabel}>Đã Xong</Text>
        </View>
      </View>

      <ScrollView style={styles.lessons}>
        <Text style={styles.sectionTitle}>Bài học đã lưu</Text>

        <View style={styles.lessonCard}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.lessonImage}
          />
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonTitle}>Từ vựng giao tiếp thông dụng hiện nay</Text>
            <Text style={styles.lessonProgressText}>Tiến độ: 100%</Text>
            <View style={styles.progressBar}>
              <View style={styles.progress} />
            </View>
          </View>
        </View>

        <View style={styles.lessonCard}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.lessonImage}
          />
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonTitle}>Giao tiếp trong kinh doanh</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('List', { focusSearchBar: true })} style={styles.footerItem}>
          <Image source={require('../assets/searchft.png')} style={styles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('List')} style={styles.footerItem}>
          <Image source={require('../assets/lesson.png')} style={styles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.footerItem}>
          <Image source={require('../assets/Home.png')} style={styles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('../assets/userft.png')} style={styles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.footerItem}>
          <Image source={require('../assets/settingft.png')} style={styles.iconFooter} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f4fa",
  },
  backText: {
    marginLeft:10,
    fontSize: 35,
    color: '#fff',
  },
  header: {
    backgroundColor: '#0597D8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:40,
    height:100
  },
  avatar: {
    width: 50,
    height: 50,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  banner: {
    height: 170,
    alignItems: "center",
    position: "relative", 
    marginBottom: 20,
  },
  bannerImage: {
    width: "90%", 
    height: "75%", 
    resizeMode: "cover",
    borderRadius: 10,
  },
  profilePicture: {
    position: "absolute", 
    bottom: 5,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  name: {
    color:'#0597D8',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    color: '#0597D8',
    fontWeight: "bold",
  },
  statLabel: {
    color: '#0597D8',
    fontSize: 14,
  },
  lessons: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  lessonCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  lessonImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  lessonProgressText: {
    fontSize: 12,
    color: "#666",
  },
  progressBar: {
    height: 5,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 5,
  },
  progress: {
    height: "100%",
    backgroundColor: "#4caf50",
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  footerItem: {
    alignItems: 'center',
  },
  iconFooter: {
    width: 25,
    height: 25,
  },
});
