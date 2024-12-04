import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "@/context/authContext";
import UserProfileScreen from "../screens/profilscreens/UserProfileScreen";

const ProfileScreen = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // If authentication state is determined
    if (typeof isAuthenticated !== "undefined") {
      if (isAuthenticated) {
        // If authenticated, navigate to UserProfileScreen
        router.replace("Signin");
      } else {
        // If not authenticated, navigate to Signin
        router.replace("Signin");
      }
    }
  }, [isAuthenticated, router]);

  return (
    <Stack>
      <Stack.Screen
        name="../screens/profilscreens/UserProfileScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="./Signin" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
