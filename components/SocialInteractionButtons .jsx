import React, { useState, useEffect } from "react";
import { View, Pressable, Text, StyleSheet, Animated } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

const SocialInteractionButtons = ({ postId, userId, db }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const scaleAnimation = new Animated.Value(1);

  // Reference to the post document
  const postRef = doc(db, "posts", postId);

  useEffect(() => {
    // Subscribe to likes changes
    const unsubscribeLikes = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        const postData = doc.data();
        const likes = postData.likes || [];
        setLikeCount(likes.length);
        setIsLiked(likes.includes(userId));
      }
    });

    // Subscribe to comments count
    const unsubscribeComments = onSnapshot(
      collection(db, "posts", postId, "comments"),
      (snapshot) => {
        setCommentCount(snapshot.size);
      }
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeLikes();
      unsubscribeComments();
    };
  }, [postId, userId]);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = async () => {
    try {
      animatePress();

      // Update likes array in Firestore
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(userId) : arrayUnion(userId),
        lastUpdated: serverTimestamp(),
      });

      // The UI will update automatically through the onSnapshot listener
    } catch (error) {
      console.error("Error updating like:", error);
      // Handle error appropriately
    }
  };

  const addComment = async (commentText) => {
    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      const newCommentRef = doc(commentsRef); // Let Firestore auto-generate ID

      await setDoc(newCommentRef, {
        userId: userId,
        text: commentText,
        createdAt: serverTimestamp(),
      });

      // The comment count will update automatically through the onSnapshot listener
    } catch (error) {
      console.error("Error adding comment:", error);
      // Handle error appropriately
    }
  };

  return (
    <View style={styles.container}>
      {/* Like Button */}
      <Pressable
        onPress={handleLike}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: isLiked ? "#ffecf2" : "#f5f5f5" },
          pressed && styles.pressed,
        ]}
      >
        <Animated.View
          style={[
            styles.buttonContent,
            { transform: [{ scale: scaleAnimation }] },
          ]}
        >
          <AntDesign
            name={isLiked ? "heart" : "hearto"}
            size={24}
            color={isLiked ? "#ff4085" : "#666666"}
          />
          <Text
            style={[
              styles.buttonText,
              { color: isLiked ? "#ff4085" : "#666666" },
            ]}
          >
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </Text>
        </Animated.View>
      </Pressable>

      {/* Comment Button */}
      <Pressable
        onPress={() => {
          // Navigate to comments screen or show comments modal
          console.log("Navigate to comments");
        }}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: "#e8f0ff" },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.buttonContent}>
          <AntDesign name="message1" size={24} color="#4080ff" />
          <Text style={[styles.buttonText, { color: "#4080ff" }]}>
            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});

export default SocialInteractionButtons;

/* import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet, Animated } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const SocialInteractionButtons = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const scaleAnimation = new Animated.Value(1);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = () => {
    animatePress();
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleLike}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: isLiked ? "#ffecf2" : "#f5f5f5" },
          pressed && styles.pressed,
        ]}
      >
        <Animated.View
          style={[
            styles.buttonContent,
            { transform: [{ scale: scaleAnimation }] },
          ]}
        >
          <AntDesign
            name={isLiked ? "heart" : "hearto"}
            size={24}
            color={isLiked ? "#ff4085" : "#666666"}
          />
          <Text
            style={[
              styles.buttonText,
              { color: isLiked ? "#ff4085" : "#666666" },
            ]}
          >
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </Text>
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={() => console.log("Message pressed")}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: "#e8f0ff" },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.buttonContent}>
          <AntDesign name="message1" size={24} color="#4080ff" />
          <Text style={[styles.buttonText, { color: "#4080ff" }]}>Message</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});

export default SocialInteractionButtons;
 */
