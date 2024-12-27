import { useEffect } from "react";
import { Stack } from "expo-router";

import { AuthContextProvider, useAuth } from "@/context/authContext";
import { LanguageProvider } from "@/i18n";
import "./global.css";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthContextProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthContextProvider>
    </LanguageProvider>
  );
}
