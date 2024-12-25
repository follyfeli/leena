import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Modal,
  Image,
  ActivityIndicator,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const GalleryContent = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [page, setPage] = useState(1);
  const [fullScreenMedia, setFullScreenMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMediaItems = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual data fetching
      const newItems = Array.from({ length: 10 }, (_, index) => ({
        id: `${page}-${index}`,
        type: index % 2 === 0 ? "image" : "video",
        uri:
          index % 2 === 0
            ? `https://picsum.photos/seed/${page}-${index}/300/300`
            : `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
        thumbnail: `https://picsum.photos/seed/${page}-${index}/300/300`,
        likes: Math.floor(Math.random() * 5000000000), // Random likes up to 5 billion
      }));

      setMediaItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to fetch media", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading]);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const FullScreenMediaModal = ({ item }) => {
    const player = useVideoPlayer(item.uri, (player) => {
      if (item.type === "video") {
        player.loop = true;
        player.play();
      }
    });

    const { isPlaying } = useEvent(player, "playingChange", {
      isPlaying: player.playing,
    });

    return (
      <Modal
        transparent={false}
        visible={true}
        onRequestClose={() => setFullScreenMedia(null)}
        animationType="slide"
        style={styles.fullScreenContainer}
      >
        <KeyboardAvoidingView
          style={styles.fullScreenContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {item.type === "video" ? (
            <VideoView
              style={styles.fullScreenMedia}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          ) : (
            <Image
              source={{ uri: item.uri }}
              style={styles.fullScreenMedia}
              resizeMode="contain"
            />
          )}

          <View intensity={20} style={styles.controlsContainer}>
            {item.type === "video" && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => (isPlaying ? player.pause() : player.play())}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={24}
                  color="#28282B"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setFullScreenMedia(null)}
            >
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Media Details Section */}
          <View style={styles.mediaDetailsContainer}>
            <Text style={styles.mediaDescription}>{item.description}</Text>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const renderMediaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.galleryItem}
      onPress={() => setFullScreenMedia(item)}
    >
      <View style={styles.mediaContainer}>
        <Image
          source={{ uri: item.type === "image" ? item.uri : item.thumbnail }}
          style={styles.galleryItemMedia}
          resizeMode="cover"
        />
        {item.type === "video" && (
          <View style={styles.videoOverlay}>
            <Ionicons name="play-circle" size={50} color="white" />
          </View>
        )}

        {/* Likes and Comments Overlay */}
        <View style={styles.mediaInfoOverlay}>
          <View style={styles.mediaInfoContainer}>
            <View style={styles.mediaInfoItem}>
              <Ionicons name="heart" size={16} color="white" />
              <Text
                style={{
                  marginLeft: 5,
                  color: "white",
                  fontWeight: "semibold",
                }}
              >
                description de la photo
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contentContainer}>
      <FlatList
        data={mediaItems}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onEndReached={fetchMediaItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : null
        }
        columnWrapperStyle={styles.columnWrapper}
      />

      {fullScreenMedia && <FullScreenMediaModal item={fullScreenMedia} />}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#28282B",
    borderRadius: 15,
    padding: 10,
    flex: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  galleryItem: {
    width: width / 2.5,
    height: width / 2,
    borderRadius: 15,
    overflow: "hidden",
    margin: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#fff",
  },
  mediaContainer: {
    flex: 1,
    position: "relative",
  },
  galleryItemMedia: {
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#28282B",
  },
  fullScreenMedia: {
    width: width,
    height: height / 2,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  controlButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },

  mediaInfoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
  },
  mediaInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mediaInfoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Full Screen Modal Additional Styles
  mediaDetailsContainer: {
    padding: 16,
    backgroundColor: "#28282B",
  },
  mediaDescription: {
    color: "white",
    fontSize: 16,
    marginBottom: 12,
  },
});

export default GalleryContent;
