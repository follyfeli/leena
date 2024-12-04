import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/authContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "@/service/firebase/firebaseconfig";
import ProfileCategories from "../../../components/ProfileCategories";

const UserProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const auth = getAuth();
  const db = getFirestore();
  const { logout } = useAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      console.log("User data:", userDoc.data());
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);
  const uploadImageAsync = async () => {
    if (!imageBlob) {
      throw new Error("No image URI provided");
    }

    try {
      // Fetch the image as a blob
      /* const response = await fetch(selectedImage);
      const blob = await response.blob(); */

      // Create a reference to the storage location
      const storageRef = ref(
        storage,
        `profile_images/${auth.currentUser.uid}/profile_${Date.now()}.jpg`
      );

      // Upload the blob
      const uploadResult = await uploadBytes(storageRef, imageBlob);

      // Check if uploadResult has the expected structure
      if (!uploadResult || !uploadResult.ref) {
        throw new Error("Upload result is invalid");
      }

      console.log("the upload result", uploadResult);

      // Get the download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      return downloadURL;
    } catch (error) {
      console.error("Detailed upload error:", error);

      // Provide more context about the error
      Alert.alert(
        "Upload Error",
        `Failed to upload image. ${
          error.message
        }\n\nError Details: ${JSON.stringify(error)}`
      );

      throw error;
    }
  };

  const getBlobFroUri = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    return blob;
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  useEffect(() => {
    console.log("Selected image:", selectedImage);
    if (selectedImage) {
      uploadImageAsync(selectedImage);
    }
  }, [selectedImage]);

  if (hasGalleryPermission === false) {
    return <Text>No access to internal storage</Text>;
  }

  const handleLogout = async () => {
    await logout();
  };

  const imageBlob = getBlobFroUri(selectedImage);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />

      {/* Header Section */}
      <View style={styles.header}>
        <BlurView intensity={100} style={styles.headerContent}>
          <TouchableOpacity
            onPress={pickImageAsync}
            style={styles.profileImageContainer}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <>
                <Image
                  source={
                    userData?.photoURL
                      ? { uri: userData.photoURL }
                      : require("@/assets/images/default-avatar.png")
                  }
                  style={styles.profileImage}
                />
                <View style={styles.editIconContainer}>
                  <Ionicons name="camera" size={20} color="white" />
                </View>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.userName}>{userData?.name || "User Name"}</Text>
          <Text style={styles.userEmail}>
            {userData?.email || "email@example.com"}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>120</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.5K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>890</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </BlurView>
      </View>

      {/* Profile Actions */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ProfileCategories />

      {/* Profile Sections */}
      {/* <View style={styles.sectionContainer}>
        {[
          { icon: "settings-outline", label: "Settings" },
          { icon: "shield-checkmark-outline", label: "Privacy" },
          { icon: "notifications-outline", label: "Notifications" },
          { icon: "help-circle-outline", label: "Help & Support" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.sectionItem,
              index === 3 && { borderBottomWidth: 0 },
            ]}
          >
            <Ionicons name={item.icon} size={24} color="#333" />
            <Text style={styles.sectionText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View> */}

      {/* Logout Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleLogout}>
          <Text style={styles.editButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 300,
    backgroundColor: "#007AFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "white",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  actionContainer: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  shareButton: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    padding: 15,
    borderRadius: 12,
    width: 54,
    alignItems: "center",
  },
  sectionContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
    padding: 10,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
});

export default UserProfileScreen;
