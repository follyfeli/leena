import React from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";

const { width } = Dimensions.get("window");

const ModernLoadingScreen = () => {
  const rotateValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.loaderContainer, { transform: [{ rotate: rotation }] }]}
      >
        <View style={styles.loader}>
          <View style={[styles.loaderSegment, styles.segment1]} />
          <View style={[styles.loaderSegment, styles.segment2]} />
          <View style={[styles.loaderSegment, styles.segment3]} />
          <View style={[styles.loaderSegment, styles.segment4]} />
        </View>
      </Animated.View>
      <Text style={styles.loadingText}>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  loaderContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loader: {
    width: 60,
    height: 60,
    position: "relative",
  },
  loaderSegment: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 30,
    borderWidth: 6,
    borderColor: "transparent",
  },
  segment1: {
    borderTopColor: "#3b82f6",
    transform: [{ rotate: "0deg" }],
  },
  segment2: {
    borderTopColor: "#60a5fa",
    transform: [{ rotate: "90deg" }],
  },
  segment3: {
    borderTopColor: "#93c5fd",
    transform: [{ rotate: "180deg" }],
  },
  segment4: {
    borderTopColor: "#bae6fd",
    transform: [{ rotate: "270deg" }],
  },
  loadingText: {
    fontSize: 18,
    color: "#4b5563",
    fontWeight: "600",
  },
});

export default ModernLoadingScreen;

/* import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  ImageBackground 
} from "react-native";

const { width, height } = Dimensions.get('window');

// Replace these with your actual image paths
const BACKGROUND_IMAGES = [
  require('@/assets/images/gallery1.jpg'),
  require('@/assets/images/gallery2.jpg'),
  require('@/assets/images/gallery3.jpg'),
];

const ModernLoadingScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const rotateValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Image transition
    const imageTransition = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.delay(200),
        Animated.fromValue(0)
      ]).start(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % BACKGROUND_IMAGES.length
        );
      });
    };

    const imageInterval = setInterval(imageTransition, 5000);

    // Loader rotation
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      })
    ).start();

    return () => {
      clearInterval(imageInterval);
    };
  }, []);

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const fadeIn = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <ImageBackground 
      source={BACKGROUND_IMAGES[currentImageIndex]} 
      style={styles.backgroundImage}
      blurRadius={5}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.loaderContainer, 
            { transform: [{ rotate: rotation }] }
          ]}
        >
          <View style={styles.loader}>
            <View style={[styles.loaderSegment, styles.segment1]} />
            <View style={[styles.loaderSegment, styles.segment2]} />
            <View style={[styles.loaderSegment, styles.segment3]} />
            <View style={[styles.loaderSegment, styles.segment4]} />
          </View>
        </Animated.View>
        <Text style={styles.loadingText}>Loading</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loader: {
    width: 60,
    height: 60,
    position: "relative",
  },
  loaderSegment: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 30,
    borderWidth: 6,
    borderColor: "transparent",
  },
  segment1: {
    borderTopColor: "rgba(255,255,255,0.7)",
    transform: [{ rotate: "0deg" }],
  },
  segment2: {
    borderTopColor: "rgba(255,255,255,0.5)",
    transform: [{ rotate: "90deg" }],
  },
  segment3: {
    borderTopColor: "rgba(255,255,255,0.3)",
    transform: [{ rotate: "180deg" }],
  },
  segment4: {
    borderTopColor: "rgba(255,255,255,0.1)",
    transform: [{ rotate: "270deg" }],
  },
  loadingText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  }
});

export default ModernLoadingScreen;
 */
