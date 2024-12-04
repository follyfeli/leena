import { useFonts } from "expo-font";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthContextProvider, useAuth } from "@/context/authContext";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments;
  const router = useRouter();

  useEffect(() => {
    router.replace("home");
    /*  if (typeof isAuthenticated === "undefined") return;
    const InApp = segments[0] === "(tabs)";

    if (isAuthenticated && !InApp) {
      router.replace("home");
    } else if (isAuthenticated == false) {
      router.replace("Signin");
    } */
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}
