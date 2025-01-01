import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/service/firebase/firebaseconfig";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import { useLanguage } from "@/i18n";
const EditProfileScreen = () => {
  const { user, isLoading, refreshUser } = useAuth();
  const [saveloading, setsaveLoading] = useState(false);
  const { t } = useLanguage();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    website: user?.website || "",
    socialLinks: user?.socialLinks || {
      twitter: "",
      linkedin: "",
      github: "",
    },
  });
  const [profileImage, setProfileImage] = useState(user?.photoURL || null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        bio: user.bio || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        website: user.website || "",
        socialLinks: user.socialLinks || {
          twitter: "",
          linkedin: "",
          github: "",
        },
      });
      setProfileImage(user.photoURL);
    }
  }, [user]);

  const validateUrl = (url) => {
    if (!url) return true; // Optional fields
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const validateSocialLinks = {
    twitter: (username) => {
      if (!username) return true;
      return /^@?[a-zA-Z0-9_]{1,15}$/.test(username.replace("@", ""));
    },
    linkedin: (url) => {
      if (!url) return true;
      return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(url);
    },
    github: (username) => {
      if (!username) return true;
      return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(
        username
      );
    },
  };

  const validateProfileUrls = (profileData) => {
    const errors = [];

    if (!validateUrl(profileData.website)) {
      errors.push("Invalid website URL");
    }

    Object.entries(profileData.socialLinks).forEach(([platform, value]) => {
      if (!validateSocialLinks[platform](value)) {
        errors.push(
          `Invalid ${platform} ${platform === "twitter" ? "username" : "URL"}`
        );
      }
    });

    return errors;
  };

  const handleSave = async () => {
    if (!profileData.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    const urlErrors = validateProfileUrls(profileData);
    if (urlErrors.length > 0) {
      Alert.alert("Error", urlErrors.join("\n"));
      return;
    }

    setsaveLoading(true);
    try {
      let photoURL = profileImage;

      // Update user document in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: profileData.name,
        bio: profileData.bio,
        email: profileData.email,
        website: profileData.website,
        socialLinks: profileData.socialLinks,
        updatedAt: new Date().toISOString(),
      });

      router.push("/profile");

      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setsaveLoading(false);
    }
  };

  const renderSection = (title, children) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500 }}
      className="mb-6"
    >
      <Text className="text-lg font-semibold mb-3 text-gray-800">{title}</Text>
      {children}
    </MotiView>
  );

  const renderInput = (label, value, key, placeholder, multiline = false) => (
    <View className="mb-4">
      <Text className="text-sm text-gray-600 mb-1">{label}</Text>
      <TextInput
        className={`bg-white p-3 rounded-xl border border-[#003333] ${
          multiline ? "h-24 textAlignVertical-top" : ""
        }`}
        value={value}
        onChangeText={(text) => {
          if (key.includes(".")) {
            // Handle nested objects (social links)
            const [parent, child] = key.split(".");
            setProfileData((prev) => ({
              ...prev,
              [parent]: {
                ...prev[parent],
                [child]: text,
              },
            }));
          } else {
            setProfileData((prev) => ({ ...prev, [key]: text }));
          }
        }}
        placeholder={placeholder}
        multiline={multiline}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        <View className="py-4">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {t("editprofile")}
          </Text>
          <Text className="text-gray-500">{t("editprofiledescription")} </Text>
        </View>

        {/* Profile Image Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="items-center my-6"
        ></MotiView>

        {/* Basic Information */}
        {renderSection(
          t("editprofilbasiq"),
          <>
            {renderInput(t("name"), profileData.name, "name", t("entername"))}
            {renderInput(t("bio"), profileData.bio, "bio", t("enterbio"), true)}
            {/*  {renderInput(
              "Phone",
              profileData.phone,
              "phone",
              "Enter your phone number"
            )} */}
          </>
        )}

        {/* Additional Information */}
        {renderSection(
          t("additionalinformation"),
          <>
            {renderInput(
              t("editprofillocation"),
              profileData.location,
              "location",
              t("editenterlocation")
            )}
            {renderInput(
              t("editwebsite"),
              profileData.website,
              "website",
              t("editenterwebsite")
            )}
          </>
        )}

        {/* Social Links */}
        {renderSection(
          t("editsociallinks"),
          <>
            {renderInput(
              "Twitter",
              profileData.socialLinks.twitter,
              "socialLinks.twitter",
              t("username")
            )}
            {renderInput(
              "LinkedIn",
              profileData.socialLinks.linkedin,
              "socialLinks.linkedin",
              t("editlinkedinurl")
            )}
          </>
        )}

        {/* Save Button */}
        <View className="py-6">
          <TouchableOpacity
            onPress={handleSave}
            disabled={saveloading}
            className={`py-4 px-6 rounded-xl ${
              saveloading ? "bg-gray-400" : "bg-[#003333]"
            }`}
          >
            {saveloading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                {t("save")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
