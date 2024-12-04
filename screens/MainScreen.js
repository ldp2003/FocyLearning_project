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
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

const MainScreen = ({ navigation }) => {
  const { user } = useUser();
  const [featuredLessons, setFeaturedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const searchInputRef = useRef(null);

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

  const handleSearchSubmit = () => {
    navigation.navigate('List', { searchQuery });
  };

  const handleSearchClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleChatMessageSend = async () => {
    if (userMessage.trim() === '') return;

    // Thêm tin nhắn người dùng vào chat
    setChatMessages([
      ...chatMessages,
      { sender: 'user', message: userMessage },
    ]);
    setUserMessage(''); // Reset input
    setIsSendingMessage(true);

    try {
      const MAX_HISTORY_LENGTH = 10;
      const messages = chatMessages.slice(-MAX_HISTORY_LENGTH).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message,
      }));
      messages.push({ role: 'user', content: userMessage });

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer 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`,
          },
        }
      );

      // Lấy phản hồi từ bot
      const botResponse = response.data.choices[0].message.content.trim();
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', message: botResponse },
      ]);
    } catch (error) {
      if (error.response?.status === 429) {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'bot',
            message: 'Hiện tại hạn mức đã vượt quá. Vui lòng thử lại sau.',
          },
        ]);
      } else {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', message: `Lỗi: ${error.message}` },
        ]);
      }
    } finally {
      setIsSendingMessage(false);
    }
  };

  const renderFeaturedLesson = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredLesson}
      onPress={() => navigation.navigate('Lesson', { lessonId: item.id })}>
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
          <TouchableOpacity onPress={() => setIsChatModalVisible(true)}>
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
          ref={searchInputRef}
          placeholder="Bạn cần tìm gì nhỉ"
          style={styles.searchBar}
          placeholderTextColor="#78C2E3"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
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

      <Modal
        visible={isChatModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChatModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTitle}>Chat với Bot AI</Text>
                  <TouchableOpacity
                    onPress={() => setIsChatModalVisible(false)}
                    style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Đóng</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.chatMessages}>
                  {chatMessages.map((msg, index) => (
                    <View
                      key={index}
                      style={
                        msg.sender === 'user'
                          ? styles.userMessage
                          : styles.botMessage
                      }>
                      <Text style={styles.messageText}>{msg.message}</Text>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.chatInputContainer}>
                  <TextInput
                    style={styles.chatInput}
                    value={userMessage}
                    onChangeText={setUserMessage}
                    placeholder="Nhập tin nhắn..."
                  />
                  <TouchableOpacity
                    onPress={handleChatMessageSend}
                    style={styles.sendButton}
                    disabled={isSendingMessage}>
                    <Text style={styles.sendButtonText}>
                      {isSendingMessage ? 'Đang gửi...' : 'Gửi'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSearchClick} style={styles.footerItem}>
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
        <TouchableOpacity style={styles.footerItem}>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingBottom: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#0597D8',
    fontWeight: 'bold',
  },
  chatMessages: {
    flex: 1,
    marginTop: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: '75%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F0F0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: '75%',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCC',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#0597D8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MainScreen;
