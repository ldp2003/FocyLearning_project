import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const questions = [
  { 
    question: "Chào bạn! Tớ là Focy", 
    buttonText: "Chào bạn!" 
  },
  { 
    question: "Tớ yêu tiếng Anh nên cùng tớ học tiếng Anh nhé!", 
    buttonText: "Tiếp tục" 
  },
  { 
    question: "Cậu biết gì về tiếng Anh chưa?", 
    buttonText: "Tiếp tục", 
    options: [
      "Không biết gì cả (bắt đầu từ cơ bản)",
      "Tớ biết cấu trúc và ngữ pháp nhưng cần học thêm từ vựng",
      "Tớ có từ vựng nhưng cần củng cố thêm các cấu trúc và ngữ pháp",
      "Tớ có thể thảo luận sâu và hiểu hết các chủ đề"
    ]
  },
  { 
    question: "Cậu bao nhiêu tuổi nhỉ?",
    buttonText: "Tiếp tục",
    options: [
      "Dưới 18",
      "18-25",
      "26-35",
      "Trên 35"
    ]
  },
  { 
    question: "Mình đã ghi nhận lại! Cảm ơn bạn đã dành thời gian cho tớ! Giờ chúng ta cùng đăng ký tài khoản nhé!", 
    buttonText: "Tiếp tục" 
  }
];

const SurveyScreen = ({ navigation , route}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [surveyResults, setSurveyResults] = useState({});

  const handleNext = () => {
    if (questions[currentStep].options) {
      setSurveyResults((prevResults) => ({
        ...prevResults,
        [questions[currentStep].question]: selectedOption,
      }));
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(surveyResults[currentStep + 1] || null);
    } else {
      navigation.navigate('Register', surveyResults); 
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedOption(surveyResults[currentStep - 1] || null);
    } else {
      navigation.goBack();
    }
  };

  const isOptionRequired = questions[currentStep].options ? selectedOption !== null : true;

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      <View style={styles.header}>
        <Image source={require('../assets/fox-logo.png')} style={styles.logo} />
        <View style={styles.dialogueFrame}>
          <Text style={styles.question}>{questions[currentStep].question}</Text>
        </View>
      </View>
      {questions[currentStep].options && (
        <View style={styles.optionsContainer}>
          {questions[currentStep].options.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.option, 
                selectedOption === option && styles.selectedOption
              ]}
              onPress={() => setSelectedOption(option)}
            >
              <Text style={[
                styles.optionText, 
                selectedOption === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity 
        style={[styles.nextButton, !isOptionRequired && styles.disabledButton]} 
        onPress={handleNext} 
        disabled={!isOptionRequired}
      >
        <Text style={styles.nextButtonText}>{questions[currentStep].buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent:'center',
    padding: 20,
    backgroundColor: '#e0f7fa', 
  },
  header: {
    width: '100%',
    flexDirection:'row',
    marginTop:50,
    marginBottom: 20,
  },
  backButton: {
    position:'absolute',
    top:10,
    left:20,
  },
  backText: {
    color: '#0597D8',
    fontSize: 35,
  },
  logo: {
    width: 80, 
    height: 80,
    marginBottom: 10,
  },
  dialogueFrame: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    borderColor: '#0597D8',
    borderWidth: 1,
    marginTop: 10,
    width:'70%'
  },
  question: { 
    fontSize: 18, 
    color: '#0597D8', 
    textAlign: 'center' 
  },
  optionsContainer: { 
    width: '100%', 
    marginBottom: 20 
  },
  option: { 
    padding: 15, 
    marginVertical: 8, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#0597D8',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  selectedOption: { 
    backgroundColor: '#0597D8',
  },
  selectedOptionText: {
    color: '#fff',
  },
  optionText: { 
    fontSize: 16, 
    color: '#0597D8' 
  },
  nextButton: { 
    padding: 15, 
    borderRadius: 10, 
    backgroundColor: '#0597D8',
    width: '60%',
    alignItems: 'center'
  },
  disabledButton: { 
    backgroundColor: '#B0C4DE'
  },
  nextButtonText: { 
    fontSize: 16, 
    color: '#fff', 
    fontWeight: 'bold' 
  }
});

export default SurveyScreen;
