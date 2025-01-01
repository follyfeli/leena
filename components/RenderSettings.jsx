import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { MotiView } from "moti";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS, FONTS } from "../app/screens/QuizcreationScreen/styles";
import { useLanguage } from "@/i18n";
const RenderSettings = ({
  quizState,
  setQuizState,
  dropdownStates,
  setDropdownStates,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState(null);
  const { t } = useLanguage();
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");

    // Only update if a date was actually selected (user didn't cancel)
    if (event.type === "dismissed") {
      return;
    }

    if (selectedDate) {
      if (dateType === "start") {
        setQuizState({
          ...quizState,
          settings: { ...quizState.settings, startDate: selectedDate },
        });
      } else {
        setQuizState({
          ...quizState,
          settings: { ...quizState.settings, endDate: selectedDate },
        });
      }
      if (
        dateType === "end" &&
        updates.startDate &&
        selectedDate < updates.startDate
      ) {
        alert("End date must be after start date");
        return;
      }
      if (
        dateType === "start" &&
        updates.endDate &&
        selectedDate > updates.endDate
      ) {
        alert("Start date must be before end date");
        return;
      }

      onUpdateSchedule(updates);
    }
  };

  return (
    <ScrollView>
      <MotiView
        from={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={styles.section}
      >
        {/* Basic Settings */}
        <View style={styles.sectionHeader}>
          <Ionicons name="settings" size={24} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>{t("quizSettingsTitle")} </Text>
        </View>

        {/* Question Behavior */}
        <View style={styles.subsection}>
          <Text style={styles.subsectionTitle}>
            {t("quizSettingBehaviortitle")}{" "}
          </Text>
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("creationquestionshudule")}{" "}
              </Text>
              <Switch
                value={quizState.settings.shuffleQuestions}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: {
                      ...quizState.settings,
                      shuffleQuestions: value,
                    },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.shuffleQuestions ? "#003333" : "#f4f3f4"
                }
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("creationanswershudule")}{" "}
              </Text>
              <Switch
                value={quizState.settings.shuffleAnswers}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: { ...quizState.settings, shuffleAnswers: value },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.shuffleAnswers ? "#003333" : "#f4f3f4"
                }
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("creationshowexplain")}{" "}
              </Text>
              <Switch
                value={quizState.settings.showExplanations}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: {
                      ...quizState.settings,
                      showExplanations: value,
                    },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.showExplanations ? "#003333" : "#f4f3f4"
                }
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("creationallowretake")}{" "}
              </Text>
              <Switch
                value={quizState.settings.allowRetake}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: { ...quizState.settings, allowRetake: value },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.allowRetake ? "#003333" : "#f4f3f4"
                }
              />
            </View>

            {quizState.settings.allowRetake && (
              <View style={styles.settingSubItem}>
                <Text style={styles.settingLabel}>
                  {t("creationmaxretake")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.enhancedInput,
                    styles.numberInput,
                  ]}
                  keyboardType="numeric"
                  value={quizState.settings.maxRetakes?.toString()}
                  onChangeText={(text) =>
                    setQuizState({
                      ...quizState,
                      settings: {
                        ...quizState.settings,
                        maxRetakes: parseInt(text) || 0,
                      },
                    })
                  }
                  maxLength={2}
                />
              </View>
            )}

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t("creationshowtimer")} </Text>
              <Switch
                value={quizState.settings.showTimer}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: { ...quizState.settings, showTimer: value },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.showTimer ? "#003333" : "#f4f3f4"
                }
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t("creationallowskip")} </Text>
              <Switch
                value={quizState.settings.allowSkip}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: { ...quizState.settings, allowSkip: value },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.allowSkip ? "#003333" : "#f4f3f4"
                }
              />
            </View>
          </View>
        </View>

        {/* Feedback Settings */}
        <View style={styles.subsection}>
          <Text style={styles.subsectionTitle}>
            {" "}
            {t("feedbackSettingsTitle")}
          </Text>
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("creationshowimmediatefeedback")}
              </Text>
              <Switch
                value={quizState.settings.immediateAnswerFeedback}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: {
                      ...quizState.settings,
                      immediateAnswerFeedback: value,
                    },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.immediateAnswerFeedback
                    ? "#003333"
                    : "#f4f3f4"
                }
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("creationshowcorrectanswer")}
              </Text>
              <Switch
                value={quizState.settings.showCorrectAnswer}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: {
                      ...quizState.settings,
                      showCorrectAnswer: value,
                    },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.showCorrectAnswer ? "#003333" : "#f4f3f4"
                }
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("creationallowanswerreview")}
              </Text>
              <Switch
                value={quizState.settings.allowAnswerReview}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: {
                      ...quizState.settings,
                      allowAnswerReview: value,
                    },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.allowAnswerReview ? "#003333" : "#f4f3f4"
                }
              />
            </View>
          </View>
        </View>

        {/* Time Settings */}
        <View style={styles.subsection}>
          <Text style={styles.subsectionTitle}>{t("timeSettingsTitle")} </Text>
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("timesettingsenabled")}
              </Text>
              <Switch
                value={quizState.settings.timeLimitEnabled}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: {
                      ...quizState.settings,
                      timeLimitEnabled: value,
                    },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.timeLimitEnabled ? "#003333" : "#f4f3f4"
                }
              />
            </View>

            {quizState.settings.timeLimitEnabled && (
              <View style={styles.settingSubItem}>
                <Text style={styles.settingLabel}>{t("timelimite")} </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.enhancedInput,
                    styles.numberInput,
                  ]}
                  keyboardType="numeric"
                  value={quizState.settings.timeLimit?.toString()}
                  onChangeText={(text) =>
                    setQuizState({
                      ...quizState,
                      settings: {
                        ...quizState.settings,
                        timeLimit: parseInt(text) || 0,
                      },
                    })
                  }
                  maxLength={3}
                />
              </View>
            )}
          </View>
        </View>

        {/* Scoring Settings */}
        <View style={styles.scoringSection}>
          <Text style={styles.subsectionTitle}>
            {t("scoringSettingsTitle")}{" "}
          </Text>
          <View style={styles.settingsGrid}>
            <View style={styles.scoreInputContainer}>
              <Text style={styles.settingLabel}>
                {t("creationpassingscore")}{" "}
              </Text>
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

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("creationnegativemarking")}{" "}
              </Text>
              <Switch
                value={quizState.settings.negativeMarking}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: { ...quizState.settings, negativeMarking: value },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                thumbColor={
                  quizState.settings.negativeMarking ? "#003333" : "#f4f3f4"
                }
              />
            </View>

            {quizState.settings.negativeMarking && (
              <View style={styles.settingSubItem}>
                <Text style={styles.settingLabel}>Negative Points (%)</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.enhancedInput,
                    styles.numberInput,
                  ]}
                  keyboardType="numeric"
                  value={quizState.settings.negativePoints?.toString()}
                  onChangeText={(text) =>
                    setQuizState({
                      ...quizState,
                      settings: {
                        ...quizState.settings,
                        negativePoints: parseInt(text) || 0,
                      },
                    })
                  }
                  maxLength={2}
                />
              </View>
            )}
          </View>
        </View>

        {/* Certification Settings */}
        {/*  * <View style={styles.subsection}>
          <Text style={styles.subsectionTitle}>Certification</Text>
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Enable Certificate</Text>
              <Switch
                value={quizState.settings.certificateEnabled}
                onValueChange={(value) =>
                  setQuizState({
                    ...quizState,
                    settings: {
                      ...quizState.settings,
                      certificateEnabled: value,
                    },
                  })
                }
                trackColor={{ false: "#E0E0E0", true: "#FFA500" }}
              />
            </View>

             {quizState.settings.certificateEnabled && (
              <>
                <View
                  style={{
                    marginLeft: 20,
                    marginTop: 8,
                    width: "80%",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.settingLabel}>Certificate Title</Text>
                  <TextInput
                    style={[styles.input, styles.enhancedInput]}
                    value={quizState.settings.certificateTitle}
                    onChangeText={(text) =>
                      setQuizState({
                        ...quizState,
                        settings: {
                          ...quizState.settings,
                          certificateTitle: text,
                        },
                      })
                    }
                    placeholder="Enter certificate title"
                  />
                </View>
                <View style={styles.settingSubItem}>
                  <Text style={styles.settingLabel}>Certificate Message</Text>
                  <TextInput
                    style={[
                      styles.input,
                      styles.enhancedInput,
                      styles.textArea,
                    ]}
                    value={quizState.settings.certificateMessage}
                    onChangeText={(text) =>
                      setQuizState({
                        ...quizState,
                        settings: {
                          ...quizState.settings,
                          certificateMessage: text,
                        },
                      })
                    }
                    placeholder="Enter certificate message"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </>
            )} 
          </View>
        </View>/}

        {/* Access Control */}
        <View style={styles.accessSection}>
          <Text style={styles.subsectionTitle}>
            {t("accessControlSettingsTitle")}
          </Text>
          <View style={{ zIndex: 1000, marginBottom: 20 }}>
            <DropDownPicker
              open={dropdownStates.accessControl}
              value={quizState.settings.accessControl}
              items={[
                { label: t("accessControlPublic"), value: "public" },
                { label: t("accessControlPrivate"), value: "password" },
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
              labelStyle={{
                fontFamily: "Rubik-Regular",
                fontSize: 18,
                color: "#003333",
                fontWeight: "bold",
              }}
              containerStyle={{
                borderRadius: 8,
              }}
              dropDownContainerStyle={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 8,
                backgroundColor: "#FFF",
              }}
              itemStyle={{
                justifyContent: "flex-start",
                paddingVertical: 10,
                paddingHorizontal: 15,
              }}
              selectedItemLabelStyle={{
                color: "#003333",
                fontFamily: "Rubik-Medium",
                fontSize: 16,
                fontWeight: "300",
              }}
            />
          </View>

          {/* Conditional Access Control Settings */}
          {quizState.settings.accessControl === "password" && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ type: "spring", duration: 300 }}
              style={{ marginTop: 16, width: "100%" }}
            >
              <Text
                style={{ fontSize: 16, color: "#003333", fontWeight: "300" }}
              >
                {t("accescontrolpassword")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.enhancedInput,
                  styles.passwordInput,
                ]}
                value={quizState.settings.password}
                onChangeText={(text) =>
                  setQuizState({
                    ...quizState,
                    settings: { ...quizState.settings, password: text },
                  })
                }
                placeholder={t("accescontrolpasswordplaceholder")}
                secureTextEntry
                autoCapitalize="none"
              />
            </MotiView>
          )}

          {/* Scheduling */}
          <View style={styles.scheduleSection}>
            <Text style={styles.subsectionTitle}>
              {t("schedulingSettingsTitle")}
            </Text>
            <View style={styles.datePickerContainer}>
              {/* Continuing from the Schedule Quiz section */}
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => {
                  setDateType("start");
                  setShowDatePicker(true);
                }}
              >
                <Ionicons name="calendar-outline" size={24} color="#FFA500" />
                <Text style={styles.dateButtonText}>
                  {quizState.settings.startDate
                    ? new Date(
                        quizState.settings.startDate
                      ).toLocaleDateString()
                    : t("createstartdate")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => {
                  setDateType("end");
                  setShowDatePicker(true);
                }}
              >
                <Ionicons name="calendar-outline" size={24} color="#FFA500" />
                <Text style={styles.dateButtonText}>
                  {quizState.settings.endDate
                    ? new Date(quizState.settings.endDate).toLocaleDateString()
                    : t("createenddate")}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={
                  dateType === "start"
                    ? quizState.settings.startDate || new Date()
                    : quizState.settings.endDate || new Date()
                }
                mode="date"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                minimumDate={
                  dateType === "end" ? quizState.settings.startDate : new Date()
                }
              />
            )}
          </View>

          {/* Results Display Settings */}
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>
              {t("resultsDisplaySettingsTitle")}
            </Text>
            <View style={styles.settingsGrid}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>
                  {t("creationshowresult")}
                </Text>
                <Switch
                  value={quizState.settings.showResultsImmediately}
                  onValueChange={(value) =>
                    setQuizState({
                      ...quizState,
                      settings: {
                        ...quizState.settings,
                        showResultsImmediately: value,
                      },
                    })
                  }
                  trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                  thumbColor={
                    quizState.settings.showResultsImmediately
                      ? "#003333"
                      : "#f4f3f4"
                  }
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>
                  {t("creationshowscoredistribution")}{" "}
                </Text>
                <Switch
                  value={quizState.settings.showScoreDistribution}
                  onValueChange={(value) =>
                    setQuizState({
                      ...quizState,
                      settings: {
                        ...quizState.settings,
                        showScoreDistribution: value,
                      },
                    })
                  }
                  trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                  thumbColor={
                    quizState.settings.showScoreDistribution
                      ? "#003333"
                      : "#f4f3f4"
                  }
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>
                  {t("creationenableleaderboard")}
                </Text>
                <Switch
                  value={quizState.settings.enableLeaderboard}
                  onValueChange={(value) =>
                    setQuizState({
                      ...quizState,
                      settings: {
                        ...quizState.settings,
                        enableLeaderboard: value,
                      },
                    })
                  }
                  trackColor={{ false: "#E0E0E0", true: "#004D4D" }}
                  thumbColor={
                    quizState.settings.enableLeaderboard ? "#003333" : "#f4f3f4"
                  }
                />
              </View>
            </View>
          </View>

          {/* Attempts Tracking */}
          {/*  <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Attempts Settings</Text>
            <View style={styles.settingsGrid}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Track Attempts</Text>
                <Switch
                  value={quizState.settings.trackAttempts}
                  onValueChange={(value) =>
                    setQuizState({
                      ...quizState,
                      settings: { ...quizState.settings, trackAttempts: value },
                    })
                  }
                  trackColor={{ false: "#E0E0E0", true: "#FFA500" }}
                />
              </View>

              {quizState.settings.trackAttempts && (
                <View style={styles.settingSubItem}>
                  <Text style={styles.settingLabel}>
                    Cool-down Period (hours)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      styles.enhancedInput,
                      styles.numberInput,
                    ]}
                    keyboardType="numeric"
                    value={quizState.settings.cooldownPeriod?.toString()}
                    onChangeText={(text) =>
                      setQuizState({
                        ...quizState,
                        settings: {
                          ...quizState.settings,
                          cooldownPeriod: parseInt(text) || 0,
                        },
                      })
                    }
                    maxLength={2}
                  />
                </View>
              )}  
            </View>
          </View> */}
        </View>
      </MotiView>
    </ScrollView>
  );
};

