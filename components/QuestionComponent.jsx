// QuestionComponent.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { MotiView } from "moti";
import styles from "@/app/screens/QuizcreationScreen/styles";
import { QUIZ_TYPES } from "@/components/QuizConstance";

const QuestionComponent = ({
  currentQuestion,
  setCurrentQuestion,
  addQuestion,
  quizState,
  dropdownStates,
  setDropdownStates,
}) => {
  const [questionImage, setQuestionImage] = useState(null);

  const pickQuestionImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        setQuestionImage(selectedImage.uri);
        setCurrentQuestion({
          ...currentQuestion,
          backgroundImage: selectedImage.uri,
        });
      }
    } catch (error) {
      console.error("Image pick error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };
  return (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.section}
    >
      <View style={styles.sectionHeader}>
        <Ionicons name="help-circle" size={24} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>Question Details</Text>
      </View>

      <View style={[styles.categoryContainer, { zIndex: 3000 }]}>
        <DropDownPicker
          open={dropdownStates.questionType}
          value={currentQuestion.type}
          items={QUIZ_TYPES.map((type) => ({
            label: type.name,
            value: type.id,
          }))}
          setOpen={(open) =>
            setDropdownStates({ ...dropdownStates, questionType: open })
          }
          setValue={(callback) =>
            setCurrentQuestion({
              ...currentQuestion,
              type: callback(currentQuestion.type),
            })
          }
          style={[styles.dropdown, styles.enhancedDropdown]}
          placeholder="Select Question Type"
        />
      </View>

      <TextInput
        style={[styles.input, styles.textArea, styles.enhancedInput]}
        placeholder="Enter your question"
        value={currentQuestion.question}
        onChangeText={(text) =>
          setCurrentQuestion({ ...currentQuestion, question: text })
        }
        multiline
        numberOfLines={3}
      />

      <View style={styles.imageSection}>
        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={pickQuestionImage}
        >
          <Ionicons name="image" size={24} color="#1a2151" />
          <Text style={styles.imageUploadText}>
            {questionImage ? "Change Background Image" : "Add Background Image"}
          </Text>
        </TouchableOpacity>
        {questionImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: questionImage }}
              style={styles.imagePreview}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => {
                setQuestionImage(null);
                setCurrentQuestion({
                  ...currentQuestion,
                  backgroundImage: null,
                });
              }}
            >
              <Ionicons name="close-circle" size={24} color="#FF4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {currentQuestion.options.map((option, index) => (
        <View key={index} style={styles.optionContainer}>
          <TextInput
            style={[styles.input, styles.enhancedInput, { flex: 1 }]}
            placeholder={`Option ${index + 1}`}
            value={option}
            onChangeText={(text) => {
              const newOptions = [...currentQuestion.options];
              newOptions[index] = text;
              setCurrentQuestion({ ...currentQuestion, options: newOptions });
            }}
          />
          <TouchableOpacity
            style={[
              styles.correctAnswerButton,
              currentQuestion.correctAnswer === index &&
                styles.correctAnswerButtonActive,
            ]}
            onPress={() =>
              setCurrentQuestion({ ...currentQuestion, correctAnswer: index })
            }
          >
            <Ionicons
              name={
                currentQuestion.correctAnswer === index
                  ? "checkmark-circle"
                  : "radio-button-off"
              }
              size={24}
              color={
                currentQuestion.correctAnswer === index ? "#FFA500" : "#6B7280"
              }
            />
          </TouchableOpacity>
        </View>
      ))}

      <TextInput
        style={[styles.input, styles.textArea, styles.enhancedInput]}
        placeholder="Explanation (optional)"
        value={currentQuestion.explanation}
        onChangeText={(text) =>
          setCurrentQuestion({ ...currentQuestion, explanation: text })
        }
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.addQuestionButton} onPress={addQuestion}>
        <Ionicons name="add-circle" size={24} color="#FFFFFF" />
        <Text style={styles.addQuestionButtonText}>Add Question</Text>
      </TouchableOpacity>
    </MotiView>
  );
};

export default QuestionComponent;
