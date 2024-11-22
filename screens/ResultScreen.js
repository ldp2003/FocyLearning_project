import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const ResultScreen = ({ route, navigation }) => {
  const { lesson } = route.params;  // Nhận bài học từ trang QuizScreen
  const totalQuestions = lesson.questions.length;

  // Giả sử bạn có logic để tính tỷ lệ đúng
  const [correctAnswers, setCorrectAnswers] = useState(4); // Ví dụ đã trả lời đúng 4 câu
  const progress = (correctAnswers / totalQuestions) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image source={require('../assets/fox-avatar.png')} style={styles.avatar} />
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image source={require('../assets/Bell.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={{
            ...styles.progressIndicator,
            width: `${progress}%`,
          }}
        />
      </View>

      {/* Result Content */}
      <View style={styles.resultContent}>
        <Text style={styles.congratulationsText}>Chúc mừng bạn đã hoàn thành bài học!</Text>
        <Image
          source={require('../assets/fox-logo.png')} // Hình ảnh của Focy
          style={styles.avatarImage}
        />

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {correctAnswers}/{totalQuestions} Câu đúng
          </Text>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.nextButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerItem}>
          <Image source={require('../assets/searchft.png')} style={styles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerItem}>
          <Image source={require('../assets/lesson.png')} style={styles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Lessons')} style={styles.footerItem}>
          <Image source={require('../assets/Home.png')} style={styles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.footerItem}>
          <Image source={require('../assets/userft.png')} style={styles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.footerItem}>
          <Image source={require('../assets/settingft.png')} style={styles.iconFooter} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f7fa' },
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
  backButtonText: {
    fontSize: 35,
    margin: 10,
    color: '#fff',
  },
  avatar: { width: 40, height: 40, marginRight: 10 },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  progressBar: { height: 5, backgroundColor: '#b3e5fc', marginVertical: 10 },
  progressIndicator: { height: '100%', backgroundColor: '#0597D8' },
  resultContent: { alignItems: 'center', padding: 20 },
  congratulationsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0597D8',
    marginBottom: 20,
  },
  avatarImage: { width: 150, height: 150, marginBottom: 30 },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0597D8',
  },
  progressText: {
    fontSize: 20,
    color: '#9C9C9C',
  },
  nextButton: {
    backgroundColor: '#0597D8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
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

export default ResultScreen;