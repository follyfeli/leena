import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Switch,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, storage } from "@/service/firebase/firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { MotiView, AnimatePresence } from "moti";
import QuestionComponent from "@/components/QuestionComponent";
import PricingSection from "@/components/PricingSection";
import styles from "./styles";
import {
  QUIZ_CATEGORIES,
  DIFFICULTY_LEVELS,
  QUIZ_TYPES,
  TIME_LIMITS,
  SCORING_SETTINGS,
} from "@/components/QuizConstance";
import { saveQuizWithImages } from "@/components/imageUploadUtils";

const QuizCreationScreen = ({ navigation }) => {
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const [coverImage, setCoverImage] = useState(null);
  const [questionImage, setQuestionImage] = useState({});
  const totalSteps = 5;
  const [isSaving, setIsSaving] = useState(false);

  // Enhanced state management
  const [quizState, setQuizState] = useState({
    basicInfo: {
      title: "",
      description: "",
      category: null,
      subCategory: null,
      difficulty: "intermediate",
      timeLimit: TIME_LIMITS[2].duration, // Default to standard 15min
      coverImage: null,
      tags: [],
    },
    targetingInfo: {
      audience: "",
      businessGoal: "",
      learningObjectives: [],
      prerequisites: [],
    },
    questions: [],
    settings: {
      shuffleQuestions: true,
      showExplanations: true,
      allowRetake: true,
      passingScore: 70,
      certificateEnabled: false,
      analyticsEnabled: true,
      socialSharing: true,
      accessControl: "public",
      showProgressBar: true,
      allowSkip: false,
      showTimer: true,
      requireEvidence: false,
    },
    pricing: {
      enabled: false,
      price: "",
      description: "",
      features: [],
      imageUrl: null,
    },
  });

  // Dropdown states
  const [dropdownStates, setDropdownStates] = useState({
    category: false,
    subCategory: false,
    difficulty: false,
    timeLimit: false,
    questionType: false,
  });

  // Question creation state
  const [currentQuestion, setCurrentQuestion] = useState({
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    points: SCORING_SETTINGS.defaultPointsPerQuestion,
    hints: [],
    attachments: [],
    tags: [],
    difficulty: "intermediate",
    estimatedTime: 60, // seconds
  });

  // Preview mode
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    await requestPermissions();
  };

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need access to your media library for uploading images."
        );
      }
    }
  };

  const handleStepChange = (step) => {
    if (validateCurrentStep()) {
      setCurrentStep(step);
    }
  };

  // renderTargetingInfo component
  const renderTargetingInfo = () => (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.section}
    >
      <Text style={styles.sectionTitle}>
        <Ionicons name="people" size={24} style={styles.sectionIcon} />
        Target Audience & Goals
      </Text>

      <TextInput
        style={[styles.input, styles.enhancedInput]}
        placeholder="Who is this quiz designed for?"
        value={quizState.targetingInfo.audience}
        onChangeText={(text) =>
          setQuizState({
            ...quizState,
            targetingInfo: { ...quizState.targetingInfo, audience: text },
          })
        }
      />

      <TextInput
        style={[styles.input, styles.textArea, styles.enhancedInput]}
        placeholder="What business goal does this quiz address?"
        value={quizState.targetingInfo.businessGoal}
        onChangeText={(text) =>
          setQuizState({
            ...quizState,
            targetingInfo: { ...quizState.targetingInfo, businessGoal: text },
          })
        }
        multiline
        numberOfLines={4}
      />

      <Text style={[styles.sectionTitle, { fontSize: 16, marginTop: 20 }]}>
        Learning Objectives
      </Text>
      <TextInput
        style={[styles.input, styles.enhancedInput]}
        placeholder="Add learning objective (press Enter to add)"
        onSubmitEditing={(event) => {
          const objective = event.nativeEvent.text.trim();
          if (
            objective &&
            !quizState.targetingInfo.learningObjectives.includes(objective)
          ) {
            setQuizState({
              ...quizState,
              targetingInfo: {
                ...quizState.targetingInfo,
                learningObjectives: [
                  ...quizState.targetingInfo.learningObjectives,
                  objective,
                ],
              },
            });
          }
          event.target.value = "";
        }}
      />

      <View style={styles.tagContainer}>
        {quizState.targetingInfo.learningObjectives.map((objective, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{objective}</Text>
            <TouchableOpacity
              onPress={() => {
                const newObjectives =
                  quizState.targetingInfo.learningObjectives.filter(
                    (_, i) => i !== index
                  );
                setQuizState({
                  ...quizState,
                  targetingInfo: {
                    ...quizState.targetingInfo,
                    learningObjectives: newObjectives,
                  },
                });
              }}
            >
              <Ionicons name="close-circle" size={16} color="#1a2151" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </MotiView>
  );
  const renderSettings = () => (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.section}
    >
      <Text style={styles.sectionTitle}>
        <Ionicons name="settings" size={24} style={styles.sectionIcon} />
        Quiz Settings
      </Text>

      <View style={styles.settingsGrid}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Shuffle Questions</Text>
          <Switch
            value={quizState.settings.shuffleQuestions}
            onValueChange={(value) =>
              setQuizState({
                ...quizState,
                settings: { ...quizState.settings, shuffleQuestions: value },
              })
            }
            trackColor={{ false: "#E0E0E0", true: "#1a2151" }}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Show Explanations</Text>
          <Switch
            value={quizState.settings.showExplanations}
            onValueChange={(value) =>
              setQuizState({
                ...quizState,
                settings: { ...quizState.settings, showExplanations: value },
              })
            }
            trackColor={{ false: "#E0E0E0", true: "#1a2151" }}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Allow Retake</Text>
          <Switch
            value={quizState.settings.allowRetake}
            onValueChange={(value) =>
              setQuizState({
                ...quizState,
                settings: { ...quizState.settings, allowRetake: value },
              })
            }
            trackColor={{ false: "#E0E0E0", true: "#1a2151" }}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Show Timer</Text>
          <Switch
            value={quizState.settings.showTimer}
            onValueChange={(value) =>
              setQuizState({
                ...quizState,
                settings: { ...quizState.settings, showTimer: value },
              })
            }
            trackColor={{ false: "#E0E0E0", true: "#1a2151" }}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Allow Skip</Text>
          <Switch
            value={quizState.settings.allowSkip}
            onValueChange={(value) =>
              setQuizState({
                ...quizState,
                settings: { ...quizState.settings, allowSkip: value },
              })
            }
            trackColor={{ false: "#E0E0E0", true: "#1a2151" }}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Certificate</Text>
          <Switch
            value={quizState.settings.certificateEnabled}
            onValueChange={(value) =>
              setQuizState({
                ...quizState,
                settings: { ...quizState.settings, certificateEnabled: value },
              })
            }
            trackColor={{ false: "#E0E0E0", true: "#1a2151" }}
          />
        </View>
      </View>

      <View style={styles.scoringSection}>
        <Text style={styles.subsectionTitle}>Scoring Settings</Text>

        <View style={styles.scoreInputContainer}>
          <Text style={styles.settingLabel}>Passing Score (%)</Text>
          <TextInput
            style={[styles.input, styles.enhancedInput, styles.scoreInput]}
            keyboardType="numeric"
            value={quizState.settings.passingScore.toString()}
            onChangeText={(text) => {
              const score = parseInt(text) || 0;
              setQuizState({
                ...quizState,
                settings: {
                  ...quizState.settings,
                  passingScore: Math.min(100, Math.max(0, score)),
                },
              });
            }}
            maxLength={3}
          />
        </View>
      </View>

      <View style={styles.accessSection}>
        <Text style={styles.subsectionTitle}>Access Control</Text>
        <View style={[styles.halfWidth, { zIndex: 1000 }]}>
          <DropDownPicker
            open={dropdownStates.accessControl}
            value={quizState.settings.accessControl}
            items={[
              { label: "Public", value: "public" },
              { label: "Private", value: "private" },
              { label: "Password Protected", value: "password" },
            ]}
            setOpen={(open) =>
              setDropdownStates({ ...dropdownStates, accessControl: open })
            }
            setValue={(callback) =>
              setQuizState({
                ...quizState,
                settings: {
                  ...quizState.settings,
                  accessControl: callback(quizState.settings.accessControl),
                },
              })
            }
            style={[styles.dropdown, styles.enhancedDropdown]}
            placeholder="Select Access Level"
          />
        </View>
      </View>
    </MotiView>
  );

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (
          !quizState.basicInfo.title?.trim() ||
          !quizState.basicInfo.category
        ) {
          Alert.alert(
            "Required Fields",
            "Please fill in the quiz title and category."
          );
          return false;
        }
        break;
      case 2:
        if (
          !quizState.targetingInfo.audience?.trim() ||
          !quizState.targetingInfo.businessGoal?.trim()
        ) {
          Alert.alert(
            "Required Fields",
            "Please specify target audience and business goal."
          );
          return false;
        }
        break;
      case 3:
        // Check if there are any questions
        if (!quizState.questions || quizState.questions.length === 0) {
          Alert.alert(
            "Questions Required",
            "Please add at least one question."
          );
          return false;
        }

        // Validate each question
        const invalidQuestion = quizState.questions.find(
          (q) =>
            !q.question?.trim() ||
            !q.type ||
            q.options.some((opt) => !opt.trim()) ||
            q.correctAnswer === null
        );

        if (invalidQuestion) {
          Alert.alert(
            "Invalid Questions",
            "Please ensure all questions have content, type, options, and correct answers selected."
          );
          return false;
        }
        break;
    }
    return true;
  };

  const addQuestion = () => {
    // Validate that required fields are filled
    if (!currentQuestion.question?.trim()) {
      Alert.alert("Required Fields", "Please enter a question");
      return;
    }

    if (!currentQuestion.type) {
      Alert.alert("Required Fields", "Please select a question type");
      return;
    }

    if (currentQuestion.options.some((option) => !option.trim())) {
      Alert.alert("Required Fields", "Please fill in all options");
      return;
    }

    if (currentQuestion.correctAnswer === null) {
      Alert.alert("Required Fields", "Please select a correct answer");
      return;
    }

    // Add the current question to the quiz state
    setQuizState((prevState) => ({
      ...prevState,
      questions: [...prevState.questions, { ...currentQuestion }],
    }));

    // Reset the current question form for the next entry
    setCurrentQuestion({
      type: "",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: null,
      explanation: "",
      backgroundImage: null,
    });

    // Reset the question image state in QuestionComponent
    if (setQuestionImage) {
      setQuestionImage(null);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setCoverImage(selectedImage.uri); // Set only the URI
      }
    } catch (error) {
      console.error("Image pick error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadQuizImage = async () => {
    if (!coverImage) return null;

    try {
      const response = await fetch(coverImage);
      const blob = await response.blob();
      const imageName = `quiz-covers/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}`;
      const imageRef = ref(storage, imageName);

      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("Image upload error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      throw new Error("Failed to upload image: " + error.message);
    }
  };

  const saveQuiz = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      console.log("Starting quiz save...");
      console.log("Current quiz state:", JSON.stringify(quizState, null, 2));
      console.log("Questions:", quizState.questions);
      console.log("Cover image:", coverImage);

      // Validate basic info
      if (!quizState.basicInfo.title?.trim() || !quizState.basicInfo.category) {
        Alert.alert("Error", "Please fill in the quiz title and category");
        return;
      }

      // Validate questions and their images
      if (!quizState.questions || quizState.questions.length === 0) {
        Alert.alert("Error", "Please add at least one question");
        return;
      }

      // Additional validation for questions
      const questionValidation = quizState.questions.every((q, index) => {
        console.log(`Question ${index + 1}:`, q);
        console.log(
          `Question ${index + 1} background image:`,
          q.backgroundImage
        );

        if (!q.question?.trim()) {
          Alert.alert("Error", `Question ${index + 1} is empty`);
          return false;
        }
        return true;
      });

      if (!questionValidation) {
        return;
      }

      console.log("Starting saveQuizWithImages...");
      // Save quiz with all images
      const quizData = await saveQuizWithImages(quizState, coverImage);
      console.log("Quiz data after save:", quizData);

      // Add to Firestore
      const docRef = await addDoc(collection(db, "quizzes"), quizData);
      console.log("Document written with ID: ", docRef.id);

      Alert.alert("Success", "Quiz created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Save quiz error:", error);
      Alert.alert("Error", "Failed to save quiz: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepIndicator = () => (
    <MotiView style={styles.stepIndicator}>
      {[...Array(totalSteps)].map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleStepChange(index + 1)}
          style={[
            styles.stepDot,
            currentStep === index + 1 && styles.stepDotActive,
          ]}
        >
          <Text style={styles.stepNumber}>{index + 1}</Text>
        </TouchableOpacity>
      ))}
    </MotiView>
  );

  const renderBasicInfo = () => (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.section}
    >
      <Text style={styles.sectionTitle}>
        <Ionicons
          name="information-circle"
          size={24}
          style={styles.sectionIcon}
        />
        Basic Information
      </Text>

      <TextInput
        style={[styles.input, styles.enhancedInput]}
        placeholder="Create an engaging quiz title..."
        value={quizState.basicInfo.title}
        onChangeText={(text) =>
          setQuizState({
            ...quizState,
            basicInfo: { ...quizState.basicInfo, title: text },
          })
        }
        maxLength={100}
      />

      <TextInput
        style={[styles.input, styles.textArea, styles.enhancedInput]}
        placeholder="Describe what participants will learn..."
        value={quizState.basicInfo.description}
        onChangeText={(text) =>
          setQuizState({
            ...quizState,
            basicInfo: { ...quizState.basicInfo, description: text },
          })
        }
        multiline
        numberOfLines={4}
      />

      <View style={styles.imageUploadContainer}>
        <TouchableOpacity
          style={[
            styles.imageButton,
            quizState.basicInfo.coverImage && styles.imageButtonWithPreview,
          ]}
          onPress={pickImage}
        >
          <Ionicons name="cloud-upload-outline" size={24} color={"#1a2151"} />
          <Text style={styles.imageButtonText}>
            {quizState.basicInfo.coverImage
              ? "Change Cover Image"
              : "Upload Cover Image"}
          </Text>
        </TouchableOpacity>

        {coverImage && (
          <Image source={{ uri: coverImage }} style={styles.coverImage} />
        )}
      </View>

      <View style={styles.categoryContainer}>
        <DropDownPicker
          open={dropdownStates.category}
          value={quizState.basicInfo.category}
          items={QUIZ_CATEGORIES.map((cat) => ({
            label: cat.name,
            value: cat.id,
            icon: () => <Text>{cat.icon}</Text>,
          }))}
          setOpen={(open) =>
            setDropdownStates({ ...dropdownStates, category: open })
          }
          setValue={(callback) =>
            setQuizState({
              ...quizState,
              basicInfo: {
                ...quizState.basicInfo,
                category: callback(quizState.basicInfo.category),
              },
            })
          }
          style={[styles.dropdown, styles.enhancedDropdown]}
          placeholder="Select Category"
        />
      </View>

      <View style={styles.difficultyTimeContainer}>
        <View style={styles.halfWidth}>
          <DropDownPicker
            open={dropdownStates.difficulty}
            value={quizState.basicInfo.difficulty}
            items={DIFFICULTY_LEVELS.map((level) => ({
              label: level.name,
              value: level.id,
            }))}
            setOpen={(open) =>
              setDropdownStates({ ...dropdownStates, difficulty: open })
            }
            setValue={(callback) =>
              setQuizState({
                ...quizState,
                basicInfo: {
                  ...quizState.basicInfo,
                  difficulty: callback(quizState.basicInfo.difficulty),
                },
              })
            }
            style={[styles.dropdown, styles.enhancedDropdown]}
            placeholder="Select Difficulty"
          />
        </View>

        <View style={styles.halfWidth}>
          <DropDownPicker
            open={dropdownStates.timeLimit}
            value={quizState.basicInfo.timeLimit}
            items={TIME_LIMITS.map((time) => ({
              label: time.name,
              value: time.duration,
            }))}
            setOpen={(open) =>
              setDropdownStates({ ...dropdownStates, timeLimit: open })
            }
            setValue={(callback) =>
              setQuizState({
                ...quizState,
                basicInfo: {
                  ...quizState.basicInfo,
                  timeLimit: callback(quizState.basicInfo.timeLimit),
                },
              })
            }
            style={[styles.dropdown, styles.enhancedDropdown]}
            placeholder="Select Time Limit"
          />
        </View>
      </View>

      <View style={styles.tagsInput}>
        <TextInput
          style={[styles.input, styles.enhancedInput]}
          placeholder="Add tags (press Enter to add)"
          onSubmitEditing={(event) => {
            const tag = event.nativeEvent.text.trim();
            if (tag && !quizState.basicInfo.tags.includes(tag)) {
              setQuizState({
                ...quizState,
                basicInfo: {
                  ...quizState.basicInfo,
                  tags: [...quizState.basicInfo.tags, tag],
                },
              });
            }
            event.target.value = "";
          }}
        />
        <View style={styles.tagContainer}>
          {quizState.basicInfo.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity
                onPress={() => {
                  const newTags = quizState.basicInfo.tags.filter(
                    (_, i) => i !== index
                  );
                  setQuizState({
                    ...quizState,
                    basicInfo: { ...quizState.basicInfo, tags: newTags },
                  });
                }}
              >
                <Ionicons name="close-circle" size={16} color={"#1a2151"} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </MotiView>
  );

  const [settings, setSettings] = useState({
    shuffleQuestions: false,
    showExplanations: true,
    allowRetake: true,
    passingScore: 70,
    certificateEnabled: false,
    analyticsEnabled: true,
    socialSharing: true,
    accessControl: "public",
  });

  useEffect(() => {
    requestImagePermissions();
  }, []);

  const requestImagePermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Sorry, we need camera roll permissions to upload images."
        );
      }
    }
  };

  const renderQuestions = () => (
    <>
      <QuestionComponent
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        addQuestion={addQuestion}
        quizState={quizState}
        dropdownStates={dropdownStates}
        setDropdownStates={setDropdownStates}
      />
      <View style={styles.questionsList}>
        {quizState.questions.length > 0 && (
          <>
            <Text style={styles.questionsListTitle}>Added Questions:</Text>
            {quizState.questions.map((question, index) => (
              <View key={`question-${index}`} style={styles.questionItem}>
                <View style={styles.questionContent}>
                  <Text style={styles.questionItemText} numberOfLines={2}>
                    {index + 1}. {question.question}
                  </Text>
                  {question.backgroundImage && (
                    <Image
                      source={{ uri: question.backgroundImage }}
                      style={styles.questionThumbnail}
                    />
                  )}
                </View>
                <View style={styles.questionActions}>
                  <TouchableOpacity
                    onPress={() => {
                      // Edit functionality
                      setCurrentQuestion({ ...question });
                      const newQuestions = quizState.questions.filter(
                        (_, i) => i !== index
                      );
                      setQuizState((prevState) => ({
                        ...prevState,
                        questions: newQuestions,
                      }));
                    }}
                    style={styles.editButton}
                  >
                    <Ionicons name="pencil" size={20} color="#4B5563" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Delete Question",
                        "Are you sure you want to delete this question?",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => {
                              const newQuestions = quizState.questions.filter(
                                (_, i) => i !== index
                              );
                              setQuizState((prevState) => ({
                                ...prevState,
                                questions: newQuestions,
                              }));
                            },
                          },
                        ]
                      );
                    }}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-bin" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {previewMode && (
        <QuizPreview quiz={quizState} onClose={() => setPreviewMode(false)} />
      )}
      <LinearGradient colors={["#1a2151", "#2A3990"]} style={styles.header}>
        <Text style={styles.headerTitle}>Create Quiz</Text>
        <Text style={styles.headerSubtitle}>
          Step {currentStep} of {totalSteps}
        </Text>
      </LinearGradient>

      {renderStepIndicator()}

      <ScrollView style={styles.content}>
        <AnimatePresence>
          {currentStep === 1 && renderBasicInfo()}
          {currentStep === 2 && renderTargetingInfo()}
          {currentStep === 3 && renderQuestions()}
          {currentStep === 4 && (
            <PricingSection quizState={quizState} setQuizState={setQuizState} />
          )}
          {currentStep === 5 && renderSettings()}
        </AnimatePresence>
      </ScrollView>

      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.previousButton]}
            onPress={() => handleStepChange(currentStep - 1)}
          >
            <Ionicons name="arrow-back" size={24} color={"#FFFFFF"} />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}

        {currentStep < totalSteps ? (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={() => handleStepChange(currentStep + 1)}
          >
            <Text style={styles.navButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={24} color={"#FFFFFF"} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.saveButton,
              isSaving && styles.saveButtonDisabled,
            ]}
            onPress={saveQuiz}
            disabled={isSaving}
          >
            <Text style={styles.navButtonText}>
              {isSaving ? "Creating Quiz..." : "Create Quiz"}
            </Text>
            <Ionicons
              name={isSaving ? "hourglass" : "checkmark-circle"}
              size={24}
              color={"#FFFFFF"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Preview Button */}
      <TouchableOpacity
        style={styles.previewButton}
        onPress={() => setPreviewMode(!previewMode)}
      >
        <Ionicons
          name={previewMode ? "eye-off" : "eye"}
          size={24}
          color={"#1a2151"}
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default QuizCreationScreen;

const QuizPreview = ({ quiz, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  if (error) {
    return (
      <View
        style={[previewStyles.previewContainer, previewStyles.previewError]}
      >
        <Text style={previewStyles.previewErrorText}>{error}</Text>
        <TouchableOpacity
          style={previewStyles.previewErrorButton}
          onPress={onClose}
        >
          <Text style={previewStyles.previewErrorButtonText}>
            Close Preview
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <View
        style={[previewStyles.previewContainer, previewStyles.previewLoading]}
      >
        <ActivityIndicator size="large" color="#1a2151" />
      </View>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <View
        style={[previewStyles.previewContainer, previewStyles.previewEmpty]}
      >
        <Text style={styles.previewEmptyText}>
          No questions added yet. Add some questions to preview your quiz.
        </Text>
        <TouchableOpacity
          style={previewStyles.previewEmptyButton}
          onPress={onClose}
        >
          <Text style={previewStyles.previewEmptyButtonText}>
            Add Questions
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={previewStyles.previewContainer}
    >
      <ScrollView style={previewStyles.previewScroll}>
        <View style={previewStyles.previewHeader}>
          <Text style={previewStyles.previewTitle}>{quiz.basicInfo.title}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={previewStyles.previewClose}
          >
            <Ionicons name="close" size={24} color="#1a2151" />
          </TouchableOpacity>
        </View>

        {quiz.basicInfo.coverImage && (
          <Image
            source={{ uri: quiz.basicInfo.coverImage }}
            style={previewStyles.previewCoverImage}
          />
        )}

        <View style={previewStyles.previewSection}>
          <Text style={previewStyles.previewSectionTitle}>Quiz Details</Text>
          <Text style={previewStyles.previewDescription}>
            {quiz.basicInfo.description}
          </Text>
          <View style={previewStyles.previewMeta}>
            <Text>Category: {quiz.basicInfo.category}</Text>
            <Text>Difficulty: {quiz.basicInfo.difficulty}</Text>
            <Text>Time Limit: {quiz.basicInfo.timeLimit} minutes</Text>
          </View>
        </View>

        <View style={previewStyles.previewSection}>
          <Text style={previewStyles.previewSectionTitle}>Questions</Text>
          {quiz.questions.map((question, index) => (
            <View key={index} style={previewStyles.previewQuestion}>
              <Text style={previewStyles.previewQuestionText}>
                {index + 1}. {question.question}
              </Text>
              {question.options.map((option, optIndex) => (
                <View
                  key={optIndex}
                  style={[
                    previewStyles.previewOption,
                    question.correctAnswer === optIndex &&
                      previewStyles.previewCorrectOption,
                  ]}
                >
                  <Text style={previewStyles.previewOptionText}>{option}</Text>
                </View>
              ))}
              {question.explanation && (
                <Text style={previewStyles.previewExplanation}>
                  Explanation: {question.explanation}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </MotiView>
  );
};

// Add these styles
const previewStyles = {
  previewContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  previewScroll: {
    flex: 1,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a2151",
  },
  previewClose: {
    padding: 8,
  },
  previewCoverImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  previewSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  previewSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1a2151",
  },
  previewDescription: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 12,
  },
  previewMeta: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
  },
  previewQuestion: {
    marginBottom: 24,
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 8,
  },
  previewQuestionText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 12,
    color: "#1f2937",
  },
  previewOption: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
  },
  previewCorrectOption: {
    borderColor: "#10b981",
    backgroundColor: "#d1fae5",
  },
  previewOptionText: {
    fontSize: 16,
    color: "#374151",
  },
  previewExplanation: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fff",
    borderLeftWidth: 4,
    borderLeftColor: "#60a5fa",
    fontStyle: "italic",
  },
};

// Add these to your existing styles
const additionalStyles = {
  previewButton: {
    position: "absolute",
    right: 16,
    bottom: 80,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewButtonActive: {
    backgroundColor: "#1a2151",
  },
  previewButtonText: {
    marginLeft: 8,
    color: "#1a2151",
    fontWeight: "500",
  },
  previewButtonTextActive: {
    color: "#fff",
  },
};
