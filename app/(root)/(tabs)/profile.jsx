import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Share,
} from "react-native";
import icons from "@/constants/icons";
import { settings } from "@/constants/data";
import { useAuth } from "@/context/authContext";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/service/firebase/firebaseconfig.js";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/service/firebase/firebaseconfig";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Sharing from "expo-sharing";

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-[#003333] ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && (
      <Image source={icons.rightArrow} tintColor="#003333" className="size-5" />
    )}
  </TouchableOpacity>
);

const profile = () => {
  const { user, logout, isAuthenticated, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const avatar = require("@/assets/images/default-avatar.png");
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/profileScreens/Signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const shareApp = async () => {
    try {
      // Replace these with your actual app store links when published
      const appStoreLink = "https://apps.apple.com/your-app-link";
      const playStoreLink = "https://play.google.com/store/apps/your-app-link";

      const message =
        "Join me on this awesome Quiz App! Challenge yourself and compete with friends!\n\n" +
        "Download here:\n" +
        `iOS: ${appStoreLink}\n` +
        `Android: ${playStoreLink}`;

      // Check if sharing is available on the device
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        try {
          const result = await Share.share({
            message,
            title: "Check out this Quiz App!",
          });

          if (result.action === Share.sharedAction) {
            console.log("App shared successfully");
          }
        } catch (error) {
          console.error("Error sharing app:", error);
        }
      } else {
        console.log("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error in shareApp:", error);
    }
  };

  useEffect(() => {
    refreshUser();
    console.log("user:", user);
    if (!isAuthenticated && !isLoading) {
      router.replace("/profileScreens/Signin");
    }
  }, [isAuthenticated, isLoading]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  };

  const updateProfile = async (photoURL) => {
    try {
      await updateDoc(doc(db, "users", user.userId), {
        photoURL: photoURL,
      });

      await updateProfile(auth.currentUser, {
        photoURL: photoURL,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleUpdatePhoto = async () => {
    try {
      setIsUpdating(true);
      const imageUri = await pickImage();
      if (!imageUri) return;

      const photoURL = await uploadImage(imageUri);
      const result = await updateProfile(photoURL);

      if (result.success) {
        refreshUser();
        setIsUpdating(false);
      }
    } catch (error) {
      setIsUpdating(false);
      Alert.alert("Error", error.message);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profilePhotos/${user.userId}`);

    await uploadBytes(imageRef, blob);
    const url = await getDownloadURL(imageRef);
    return url;
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <StatusBar backgroundColor="#003333" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7 pt-10"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <View className="relative">
              <Image
                source={user?.photoURL ? { uri: user.photoURL } : avatar}
                className="size-44 relative rounded-full"
              />
              {isUpdating && (
                <View className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              )}
            </View>
            <TouchableOpacity
              className="absolute bottom-11 right-2"
              onPress={handleUpdatePhoto}
              disabled={isUpdating}
            >
              <Image
                source={icons.edit}
                className="size-9"
                style={isUpdating ? { opacity: 0.5 } : null}
              />
            </TouchableOpacity>

            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem
            onPress={() => router.push("/profileScreens/QuizcreationScreen")}
            icon={icons.calendar}
            title="Create Quizzes"
          />
          <SettingsItem icon={icons.calendar} title="My Quizzes" />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          <SettingsItem
            onPress={() => router.push("/profileScreens/EditProfileScreen")}
            icon={icons.person}
            title="Profile"
          />
          <SettingsItem
            onPress={shareApp}
            icon={icons.people}
            title="Invite Friends"
          />
          <SettingsItem icon={icons.bell} title="Notifications" />
          <SettingsItem
            onPress={() => router.push("/profileScreens/LanguageSelector")}
            icon={icons.language}
            title="Language"
          />
          <SettingsItem icon={icons.info} title="Help Center" />
          {/* {settings.slice(2).map((item, index) => (
            <SettingsItem
              key={index}
              {...item}
              onPress={() => handleSettingPress(item.type)}
            />
          ))} */}
        </View>

        <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
