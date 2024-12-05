import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

const LessonScreen = ({ navigation, route }) => {
  const { user, updateUser } = useUser();
  const { lessonId } = route.params;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
   const isSaved = user.savedLessons && user.savedLessons.includes(lessonId);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(
          `https://6705f762031fd46a8311820f.mockapi.io/lesson/${lessonId}`
        );
        const data = await response.json();
        setLesson(data);
        const lesson = user.lessons?.find((l) => l.lessonId === lessonId);
        if (lesson) setProgress(lesson.progress);
      } catch (err) {
        setError('Không thể tải bài học. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

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
        user.savedLessons = user.savedLessons.filter(id => id !== lessonId);

        await axios.put(userApiUrl, user);
        updateUser(user);
        console.log('ID bài học đã bị xóa khỏi danh sách:', lessonId);
      }
    } catch (error) {
      console.error('Lỗi khi xóa bài học khỏi người dùng:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0597D8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.retryButton}>
          <Text style={styles.retryText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
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
      <ScrollView style={styles.scrollContainer}>
        <Image source={{uri: lesson.image}} style={styles.lessonImage} />
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.tagsContainer}>
          {lesson.categories?.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Độ dài dự kiến</Text>
          <Text style={styles.infoValue}>
            ~{lesson.expectedLength} - {lesson.expectedLength + 5} phút
          </Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Tiến độ của bạn</Text>
          {progress === 0 ? (
            <Text style={styles.infoValue}>Bạn chưa học bài học này!</Text>
          ) : (
            <Text style={styles.infoValue}>{progress}%</Text>
          )}
        </View>
        <Text style={styles.descriptionTitle}>Giới thiệu về bài học</Text>
        <Text style={styles.descriptionText}>{lesson.description}</Text>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Quiz', { lesson: lesson })}>
          <Text style={styles.startButtonText}>Bắt đầu thôi!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isSaved) {
              removeLessonFromUser(user.id, lessonId);
            } else {
              saveLessonToUser(user.id, lessonId);
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
        </View>
      </ScrollView>
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
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.footerItem}>
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
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0f7fa',
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: '#e0f7fa',
    flex: 1,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0597D8',
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
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
  lessonImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0597D8',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#fff',
    color: '#0597D8',
    padding: 5,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#0597D8',
    fontWeight: 'bold',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0597D8',
    alignItems: 'center',
  },
  infoText: {
    fontWeight: 'bold',
    color: '#0597D8',
    fontSize: 16,
  },
  infoValue: {
    color: '#7E8D94',
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0597D8',
    marginVertical: 10,
  },
  descriptionText: {
    color: '#0597D8',
    marginBottom: 20,
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#0597D8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width:'80%'
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0f7fa',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 50,
  },
  footerItem: {
    alignItems: 'center',
  },
  iconFooter: {
    width: 25,
    height: 25,
  },
  saveButton: {
    marginTop: 20,
    padding: 5,
  },
  saveIcon: {
    width: 30,
    height: 30,
    tintColor: '#0597D8', 
  }
});

export default LessonScreen;
