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

const ListScreen = ({ navigation, route }) => {
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

  const renderFeaturedLesson = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredLesson}
      onPress={() => navigation.navigate('Lesson', { lessonId: item.id })}>
      <Image source={{uri: item.image}} style={styles.featuredImage} />
      <Text style={styles.lessonTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

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
  lessonTitle: {
    fontSize: 16,
    flex: 3,
    fontWeight: 'bold',
    color: '#0597D8',
    marginBottom: 10,
  },
  featuredLessons: {
    marginBottom: 20,
  },
  featuredLesson: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    margin: 10,
    marginLeft: 0,
  },
  featuredImage: {
    flex: 2,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
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
