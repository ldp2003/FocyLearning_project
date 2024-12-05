import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

export default function App({ navigation }) {
  const { user, updateUser } = useUser();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedLessons = async () => {
      try {
        const response = await fetch(
          'https://6705f762031fd46a8311820f.mockapi.io/lesson'
        );
        const allLessons = await response.json();

        const savedLessons = allLessons.filter((lesson) =>
          user?.savedLessons?.includes(lesson.id)
        );

        setLessons(savedLessons);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bài học:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.savedLessons?.length > 0) {
      fetchSavedLessons();
    } else {
      setLoading(false);
    }
  }, [user]);

  const saveLessonToUser = async (userId, lessonId) => {
    const userApiUrl = `https://6705f762031fd46a8311820f.mockapi.io/user/${userId}`;

    try {
      const userResponse = await axios.get(userApiUrl);
      const user = userResponse.data;

      if (!user.savedLessons) {
        user.savedLessons = [];
      }

      if (!user.savedLessons.includes(lessonId)) {
        user.savedLessons.push(lessonId);

        await axios.put(userApiUrl, user);
        updateUser(user);
        console.log('ID bài học đã được lưu vào người dùng:', lessonId);
      }
    } catch (error) {
      console.error('Lỗi khi lưu bài học vào người dùng:', error);
    }
  };

  const removeLessonFromUser = async (userId, lessonId) => {
    const userApiUrl = `https://6705f762031fd46a8311820f.mockapi.io/user/${userId}`;

    try {
      const userResponse = await axios.get(userApiUrl);
      const user = userResponse.data;

      if (user.savedLessons && user.savedLessons.includes(lessonId)) {
        user.savedLessons = user.savedLessons.filter((id) => id !== lessonId);

        await axios.put(userApiUrl, user);
        updateUser(user);
        console.log('ID bài học đã bị xóa khỏi danh sách:', lessonId);
      }
    } catch (error) {
      console.error('Lỗi khi xóa bài học khỏi người dùng:', error);
    }
  };

  const renderLesson = ({ item }) => {
    const isSaved = user.savedLessons && user.savedLessons.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.lessonCard}
        onPress={() => navigation.navigate('Lesson', { lessonId: item.id })}>
        <Image source={{ uri: item.image }} style={styles.lessonImage} />
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (isSaved) {
              removeLessonFromUser(user.id, item.id);
            } else {
              saveLessonToUser(user.id, item.id);
            }
          }}
          style={styles.saveButton}>
          <Image
            source={
              isSaved
                ? require('../assets/bookmark.png')
                : require('../assets/save-instagram.png')
            }
            style={styles.saveIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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
        <Image
          source={require('../assets/bia.png')}
          style={styles.bannerImage}
        />
        <View style={styles.profilePicture}>
          <Image
            source={require('../assets/avt.png')}
            style={styles.profileImage}
          />
        </View>
      </View>

      <View style={styles.stats}>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{lessons.length}</Text>
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

      <View style={styles.lessons}>
        {loading ? (
          <ActivityIndicator size="large" color="#0597D8" />
        ) : lessons.length === 0 ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.sectionTitle}>Bài học đã lưu</Text>
            <Text style={styles.noLessonsText}>
              Không có bài học nào được lưu.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Bài học đã lưu</Text>
            <FlatList
              data={lessons}
              renderItem={renderLesson}
              keyExtractor={(item) => item.id}
            />
          </>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('List', { focusSearchBar: true })}
          style={styles.footerItem}>
          <Image
            source={require('../assets/searchft.png')}
            style={styles.iconFooter}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('List')}
          style={styles.footerItem}>
          <Image
            source={require('../assets/lesson.png')}
            style={styles.iconFooter}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          style={styles.footerItem}>
          <Image
            source={require('../assets/Home.png')}
            style={styles.iconFooter}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image
            source={require('../assets/userft.png')}
            style={styles.iconFooter}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.footerItem}>
          <Image
            source={require('../assets/settingft.png')}
            style={styles.iconFooter}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4fa',
  },
  backText: {
    marginLeft: 10,
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
    paddingTop: 40,
    height: 100,
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
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  bannerImage: {
    width: '90%',
    height: '75%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  profilePicture: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  name: {
    color: '#0597D8',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    color: '#0597D8',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#0597D8',
    fontSize: 14,
  },
  lessons: {
    flex: 1,
    padding: 10,
  },
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  lessonImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  lessonInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0597D8',
  },
  saveButton: {
    padding: 5,
  },
  saveIcon: {
    width: 24,
    height: 24,
    tintColor: '#0597D8',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  footerItem: {
    alignItems: 'center',
  },
  iconFooter: {
    width: 25,
    height: 25,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0597D8',
    textAlign: 'center',
    marginBottom: 10,
  },
  noLessonsText: {
    fontSize: 16,
    color: '#0597D8',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
