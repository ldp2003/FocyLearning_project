import React, { useState, useEffect } from 'react';
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
import { useUser } from '../contexts/UserContext';

const MainScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const [featuredLessons, setFeaturedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoriesData = [
    { id: '1', title: 'Ngữ pháp', image: require('../assets/grammar.png') },
    { id: '2', title: 'Từ vựng', image: require('../assets/text_fields.png') },
    { id: '3', title: 'Đọc hiểu', image: require('../assets/reading.png') },
    { id: '4', title: 'Nghe', image: require('../assets/Icon1.png') },
  ];

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.category} key={item.id}>
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchFeaturedLessons = async () => {
      try {
        const response = await fetch(
          'https://6705f762031fd46a8311820f.mockapi.io/lesson'
        );
        const data = await response.json();
        setFeaturedLessons(data);
      } catch (error) {
        console.error('Failed to fetch featured lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedLessons();
  }, []);

  const renderFeaturedLesson = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredLesson}
      onPress={() => navigation.navigate('Lesson',{lessonId: item.id, })}>
      <Image source={item.image} style={styles.featuredImage} />
      <Text style={styles.lessonTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={require('../assets/menu.png')} style={styles.icon} />
        </TouchableOpacity>
        <Image
          source={require('../assets/fox-avatar.png')}
          style={styles.avatar}
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image source={require('../assets/Bell.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.greetingContainer}>
          <Image
            source={require('../assets/fox-logo.png')}
            style={{ width: 50, height: 50 }}
          />
          <Text style={styles.greetingText}>
            {user.name}! Chào buổi sáng! chúng ta bắt đầu bằng vài câu hỏi về
            bữa sáng thì sao?
          </Text>
        </View>

        <TextInput
          placeholder="Bạn cần tìm gì nhỉ"
          style={styles.searchBar}
          placeholderTextColor="#78C2E3"
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>Xem thêm ></Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categoriesData}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.categories}
          scrollEnabled={false}
        />

        {user.lastLesson && (
          <View>
            <Text style={styles.sectionTitle}>Tiếp tục từ bài học trước?</Text>
            <View style={styles.lessonProgress}>
              <Text style={styles.lessonTitle}>{user.lastLesson.title}</Text>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {user.lastLesson.progress}%
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progress,
                      { width: `${user.lastLesson.progress}%` },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Lesson', {
                      lessonId: user.lastLesson.id,
                    })
                  }>
                  <Text style={styles.continueText}>Tiếp tục</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Bài học của ngày hôm nay</Text>
        <View style={styles.todayLesson}>
          <Text style={styles.lessonTitle}>
            Những câu hỏi ngẫu nhiên dựa trên nhu cầu của bạn!
          </Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Bắt đầu ngay ></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Những bài học nổi bật</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>Xem thêm ></Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredLessons}
          renderItem={renderFeaturedLesson}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredLessons}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.footerItem}>
          <Image
            source={require('../assets/searchft.png')}
            style={styles.iconFooter}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
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
  greetingContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    color: '#0597D8',
    textAlign: 'center',
    width: '80%',
  },
  searchBar: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0597D8',
    marginBottom: 20,
    fontSize: 16,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0597D8',
  },
  seeMore: {
    color: '#0597D8',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  category: {
    width: '45%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderColor: '#0597D8',
    borderWidth: 1,
    flexDirection: 'row',
    alignContent: 'center',
  },
  categoryImage: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  categoryText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0597D8',
  },
  lessonProgress: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0597D8',
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueText: {
    color: '#0597D8',
    fontWeight: 'bold',
    marginRight: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
    marginRight: 10,
  },
  progress: {
    height: 8,
    backgroundColor: '#0597D8',
    borderRadius: 5,
  },
  progressText: {
    color: '#0597D8',
    fontWeight: 'bold',
    marginRight: 10,
  },
  todayLesson: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  startButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  startButtonText: {
    color: '#0597D8',
    fontWeight: 'bold',
  },
  featuredLessons: {
    marginBottom: 20,
  },
  featuredLesson: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  featuredImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
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

export default MainScreen;
