import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/i18n";

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [selectedAnim] = React.useState(new Animated.Value(0));

  const languages = [
    { code: "en", name: t("english"), icon: "language-outline" },
    { code: "fr", name: t("french"), icon: "language-outline" },
    { code: "es", name: t("spanish"), icon: "language-outline" },
  ];

  const handleLanguageSelect = (code) => {
    Animated.spring(selectedAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      selectedAnim.setValue(0);
    });
    changeLanguage(code);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
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
      </View>
      <View style={styles.header}>
        <Ionicons name="globe-outline" size={24} color="#003333" />
        <Text style={styles.title}>{t("selectLanguage")}</Text>
      </View>
      <Text style={styles.subtitle}>{t("choosePreferredLanguage")}</Text>

      <View style={styles.languageList}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              currentLanguage === lang.code && styles.selectedLanguage,
            ]}
            onPress={() => handleLanguageSelect(lang.code)}
            activeOpacity={0.7}
          >
            <View style={styles.languageContent}>
              <Ionicons
                name={lang.icon}
                size={20}
                color={currentLanguage === lang.code ? "#FFA500" : "#003333"}
              />
              <Text
                style={[
                  styles.languageText,
                  currentLanguage === lang.code && styles.selectedLanguageText,
                ]}
              >
                {lang.name}
              </Text>
            </View>
            {currentLanguage === lang.code && (
              <Animated.View
                style={[
                  styles.checkmark,
                  {
                    transform: [
                      {
                        scale: selectedAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [1, 1.2, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Ionicons name="checkmark" size={20} color="#FFA500" />
              </Animated.View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#003333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 24,
  },
  languageList: {
    gap: 12,
    marginTop: 20,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedLanguage: {
    backgroundColor: "#003333",
    borderColor: "#003333",
  },
  languageContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  languageText: {
    fontSize: 16,
    color: "#003333",
    fontWeight: "500",
  },
  selectedLanguageText: {
    color: "#FFA500",
  },
  checkmark: {
    width: 20,
    height: 20,
  },
  navigationHeader: {
    borderBottomWidth: 1,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    marginBottom: 10,
    borderBottomColor: "#003333",
    backgroundColor: "#003333",
  },
  backIcon: {
    color: "#FFA500",
    alignSelf: "center",
  },
});

export default LanguageSelector;
