import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
const { width } = Dimensions.get("window");

const businessData = [
  {
    id: 1,
    name: "TechInnovate Solutions",
    category: "Software Development",
    image:
      "https://images.unsplash.com/photo-1573164574572-cb89e1249b60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    color: ["#3494E6", "#2196f3"],
  },
  {
    id: 2,
    name: "GreenEarth Consulting",
    category: "Environmental Services",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc3d6e56d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    color: ["#11998e", "#38ef7d"],
  },
  {
    id: 3,
    name: "HealthPro Medical",
    category: "Healthcare Technology",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    color: ["#f12711", "#f5af19"],
  },
  {
    id: 4,
    name: "FinanceNow Advisors",
    category: "Financial Services",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bdf2c89b1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    color: ["#8E2DE2", "#4A00E0"],
  },
  {
    id: 5,
    name: "CreativeEdge Marketing",
    category: "Digital Marketing",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    color: ["#FF416C", "#FF4B2B"],
  },
  {
    id: 6,
    name: "BuildRight Construction",
    category: "Architecture & Design",
    image:
      "https://images.unsplash.com/photo-1617720572697-c4aef3a4acf4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    color: ["#4AC29A", "#BDFFF3"],
  },
  {
    id: 7,
    name: "EduTech Learning",
    category: "Online Education",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    color: ["#FF5F6D", "#FFC371"],
  },
  {
    id: 8,
    name: "GlobalTrade Solutions",
    category: "International Commerce",
    image:
      "https://images.unsplash.com/photo-1553835973-dec43bbaaeee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    color: ["#00467F", "#A5CC82"],
  },
];

const BusinessCard = ({ business }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push("/screens/homescreens/homedetails")}
      style={styles.card}
    >
      <LinearGradient
        colors={business.color}
        style={styles.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {isAuthenticated && (
          <View style={styles.topoverlay}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{}}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                  }}
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
              </View>

              <Text
                style={{ marginEnd: 5, fontWeight: "bold", color: "#fff" }}
                numberOfLines={1}
              >
                eklou eklou
              </Text>
            </View>
          </View>
        )}
        <Image
          source={{ uri: business.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <LottieView
              autoPlay
              loop
              style={{
                width: 50,
                height: 90,
                /*  backgroundColor: "red", */
              }}
              source={require("../assets/lotties/likes.json")}
            />
            <Text style={styles.category} numberOfLines={1}>
              355K
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const BusinessCardList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={businessData}
        renderItem={({ item }) => <BusinessCard business={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    marginBottom: 10,
  },
  card: {
    width: "100%",
    overflow: "hidden",
    elevation: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignSelf: "center",
    marginBottom: 5,
  },
  gradientOverlay: {
    width: "100%",
  },
  image: {
    width: width,
    minHeight: 300,
  },
  overlay: {
    position: "absolute",
    bottom: 2,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    /*  height: 30,
    width: width / 3, */
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  topoverlay: {
    position: "absolute",
    top: 4,
    left: 5,
    backgroundColor: "rgba(224,0,255,0.1)",
    height: 30,
    width: width / 3,
    justifyContent: "center",
    borderRadius: 10,
    zIndex: 999,
  },
  name: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default BusinessCardList;
