import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

const ListScreen = ({ navigation, route }) => {
   const { user, updateUser } = useUser();
  const { focusSearchBar } = route.params || {};
  const { searchQuery: initialSearchQuery = '' } = route.params || {};
  const [featuredLessons, setFeaturedLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [loading, setLoading] = useState(true);

  const searchInputRef = useRef(null); 
  
  useEffect(() => {
    const fetchFeaturedLessons = async () => {
      try {
        const response = await fetch(
          'https://6705f762031fd46a8311820f.mockapi.io/lesson'
        );
        const data = await response.json();
        setFeaturedLessons(data);
        if(searchQuery === '')
          setFilteredLessons(data); // Hiển thị tất cả bài học mặc định
        else{
          handleSearch();
        }
      } catch (error) {
        console.error('Failed to fetch featured lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedLessons();

     if (focusSearchBar && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100); 
    }
  }, [focusSearchBar]);

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    const results = featuredLessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(query) ||
        (lesson.categories &&
          lesson.categories.some((cat) => cat.toLowerCase().includes(query)))
    );
    setFilteredLessons(results);
  };

  const handleSearchClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus(); 
    }
  };

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

  const renderFeaturedLesson = ({ item }) => {
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
                ? require('../assets/bookmark.png') // Biểu tượng đã lưu
                : require('../assets/save-instagram.png') // Biểu tượng lưu
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
      <TextInput
        ref={searchInputRef}
        placeholder="Bạn cần tìm gì nhỉ"
        style={styles.searchBar}
        placeholderTextColor="#78C2E3"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <ScrollView style={styles.scrollContainer}>
        <FlatList
          data={filteredLessons}
          renderItem={renderFeaturedLesson}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.featuredLessons}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
           onPress={handleSearchClick}
          style={styles.footerItem}>
          <Image
            source={require('../assets/searchft.png')}
            style={styles.iconFooter}
          />
        </TouchableOpacity>
        <TouchableOpacity
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
    paddingBottom: 50,
  },
  backText: {
    marginLeft: 10,
    fontSize: 35,
    color: '#fff',
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: '#e0f7fa',
    flex: 1,
    paddingBottom: 50,
  },
  header: {
    backgroundColor: '#0597D8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingLeft: 10,
    paddingRight: 10,
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
    marginRight: 10,
  },
  searchBar: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0597D8',
    margin: 20,
    marginBottom: 0,
    fontSize: 16,
  },
  featuredLessons: {
    marginBottom: 20,
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
    height: 50,
  },
  footerItem: {
    alignItems: 'center',
  },
  iconFooter: {
    width: 25,
    height: 25,
  },
});

export default ListScreen;
