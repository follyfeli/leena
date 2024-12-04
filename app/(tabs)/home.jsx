import React from "react";
import { useAuth } from "@/context/authContext";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import ModernSearchBar from "@/components/ModernSearchBar";
import BusinessCardList from "@/components/BusinessCardList";
import { useRouter } from "expo-router";
import UserProfileScreen from "../Signin";
import { AntDesign } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
const BACKGROUND_COLOR = "#f0f0f0";

const home = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const userAvatar = "https://i.pravatar.cc/150?u=1";
  return (
    <View style={styles.container}>
      <StatusBar style={"dark"} backgroundColor="#f0f0f0" />
      <View style={styles.header}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {isAuthenticated ? "Welcome User" : "Welcome Guest"}
          </Text>
          <Text style={{ fontSize: 12, color: "gray", marginStart: 18 }}>
            know what you are doing
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push(
              isAuthenticated
                ? "../screens/profilscreens/UserProfileScreen"
                : "../Signin"
            )
          }
        >
          {isAuthenticated ? (
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
          ) : (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#666",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AntDesign name="user" size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/* Search bar */}
      <ModernSearchBar
        onSearch={(query) => console.log(query)}
        placeholder="Search prevew..."
      />
      {/* data cards  */}
      <BusinessCardList />
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: BACKGROUND_COLOR,
    marginTop: 40,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
