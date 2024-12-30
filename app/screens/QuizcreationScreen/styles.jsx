import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const COLORS = {
  primary: "#1a2151",
  secondary: "#FF6B6B",
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#FF5252",
  info: "#2196F3",
  light: "#f8f9fa",
  white: "#FFFFFF",
  dark: "#333333",
  grey: "#666666",
  lightGrey: "#f0f0f0",
  transparent: "transparent",
  gradientStart: "#1a2151",
  gradientEnd: "#2A3990",
};

export const FONTS = {
  regular: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  medium: Platform.OS === "ios" ? "SF Pro Text-Medium" : "Roboto-Medium",
  bold: Platform.OS === "ios" ? "SF Pro Text-Bold" : "Roboto-Bold",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "#003333",
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: `${COLORS.white}99`,
    fontFamily: FONTS.regular,
  },
  content: {
    flex: 1,
    padding: 20,
  },
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: "#003333",
  },
  sectionIcon: {
    marginRight: 8,
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
    height: 120,
    textAlignVertical: "top",
  },
  dropdown: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#003333",
    backgroundColor: COLORS.light,
    borderRadius: 12,
  },
  dropdownText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.light,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#003333",
  },
  imageButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#003333",
    fontFamily: FONTS.medium,
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  questionItem: {
    backgroundColor: COLORS.light,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  questionNumber: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.grey,
    marginBottom: 4,
  },
  questionText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  questionForm: {
    marginTop: 16,
  },
  optionInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.light,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    overflow: "hidden",
  },
  optionNumber: {
    width: 40,
    height: "100%",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  optionNumberText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  optionTextInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  settingText: {
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: FONTS.regular,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  saveButton: {
    backgroundColor: "#003333",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: 50,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginLeft: 8,
  },
  accessCodeContainer: {
    marginTop: 16,
  },
  accessCodeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  accessCodeTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    marginLeft: 8,
  },
  accessCodeInput: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  tag: {
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginRight: 4,
  },
  previewButton: {
    position: "absolute",
    right: 20,
    bottom: 90,
    backgroundColor: COLORS.white,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightGrey,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: "#003333",
  },
  stepNumber: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  questionTypes: {
    paddingVertical: 12,
  },
  typeButton: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: COLORS.light,
    alignItems: "center",
    minWidth: 100,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  coverImageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  enhancedDropdown: {
    borderWidth: 0,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },

  questionTypeContainer: {
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  correctAnswerButton: {
    marginLeft: 10,
    padding: 5,
  },
  correctAnswerButtonActive: {
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
  },
  addQuestionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003333",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  addQuestionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  questionsList: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  questionsListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a2151",
  },
  questionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  questionItemText: {
    flex: 1,
    marginRight: 10,
    fontSize: 14,
    color: "#1a2151",
  },

  // Settings styles
  settingsGrid: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  settingLabel: {
    fontSize: 16,
    color: "#003333",
  },
  scoringSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#003333",
  },
  scoreInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreInput: {
    width: 80,
    textAlign: "center",
    marginLeft: 10,
  },
  accessSection: {
    marginTop: 20,
  },
  accessControl: {
    marginTop: 10,
  },

  // Fix for dropdown overlap issues
  dropdownContainer: {
    zIndex: 1000,
    elevation: Platform.OS === "android" ? 1000 : 0,
  },
  dropdownListContainer: {
    maxHeight: 200,
  },

  enhancedInput: {
    backgroundColor: "#F8F9FA",
  },

  categoryContainer: {
    zIndex: 3000,
    marginBottom: 15,
  },
  difficultyTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 2000,
  },
  halfWidth: {
    width: "48%",
  },
  passwordInput: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "100%",
  },
  imageButtonWithPreview: {
    marginBottom: 10,
  },

  tagsInput: {
    marginTop: 15,
  },

  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: "center",
    /* height: 50, */
  },
  previousButton: {
    backgroundColor: "#6B7280",
    maxHeight: 50,
  },
  nextButton: {
    backgroundColor: "#003333",
    maxHeight: 50,
  },

  navButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  imageSection: {
    marginVertical: 10,
  },
  questionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  questionThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  questionActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#F3F4F6",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#FEE2E2",
  },

  imagePreviewContainer: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    backgroundColor: "#f3f4f6",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
export default styles;