export default RenderSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#ffffff",
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
    fontWeight: "300",
    width: "60%",
  },
  scoringSection: {
    marginTop: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
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
  subsection: {
    marginTop: 20,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#004D4D",
    marginBottom: 12,
  },

  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  settingSubItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  numberInput: {
    width: 80,
    textAlign: "center",
    marginLeft: 8,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 12,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  dateButtonText: {
    color: "#003333",
    fontSize: 14,
  },
  scheduleSection: {
    marginTop: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 8,
  },
  passwordInput: {
    marginTop: 8,
  },
  halfWidth: {
    width: "50%",
  },
  enhancedDropdown: {
    borderColor: "#E5E7EB",
    borderRadius: 8,
  },
  settingsGrid: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#004D4D",
    width: "100%",
  },
  scoreInput: {
    width: 80,
    textAlign: "center",
  },

  // Animation related styles
  animatedContainer: {
    overflow: "hidden",
  },
  // Responsive styles
  container: {
    flex: 1,
    paddingHorizontal: Platform.OS === "ios" ? 16 : 12,
  },
  // Form validation styles
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 4,
  },
  invalidInput: {
    borderColor: "#FF4444",
  },
  input: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 10,
    /*  marginBottom: 16, */
    fontSize: 16,
    fontFamily: FONTS.regular,
    borderWidth: 1,
    borderColor: "#003333",
    elevation: 3,
    fontWeight: "bold",
  },
});
