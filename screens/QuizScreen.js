import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';

const QuizScreen = ({ navigation, route }) => {
  const { lesson } = route.params;
  const { user, updateUser } = useUser();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctedAnswer, setCorrectAnswer] = useState(0);

  const currentQuestion = lesson.questions[currentQuestionIndex];

  const handleNextQuestion = async () => {
    const userAnswerData = {
      questionId: currentQuestion.id,
      answer:
        currentQuestion.type === 'fill-in-the-blank'
          ? userAnswer
          : selectedAnswer,
      isCorrect: isCorrect,
    }; 

    // Cập nhật bài học hiện tại trong danh sách lessons
    const updatedLessons = user.lessons.map((l) => {
      if (l.lessonId === lesson.id) {
        console.log('Updating lesson:', l);

        // Kiểm tra xem câu hỏi đã tồn tại trong completedQuestions chưa
        const questionIndex = l.completedQuestions.findIndex(
          (q) => q.questionId === userAnswerData.questionId
        );
        console.log(userAnswerData);
        // Nếu câu hỏi đã có trong completedQuestions, cập nhật câu trả lời
        const updatedCompletedQuestions =
          questionIndex !== -1
            ? l.completedQuestions.map((q, index) =>
                index === questionIndex ? userAnswerData : q
              )
            : [...l.completedQuestions, userAnswerData];

        // Cập nhật progress
        const updatedProgress =
          ((currentQuestionIndex + 1) / lesson.questions.length) * 100;

        console.log('Updated Progress:', updatedProgress); 
        // Trả về bài học đã cập nhật
        return {
          ...l,
          completedQuestions: updatedCompletedQuestions,
          progress: updatedProgress,
          status:
            currentQuestionIndex === lesson.questions.length - 1
              ? 'completed'
              : 'in-progress',
        };
      }

      // Trả về bài học không thay đổi
      return l;
    });

    try {
      const response = await fetch(
        `https://6705f762031fd46a8311820f.mockapi.io/user/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lessons: updatedLessons }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update question progress.');
      }
      const updatedUser = { ...user, lessons: updatedLessons };
      updateUser(updatedUser);

      setUserAnswer('');
      setSelectedAnswer('');
      setIsCorrect(null);
      if (currentQuestionIndex === lesson.questions.length - 1) {
        navigation.navigate('Result', { lesson, correctedAnswer });
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    } catch (error) {
      console.error('Error updating question progress:', error);
      alert('Lỗi khi lưu tiến trình!');
    }
  };

  const validateAnswer = () => {
    let isAnswerCorrect = false;

    if (currentQuestion.type === 'fill-in-the-blank') {
      const cleanUserAnswer = userAnswer
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Loại bỏ tất cả dấu câu
        .replace(/\s+/g, ' '); // Thay thế nhiều khoảng trắng bằng một khoảng trắng

      const cleanCorrectAnswer = currentQuestion.correctAnswer
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' '); 

      isAnswerCorrect = cleanUserAnswer === cleanCorrectAnswer;
    } else if (currentQuestion.type === 'multiple-choice') {
      isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setCorrectAnswer((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
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

      <View style={styles.progressBar}>
        <View
          style={{
            ...styles.progressIndicator,
            width: `${
              ((currentQuestionIndex + 1) / lesson.questions.length) * 100
            }%`,
          }}
        />
      </View>

      <View style={styles.lessonContent}>
        <Text style={styles.lesson}>Bạn đang học: </Text>
        <Text style={styles.lesson}>{lesson.title}</Text>
      </View>

      <View style={styles.quizContainer}>
        <View style={styles.questionContainer}>
          <Image
            source={require('../assets/fox-logo.png')}
            style={{ width: 80, height: 80 }}
          />
          <View>
            {currentQuestion.type === 'fill-in-the-blank' && (
              <Text style={styles.ask}>Dịch câu này cho tớ nhé:</Text>
            )}
            {currentQuestion.type === 'multiple-choice' && (
              <Text style={styles.ask}>Bạn hãy chọn bản dịch đúng nhé!</Text>
            )}
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>
        </View>

        {currentQuestion.type === 'fill-in-the-blank' && (
          <TextInput
            style={styles.textInput}
            placeholder={'Nhập tại đây!'}
            value={userAnswer}
            onChangeText={setUserAnswer}
          />
        )}

        {currentQuestion.type === 'multiple-choice' && (
          <View>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && styles.selectedOption,
                ]}
                onPress={() => setSelectedAnswer(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isCorrect !== null && (
          <Text style={styles.feedbackText}>
            {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
          </Text>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={isCorrect === null ? validateAnswer : handleNextQuestion}>
          <Text style={styles.submitButtonText}>
            {currentQuestionIndex === lesson.questions.length - 1
              ? 'Hoàn thành'
              : isCorrect === null
              ? 'Kiểm tra'
              : 'Tiếp tục'}
          </Text>
        </TouchableOpacity>
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
  lessonContent: { paddingLeft: 20 },
  lesson: { color: '#9C9C9C', fontSize: 15, fontWeight: 'bold' },
  quizContainer: { flex: 1, padding: 20 },
  questionContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  ask: {
    width:'70%',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9C9C9C',
    textAlign: 'center',
  },
  questionText: {
    width:'70%',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0597D8',
    textAlign: 'center',

  },
  textInput: {
    borderWidth: 1,
    borderColor: '#0597D8',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0597D8',
    marginBottom: 10,
  },
  optionText: { fontSize: 16, color: '#0597D8' },
  selectedOption: { backgroundColor: '#b3e5fc' },
  feedbackText: {
    fontSize: 18,
    color: '#0597D8',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#0597D8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
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

export default QuizScreen;
