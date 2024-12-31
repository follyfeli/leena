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
  KeyboardAvoidingView,
} from "react-native";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db } from "@/service/firebase/firebaseconfig";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { MotiView, AnimatePresence } from "moti";
import QuestionComponent from "@/components/QuestionComponent";
import { StatusBar } from "expo-status-bar";
import RenderSettings from "@/components/RenderSettings";
import styles from "../../screens/QuizcreationScreen/styles";
import { saveQuizWithImages } from "@/components/imageUploadUtils";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/i18n";

const QuizcreationScreen = ({ navigation }) => {
  const router = useRouter();
  // Step tracking
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [coverImage, setCoverImage] = useState(null);
  const totalSteps = 4;
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const userId = user?.uid;

  const handleBack = () => {
    router.push("/profile");
  };

  const QUIZ_CATEGORIES = [
    {
      id: "education",
      name: t("quizCategoryEducation"),
      icon: "📚",
    },
    { id: "mathematics", name: t("quizCategoryMathematics"), icon: "🔢" },
    { id: "science", name: t("quizCategoryScience"), icon: "🧬" },
    { id: "literature", name: t("quizCategoryLiterature"), icon: "📖" },
    { id: "history", name: t("quizCategoryHistory"), icon: "🏛️" },
    { id: "geography", name: t("quizCategoryGeography"), icon: "🌍" },
    { id: "languages", name: t("quizCategoryLanguages"), icon: "🗣️" },
    {
      id: "professional",
      name: t("quizCategoryProfessional"),
      icon: "💼",
    },
    {
      id: "business-skills",
      name: t("quizCategoryBusinessSkills"),
      icon: "📊",
    },
    { id: "technology", name: t("quizCategoryTechnology"), icon: "💻" },
    { id: "leadership", name: t("quizCategoryLeadership"), icon: "👥" },
    { id: "marketing", name: t("quizCategoryMarketing"), icon: "📱" },
    { id: "finance", name: t("quizCategoryFinance"), icon: "💰" },
    { id: "hr", name: t("quizCategoryHR"), icon: "🤝" },
    {
      id: "entertainment",
      name: t("quizCategoryEntertainment"),
      icon: "🎮",
    },
    { id: "movies", name: t("quizCategoryMovies"), icon: "🎬" },
    { id: "music", name: t("quizCategoryMusic"), icon: "🎵" },
    { id: "sports", name: t("quizCategorySports"), icon: "⚽" },
    { id: "gaming", name: t("quizCategoryGaming"), icon: "🎮" },
    { id: "pop-culture", name: t("quizCategoryPopCulture"), icon: "🌟" },
    {
      id: "business-marketing",
      name: t("quizCategoryBusinessMarketing"),
      icon: "💡",
    },
    {
      id: "market-research",
      name: t("quizCategoryMarketResearch"),
      icon: "📊",
    },
    {
      id: "customer-feedback",
      name: t("quizCategoryCustomerFeedback"),
      icon: "📝",
    },
    {
      id: "product-knowledge",
      name: t("quizCategoryProductKnowledge"),
      icon: "📦",
    },
    { id: "sales-training", name: t("quizCategorySalesTraining"), icon: "💰" },
    {
      id: "personal-dev",
      name: t("quizCategoryPersonalDev"),
      icon: "🌱",
    },
    {
      id: "self-improvement",
      name: t("quizCategorySelfImprovement"),
      icon: "🎯",
    },
    {
      id: "health-wellness",
      name: t("quizCategoryHealthWellness"),
      icon: "🧘‍♀️",
    },
    { id: "productivity", name: t("quizCategoryProductivity"), icon: "⚡" },
    { id: "hobbies", name: "Hobbies 🎨", icon: "🎨" },
    {
      id: "corporate",
      name: t("quizCategoryCorporate"),
      icon: "🏢",
    },
    { id: "compliance", name: t("quizCategoryCompliance"), icon: "📋" },
    { id: "safety", name: t("quizCategorySafety"), icon: "🦺" },
    { id: "onboarding", name: t("quizCategoryOnboarding"), icon: "🚀" },
    { id: "team-building", name: t("quizCategoryTeamBuilding"), icon: "🤝" },
    {
      id: "certification",
      name: t("quizCategoryCertification"),
      icon: "📜",
    },
    { id: "it-cert", name: t("quizCategoryITCert"), icon: "💻" },
    {
      id: "professional-cert",
      name: t("quizCategoryProfessionalCert"),
      icon: "📚",
    },
    { id: "industry-cert", name: t("quizCategoryIndustryCert"), icon: "🏭" },

    { id: "vocabulary", name: t("quizCategoryVocabulary"), icon: "📖" },
    { id: "grammar", name: t("quizCategoryGrammar"), icon: "✏️" },
    { id: "conversation", name: t("quizCategoryConversation"), icon: "💬" },
    {
      id: "business-language",
      name: t("quizCategoryBusinessLanguage"),
      icon: "💼",
    },
  ];

  const DIFFICULTY_LEVELS = [
    { id: "beginner", name: t("difficultyBeginner"), color: "#4CAF50" },
    { id: "intermediate", name: t("difficultyIntermediate"), color: "#2196F3" },
    { id: "advanced", name: t("difficultyAdvanced"), color: "#FF6B6B" },
    { id: "expert", name: t("difficultyExpert"), color: "#9C27B0" },
  ];

  const TIME_LIMITS = [
    { id: "no-limit", name: t("timeLimitNoLimit"), duration: 0 },
    { id: "quick", name: t("timeLimitQuick"), duration: 300 },
    { id: "standard", name: t("timeLimitStandard"), duration: 900 },
    { id: "extended", name: t("timeLimitExtended"), duration: 1800 },
    { id: "comprehensive", name: t("timeLimitComprehensive"), duration: 3600 },
  ];

  const SCORING_SETTINGS = {
    defaultPointsPerQuestion: 10,
    passingScore: 70,
    bonusPoints: {
      speedBonus: 5,
      perfectScore: 20,
      streakBonus: 2,
    },
    penalties: {
      incorrectAttempt: -2,
      timeOverrun: -5,
      hintUsed: -1,
    },
  };

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
      socialSharing: true,
      accessControl: "public",
      allowSkip: false,
      showTimer: true,
      requireEvidence: false,
      password: "",
    },
    likes: 0,
    shares: 0,
    views: 0,
    comments: 0,
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
      <View style={styles.sectionHeader}>
        <Ionicons name="people" size={24} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>Target Audience & Goals</Text>
      </View>

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

  /* const renderSettings = () => (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.section}
    >
      <View style={styles.sectionHeader}>
        <Ionicons name="settings" size={24} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>Quiz Settings</Text>
      </View>

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
            trackColor={{ false: "#E0E0E0", true: "#FFA500" }}
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
            trackColor={{ false: "#E0E0E0", true: "#FFA500" }}
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
            trackColor={{ false: "#E0E0E0", true: "#FFA500" }}
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
            trackColor={{ false: "#E0E0E0", true: "#FFA500" }}
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
            trackColor={{ false: "#E0E0E0", true: "#FFA500" }}
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
            trackColor={{ false: "#E0E0E0", true: "#FFA500" }}
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
        {quizState.settings.accessControl === "private" && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ type: "spring", duration: 300 }}
            style={{ marginTop: 16, width: "100%" }}
          >
            <Text style={styles.settingLabel}>Password Protection</Text>
            <TextInput
              style={[styles.input, styles.enhancedInput, styles.passwordInput]}
              value={quizState.settings.password}
              onChangeText={(text) =>
                setQuizState({
                  ...quizState,
                  settings: { ...quizState.settings, password: text },
                })
              }
              placeholder="Enter password for private access"
              autoCapitalize="none"
            />
            <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              Password is required for private quizzes
            </Text>
          </MotiView>
        )}
      </View>
    </MotiView>
  );
 */
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
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        setCoverImage(selectedImage.uri);
      }
    } catch (error) {
      console.error("Image pick error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const saveQuiz = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Get current user ID

      if (!userId) {
        Alert.alert("Error", "You must be logged in to create a quiz");
        return;
      }

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

      // Validate access control and password
      if (quizState.settings.accessControl === "private") {
        if (
          !quizState.settings.password ||
          quizState.settings.password.trim() === ""
        ) {
          Alert.alert(
            "Error",
            "Password is required for private quizzes. Please set a password in the quiz settings."
          );
          return;
        }

        if (quizState.settings.password.length < 6) {
          Alert.alert("Error", "Password must be at least 6 characters long");
          return;
        }
      }

      // Additional validation for questions
      const questionValidation = quizState.questions.every((q, index) => {
        if (!q.question?.trim()) {
          Alert.alert("Error", `Question ${index + 1} is empty`);
          return false;
        }
        return true;
      });

      if (!questionValidation) {
        return;
      }

      // Get quiz data with images
      const quizData = await saveQuizWithImages(quizState, coverImage);

      // Add creator information and timestamps
      const enhancedQuizData = {
        ...quizData,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "quizzes"), enhancedQuizData);

      // Update the document with its own ID
      await updateDoc(doc(db, "quizzes", docRef.id), {
        quizId: docRef.id,
      });

      Alert.alert("Success", "Quiz created successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Error saving quiz:", error);
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
      <View style={styles.sectionHeader}>
        <Ionicons
          name="information-circle"
          size={24}
          style={styles.sectionIcon}
        />
        <Text style={styles.sectionTitle}>Basic Information</Text>
      </View>

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
          <Ionicons name="cloud-upload-outline" size={24} color={"#FFA500"} />
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
          listMode="MODAL"
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
          modalProps={{
            animationType: "fade",
            transparent: true,
            presentationStyle: "overFullScreen",
          }}
          modalContentContainerStyle={{
            backgroundColor: "white",
            borderRadius: 12,
            zIndex: 1000,
          }}
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
            modalProps={{
              animationType: "fade",
              transparent: true,
              presentationStyle: "overFullScreen",
            }}
            modalContentContainerStyle={{
              backgroundColor: "white",
              borderRadius: 12,
              zIndex: 1000,
            }}
            listMode="MODAL"
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
            listMode="MODAL"
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
      <StatusBar backgroundColor="#003333" barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.navigationHeader}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
              size={24}
              color="#FFA500"
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Quiz</Text>
        </View>

        <Text style={styles.headerSubtitle}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.content}>
        <AnimatePresence>
          {currentStep === 1 && renderBasicInfo()}
          {currentStep === 2 && renderTargetingInfo()}
          {currentStep === 3 &&
            renderQuestions({
              quizState,
              setQuizState,
              dropdownStates,
              setDropdownStates,
            })}
          {/* {currentStep === 4 && (
            <PricingSection quizState={quizState} setQuizState={setQuizState} />
          )} */}
          {/*   {currentStep === 4 && RenderSettings()} */}
          {currentStep === 4 && (
            <RenderSettings
              quizState={quizState}
              setQuizState={setQuizState}
              dropdownStates={dropdownStates}
              setDropdownStates={setDropdownStates}
            />
          )}
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
    </KeyboardAvoidingView>
  );
};

export default QuizcreationScreen;
