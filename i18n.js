/* import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translations from "./translations";
import { createContext, useState, useContext, useEffect } from "react";

const i18n = new I18n(translations);
i18n.enableFallback = true; // Enable fallback to default language

export const LanguageContext = createContext(null); // Initialize with null

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("userLanguage");
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        i18n.locale = savedLanguage;
      } else {
        // Use device language as default
        const deviceLanguage = Localization.locale.split("-")[0];
        if (translations[deviceLanguage]) {
          setCurrentLanguage(deviceLanguage);
          i18n.locale = deviceLanguage;
        }
      }
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const changeLanguage = async (language) => {
    try {
      await AsyncStorage.setItem("userLanguage", language);
      setCurrentLanguage(language);
      i18n.locale = language;
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t: (key, options) => i18n.t(key, options),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}; */

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translations from "./translations";
import React, { createContext, useState, useContext, useEffect } from "react";

const i18n = new I18n(translations);

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("userLanguage");
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        i18n.locale = savedLanguage;
      } else {
        // Use device language as default
        const deviceLanguage = Localization.locale.split("-")[0];
        if (translations[deviceLanguage]) {
          setCurrentLanguage(deviceLanguage);
          i18n.locale = deviceLanguage;
        }
      }
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const changeLanguage = async (language) => {
    try {
      await AsyncStorage.setItem("userLanguage", language);
      setCurrentLanguage(language);
      i18n.locale = language;
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, changeLanguage, t: i18n.t.bind(i18n) }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
