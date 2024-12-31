import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Keyboard,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { MotiView, AnimatePresence } from "moti";
import { COLORS, FONTS } from "../app/screens/QuizcreationScreen/styles";
import { db } from "@/service/firebase/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import { useLanguage } from "@/i18n";
const MAX_QUESTION_LENGTH = 500;
const MAX_OPTION_LENGTH = 200;
const MAX_EXPLANATION_LENGTH = 1000;
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

const QuestionComponent = ({
  currentQuestion,
  setCurrentQuestion,
  addQuestion,
  quizState,
  dropdownStates,
  setDropdownStates,
  onValidationError,
}) => {
  const [questionImage, setQuestionImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const { t } = useLanguage();
  const handleAddQuestion = useCallback(async () => {
    Keyboard.dismiss();
    if (validateQuestion()) {
      setLoading(true);
      try {
        await addQuestion();
        // Reset the form after successful addition
        setQuestionImage(null);
        setCurrentQuestion({
          type: "",
          question: "",
          options: ["", ""],
          correctAnswer: null,
          explanation: "",
          backgroundImage: null,
        });
      } catch (error) {
        Alert.alert("Error", "Failed to add question. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      onValidationError?.(errors);
    }
  }, [validateQuestion, addQuestion, setCurrentQuestion, errors]);

  useEffect(() => {
    fetchBackgroundImages();
  }, []);

  useEffect(() => {
    console.log("Selected image URL:", questionImage);
  }, [questionImage]);

  const fetchBackgroundImages = async () => {
    try {
      const imagesCollection = collection(db, "backgroundImages");
      const imagesSnapshot = await getDocs(imagesCollection);
      const imagesData = imagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBackgroundImages(imagesData);
    } catch (error) {
      console.error("Error fetching background images:", error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleImageSelection = useCallback((imageUrl) => {
    setQuestionImage(imageUrl);
    setCurrentQuestion((prev) => ({
      ...prev,
      backgroundImage: imageUrl,
    }));
  }, []);

  const handleAddOption = useCallback(() => {
    if (currentQuestion.options.length < MAX_OPTIONS) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ""],
      });
    }
  }, [currentQuestion, setCurrentQuestion]);

  const handleRemoveOption = useCallback(
    (index) => {
      if (currentQuestion.options.length > MIN_OPTIONS) {
        const newOptions = currentQuestion.options.filter(
          (_, i) => i !== index
        );
        setCurrentQuestion({
          ...currentQuestion,
          options: newOptions,
          correctAnswer:
            currentQuestion.correctAnswer === index
              ? null
              : currentQuestion.correctAnswer > index
              ? currentQuestion.correctAnswer - 1
              : currentQuestion.correctAnswer,
        });
      }
    },
    [currentQuestion, setCurrentQuestion]
  );

  const validateQuestion = useCallback(() => {
    const newErrors = {};

    if (!currentQuestion.question.trim()) {
      newErrors.question = "Question is required";
    } else if (currentQuestion.question.length > MAX_QUESTION_LENGTH) {
      newErrors.question = `Question must be less than ${MAX_QUESTION_LENGTH} characters`;
    }

    if (!currentQuestion.type) {
      newErrors.type = "Question type is required";
    }

    // Type-specific validation
    switch (currentQuestion.type) {
      case "multiple-choice":
        if (currentQuestion.options.length < 2) {
          newErrors.options = "At least 2 options are required";
        }
        if (currentQuestion.options.some((option) => !option.trim())) {
          newErrors.options = "All options must be filled";
        }
        if (currentQuestion.correctAnswer === null) {
          newErrors.correctAnswer = "Please select a correct answer";
        }
        break;

      case "true-false":
        if (currentQuestion.options.length !== 2) {
          setCurrentQuestion((prev) => ({
            ...prev,
            options: ["True", "False"],
            correctAnswer: prev.correctAnswer || 0,
          }));
        }
        break;

      case "essay":
        if (!currentQuestion.explanation) {
          newErrors.explanation =
            "Sample answer is required for essay questions";
        }
        break;
    }

    if (currentQuestion.explanation?.length > MAX_EXPLANATION_LENGTH) {
      newErrors.explanation = `Explanation must be less than ${MAX_EXPLANATION_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentQuestion]);

  const handleQuizTypeChange = useCallback(
    (type) => {
      const newQuestion = { ...currentQuestion, type };

      switch (type) {
        case "true-false":
          newQuestion.options = ["True", "False"];
          newQuestion.correctAnswer = 0;
          break;
        case "essay":
          newQuestion.options = [];
          newQuestion.correctAnswer = null;
          break;
        case "multiple-choice":
          if (!newQuestion.options.length) {
            newQuestion.options = ["", ""];
            newQuestion.correctAnswer = null;
          }
          break;
      }

      setCurrentQuestion(newQuestion);
    },
    [currentQuestion]
  );

  const renderOptionsSection = () => {
    if (currentQuestion.type === "essay") {
      return null;
    }

    return (
      <>
        {currentQuestion.options.map((option, index) => (
          <MotiView
            key={index}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 100 }}
            style={styles.optionContainer}
          >
            <TextInput
              style={[
                styles.input,
                styles.enhancedInput,
                { flex: 1 },
                errors.options && styles.errorInput,
              ]}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChangeText={(text) => {
                const newOptions = [...currentQuestion.options];
                newOptions[index] = text;
                setCurrentQuestion({ ...currentQuestion, options: newOptions });
              }}
              maxLength={MAX_OPTION_LENGTH}
              editable={currentQuestion.type !== "true-false"}
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
                  currentQuestion.correctAnswer === index
                    ? "#FFA500"
                    : "#6B7280"
                }
              />
            </TouchableOpacity>

            {currentQuestion.type === "multiple-choice" &&
              currentQuestion.options.length > MIN_OPTIONS && (
                <TouchableOpacity
                  style={styles.removeOptionButton}
                  onPress={() => handleRemoveOption(index)}
                >
                  <Ionicons name="remove-circle" size={24} color="#FF4444" />
                </TouchableOpacity>
              )}
          </MotiView>
        ))}

        {errors.options && (
          <Text style={styles.errorText}>{errors.options}</Text>
        )}

        {currentQuestion.type === "multiple-choice" &&
          currentQuestion.options.length < MAX_OPTIONS && (
            <TouchableOpacity
              style={styles.addOptionButton}
              onPress={handleAddOption}
            >
              <Ionicons name="add-circle-outline" size={24} color="#1a2151" />
              <Text style={styles.addOptionText}>Add Option</Text>
            </TouchableOpacity>
          )}
      </>
    );
  };

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

  const QUIZ_TYPES = [
    { id: "multiple-choice", name: t("quizTypeMultipleChoice"), icon: "☑️" },
    { id: "true-false", name: t("quizTypeTrueFalse"), icon: "⚖️" },

    { id: "essay", name: t("quizTypeEssay"), icon: "📜" },
  ];

  const renderImageSection = () => (
    <View style={styles.imageSection}>
      {loadingImages ? (
        <ActivityIndicator color="#1a2151" style={styles.loader} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScrollView}
          contentContainerStyle={styles.imageScrollContent}
        >
          {backgroundImages.map((image) => (
            <TouchableOpacity
              key={image.id}
              style={[
                styles.imageOption,
                questionImage === image.imageUrl && styles.selectedImageOption,
              ]}
              onPress={() => {
                handleImageSelection(image.imageUrl);
              }}
            >
              <Image
                source={{ uri: image.imageUrl }}
                style={styles.thumbnailImage}
              />
              {questionImage === image.imageUrl && (
                <View style={styles.selectedOverlay}>
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <AnimatePresence>
        {questionImage && (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={styles.imagePreviewContainer}
          >
            <Image
              source={{ uri: questionImage }}
              style={styles.imagePreview}
              resizeMode="cover"
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
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );

  const remainingChars = useMemo(
    () => ({
      question: MAX_QUESTION_LENGTH - (currentQuestion.question?.length || 0),
      explanation:
        MAX_EXPLANATION_LENGTH - (currentQuestion.explanation?.length || 0),
    }),
    [currentQuestion.question, currentQuestion.explanation]
  );

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
            icon: () => <Text style={styles.dropdownIcon}>{type.icon}</Text>,
          }))}
          setOpen={(open) =>
            setDropdownStates({ ...dropdownStates, questionType: open })
          }
          setValue={(callback) => {
            const newType = callback(currentQuestion.type);
            handleQuizTypeChange(newType);
          }}
          style={[styles.dropdown, errors.type && styles.errorInput]}
          placeholder="Select Question Type"
          placeholderStyle={styles.dropdownPlaceholder}
          textStyle={styles.dropdownText}
        />
        {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            styles.enhancedInput,
            errors.question && styles.errorInput,
          ]}
          placeholder="Enter your question"
          value={currentQuestion.question}
          onChangeText={(text) =>
            setCurrentQuestion({ ...currentQuestion, question: text })
          }
          multiline
          numberOfLines={3}
          maxLength={MAX_QUESTION_LENGTH}
        />
        <Text style={styles.charCount}>
          {remainingChars.question} characters remaining
        </Text>
        {errors.question && (
          <Text style={styles.errorText}>{errors.question}</Text>
        )}
      </View>

      <View style={styles.imageSection}>
        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={pickQuestionImage}
        >
          <Ionicons name="image" size={24} color="#003333" />
          <Text style={styles.imageUploadText}>Select from Gallery</Text>
        </TouchableOpacity>
        {/* image selection */}
        {renderImageSection()}
      </View>
      {errors.options && <Text style={styles.errorText}>{errors.options}</Text>}
      {renderOptionsSection()}

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            styles.enhancedInput,
            errors.explanation && styles.errorInput,
          ]}
          placeholder="Explanation (optional)"
          value={currentQuestion.explanation}
          onChangeText={(text) =>
            setCurrentQuestion({ ...currentQuestion, explanation: text })
          }
          multiline
          numberOfLines={3}
          maxLength={MAX_EXPLANATION_LENGTH}
        />
        <Text style={styles.charCount}>
          {remainingChars.explanation} characters remaining
        </Text>
        {errors.explanation && (
          <Text style={styles.errorText}>{errors.explanation}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.addQuestionButton,
          loading && styles.addQuestionButtonDisabled,
        ]}
        onPress={handleAddQuestion}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <Text style={styles.addQuestionButtonText}>Add Question</Text>
          </>
        )}
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: "#003333",
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#003333",
  },
  enhancedInput: {
    backgroundColor: "#F8F9FA",
  },

  categoryContainer: {
    zIndex: 3000,
    marginBottom: 15,
  },
  imageSection: {
    marginVertical: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    color: "#1a2151",
    marginRight: 8,
  },

  dropdown: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#003333",
    backgroundColor: COLORS.light,
    borderRadius: 8,
  },

  dropdownPlaceholder: {
    color: "#6B7280",
    fontSize: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: "#1F2937",
  },
  inputContainer: {
    marginBottom: 16,
  },

  input: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
    borderWidth: 1,
    borderColor: "#003333",
    elevation: 3,
    fontWeight: "bold",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  errorInput: {
    borderColor: "#FF4444",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
    marginTop: 4,
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#003333",
    borderRadius: 8,
  },
  imageUploadText: {
    marginLeft: 8,
    color: "#003333",
    fontSize: 16,
  },

  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  correctAnswerButton: {
    padding: 8,
    marginLeft: 8,
  },
  correctAnswerButtonActive: {
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
  },
  removeOptionButton: {
    padding: 8,
    marginLeft: 4,
  },
  addOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginBottom: 16,
  },
  addOptionText: {
    marginLeft: 8,
    color: "#1a2151",
    fontSize: 16,
  },

  addQuestionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003333",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addQuestionButtonDisabled: {
    opacity: 0.6,
  },
  addQuestionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  galleryButton: {
    borderColor: "#1a2151",
    backgroundColor: "#F8F9FA",
  },

  imageButtonText: {
    marginLeft: 8,
    color: "#1a2151",
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a2151",
  },
  closeButton: {
    padding: 4,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: "#1a2151",
  },
  categoryChipText: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
  },
  imageGrid: {
    flex: 1,
  },
  imageGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 4,
  },
  imageGridItem: {
    width: "48%",
    aspectRatio: 16 / 9,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  selectedImageItem: {
    borderWidth: 2,
    borderColor: "#1a2151",
  },
  imageThumbnail: {
    width: "100%",
    height: "100%",
  },

  imageSection: {
    marginVertical: 16,
  },
  loader: {
    marginVertical: 20,
  },
  imageScrollView: {
    marginBottom: 16,
  },
  imageScrollContent: {
    paddingHorizontal: 4,
  },
  imageOption: {
    width: 120,
    height: 80,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedImageOption: {
    borderColor: "#1a2151",
    borderWidth: 2,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 33, 81, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    width: 120,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#1a2151",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#F8F9FA",
  },
  uploadButtonText: {
    color: "#1a2151",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  imagePreviewContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default QuestionComponent;
