// PricingSection.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { MotiView } from "moti";
import styles from "@/app/screens/profilscreens/QuizcreationScreen/styles";

const PricingSection = ({ quizState, setQuizState }) => {
  const [pricingImage, setPricingImage] = useState(null);

  const pickPricingImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPricingImage(result.assets[0].uri);
        setQuizState({
          ...quizState,
          pricing: {
            ...quizState.pricing,
            imageUrl: result.assets[0].uri,
          },
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.section}
    >
      <Text style={styles.sectionTitle}>
        <Ionicons name="pricetag" size={24} style={styles.sectionIcon} />
        Pricing Information
      </Text>

      <View style={styles.pricingContainer}>
        <View style={styles.pricingToggle}>
          <Text style={styles.pricingLabel}>Enable Pricing</Text>
          <Switch
            value={quizState.pricing?.enabled || false}
            onValueChange={(value) =>
              setQuizState({
                ...quizState,
                pricing: {
                  ...quizState.pricing,
                  enabled: value,
                },
              })
            }
            trackColor={{ false: "#E0E0E0", true: "#1a2151" }}
          />
        </View>

        {quizState.pricing?.enabled && (
          <>
            <View style={styles.priceInputContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <TextInput
                style={[styles.input, styles.enhancedInput, styles.priceInput]}
                keyboardType="decimal-pad"
                placeholder="0.00"
                value={quizState.pricing?.price?.toString()}
                onChangeText={(text) =>
                  setQuizState({
                    ...quizState,
                    pricing: {
                      ...quizState.pricing,
                      price: text,
                    },
                  })
                }
              />
              <Text style={styles.currencyLabel}>USD</Text>
            </View>

            <TextInput
              style={[styles.input, styles.textArea, styles.enhancedInput]}
              placeholder="Describe what's included in this price..."
              value={quizState.pricing?.description}
              onChangeText={(text) =>
                setQuizState({
                  ...quizState,
                  pricing: {
                    ...quizState.pricing,
                    description: text,
                  },
                })
              }
              multiline
              numberOfLines={4}
            />

            {/* Pricing Features List */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Features Included</Text>
              <TextInput
                style={[styles.input, styles.enhancedInput]}
                placeholder="Add feature (press Enter to add)"
                onSubmitEditing={(event) => {
                  const feature = event.nativeEvent.text.trim();
                  if (
                    feature &&
                    !quizState.pricing?.features?.includes(feature)
                  ) {
                    setQuizState({
                      ...quizState,
                      pricing: {
                        ...quizState.pricing,
                        features: [
                          ...(quizState.pricing?.features || []),
                          feature,
                        ],
                      },
                    });
                  }
                  event.target.value = "";
                }}
              />
              {quizState.pricing?.features?.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.featureText}>{feature}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newFeatures = quizState.pricing.features.filter(
                        (_, i) => i !== index
                      );
                      setQuizState({
                        ...quizState,
                        pricing: {
                          ...quizState.pricing,
                          features: newFeatures,
                        },
                      });
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Pricing Image Section */}
            <View style={styles.pricingImageSection}>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={pickPricingImage}
              >
                <Ionicons name="image" size={24} color="#1a2151" />
                <Text style={styles.imageUploadText}>
                  {pricingImage ? "Change Pricing Image" : "Add Pricing Image"}
                </Text>
              </TouchableOpacity>
              {pricingImage && (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: pricingImage }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => {
                      setPricingImage(null);
                      setQuizState({
                        ...quizState,
                        pricing: {
                          ...quizState.pricing,
                          imageUrl: null,
                        },
                      });
                    }}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </MotiView>
  );
};

export default PricingSection;
