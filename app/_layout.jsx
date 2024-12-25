import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AuthContextProvider, useAuth } from "@/context/authContext";

import "./global.css";
/* import GlobalProvider from "@/lib/global-provider";
 */
export default function RootLayout() {
  /* const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  }); */

  /*   useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]); */

  /* if (!fontsLoaded) {
    return null;
  }
 */
  return (
    <AuthContextProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthContextProvider>
  );
}

/* import { useFonts } from "expo-font";
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
     if (typeof isAuthenticated === "undefined") return;
    const InApp = segments[0] === "(tabs)";

    if (isAuthenticated && !InApp) {
      router.replace("home");
    } else if (isAuthenticated == false) {
      router.replace("Signin");
    }  
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
 */
