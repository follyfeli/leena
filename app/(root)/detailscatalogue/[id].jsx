import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/service/firebase/firebaseconfig";
import { useAuth } from "@/context/authContext";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useEffect, useState } from "react";

const Property = () => {
  const { id } = useLocalSearchParams();
  console.log(" details quizz id ", id);
  const { user } = useAuth();
  const windowHeight = Dimensions.get("window").height;
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);

  /* useEffect(() => {
    fetchQuizDetails();
  }, [id]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "quizzes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const quizData = { $id: docSnap.id, ...docSnap.data() };
        setQuiz(quizData);
        setLiked(quizData.likes?.includes(user?.uid));

        // Update view count
        await updateDoc(docRef, {
          views: (quizData.views || 0) + 1,
        });
      } else {
        setError("Quiz not found");
      }
    } catch (err) {
      setError("Error loading quiz");
      console.error("Error fetching quiz:", err);
    } finally {
      setLoading(false);
    }
  }; */

  useEffect(() => {
    console.log("Fetching quiz with ID:", id);
    fetchQuizDetails();
  }, [id]);

  /* const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "quizzes", id);
      console.log("Fetching document with ref:", docRef.path); // Debug log

      const docSnap = await getDoc(docRef);
      console.log("Document exists?", docSnap.exists()); // Debug log
      console.log("Document data:", docSnap.data()); // Debug log

      if (docSnap.exists()) {
        const quizData = { $id: docSnap.id, ...docSnap.data() };
        console.log("Quiz data:", quizData); // Debug log
        setQuiz(quizData);
        setLiked(quizData.likes?.includes(user?.uid));

        // Update view count
        await updateDoc(docRef, {
          views: (quizData.views || 0) + 1,
        });
      } else {
        console.log("No document found!"); // Debug log
        setError("Quiz not found");
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setError(`Error loading quiz: ${err.message}`); // More detailed error
    } finally {
      setLoading(false);
    }
  }; */

  // Add a debug log for quiz state
  useEffect(() => {
    console.log("Current quiz state:", quiz);
  }, [quiz]);

  /* const handleLike = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const docRef = doc(db, "quizzes", id);
      await updateDoc(docRef, {
        likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
      setLiked(!liked);
    } catch (err) {
      console.error("Error updating likes:", err);
    }
  }; */

  const handleShare = () => {
    // Implement share functionality
  };

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "quizzes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const quizData = { $id: docSnap.id, ...docSnap.data() };
        setQuiz(quizData);

        // Fix the likes check - handle both number and array cases
        if (Array.isArray(quizData.likes)) {
          setLiked(quizData.likes.includes(user?.uid));
        } else {
          // If likes is a number or undefined, initialize it as an array
          setLiked(false);
          // Optionally update the document to convert likes to array
          await updateDoc(docRef, {
            likes: [],
          });
        }

        // Update view count
        await updateDoc(docRef, {
          views: (quizData.views || 0) + 1,
        });
      } else {
        setError("Quiz not found");
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setError("Error loading quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const docRef = doc(db, "quizzes", id);
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.data();

      // Initialize likes as array if it's not already
      let currentLikes = Array.isArray(currentData.likes)
        ? currentData.likes
        : [];

      // Update likes array
      const newLikes = liked
        ? currentLikes.filter((uid) => uid !== user.uid)
        : [...currentLikes, user.uid];

      await updateDoc(docRef, {
        likes: newLikes,
      });

      setLiked(!liked);
    } catch (err) {
      console.error("Error updating likes:", err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#003333" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-5">
        <Text className="text-xl font-rubik-bold text-black-300 text-center">
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary-300 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-rubik-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: quiz?.coverImage || images.defaultQuizCover }}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={handleLike}
                  className="bg-white/90 rounded-full p-2"
                >
                  <Image
                    source={icons.heart}
                    className="size-6"
                    tintColor={liked ? "#ff4b4b" : "#191D31"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleShare}
                  className="bg-white/90 rounded-full p-2"
                >
                  <Image source={icons.share} className="size-6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-7 flex gap-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-rubik-extrabold flex-1">
              {quiz?.basicInfo.title}
            </Text>
            <View className="bg-primary-100 rounded-full px-3 py-1">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {quiz?.questions?.length || 0} Questions
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center gap-3 flex-wrap">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {quiz?.basicInfo.category}
              </Text>
            </View>

            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {quiz?.basicInfo.difficulty}
              </Text>
            </View>

            {quiz?.basicInfo.subCategory && (
              <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
                <Text className="text-xs font-rubik-bold text-primary-300">
                  {quiz?.basicInfo.subCategory}
                </Text>
              </View>
            )}
          </View>

          <View className="flex flex-row items-center justify-between mt-5 flex-wrap gap-4">
            <View className="flex flex-row items-center">
              <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
                <Image source={icons.clock} className="size-4" />
              </View>
              <Text className="text-black-300 text-sm font-rubik-medium ml-2">
                {Math.floor(quiz?.basicInfo.timeLimit / 60)} minutes
              </Text>
            </View>

            <View className="flex flex-row items-center">
              <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
                <Image source={icons.star} className="size-4" />
              </View>
              <Text className="text-black-300 text-sm font-rubik-medium ml-2">
                {quiz?.settings.passingScore}% to pass
              </Text>
            </View>

            {quiz?.settings.allowRetake && (
              <View className="flex flex-row items-center">
                <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
                  <Image source={icons.refresh} className="size-4" />
                </View>
                <Text className="text-black-300 text-sm font-rubik-medium ml-2">
                  Retakes Allowed
                </Text>
              </View>
            )}
          </View>

          <View className="w-full border-t border-primary-200 pt-7 mt-5">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Engagement
            </Text>

            <View className="flex flex-row items-center justify-between mt-4">
              <View className="flex flex-row items-center gap-5">
                <View className="flex flex-row items-center">
                  <Image source={icons.eye} className="size-5" />
                  <Text className="text-black-200 ml-2">
                    {quiz?.views || 0}
                  </Text>
                </View>
                <View className="flex flex-row items-center">
                  <Image source={icons.heart} className="size-5" />
                  <Text className="text-black-200 ml-2">
                    {quiz?.likes?.length || 0}
                  </Text>
                </View>
                <View className="flex flex-row items-center">
                  <Image source={icons.comment} className="size-5" />
                  <Text className="text-black-200 ml-2">
                    {quiz?.comments?.length || 0}
                  </Text>
                </View>
                <View className="flex flex-row items-center">
                  <Image source={icons.share} className="size-5" />
                  <Text className="text-black-200 ml-2">
                    {quiz?.shares || 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {quiz?.basicInfo.description && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Description
              </Text>
              <Text className="text-black-200 text-base font-rubik mt-2">
                {quiz?.basicInfo.description}
              </Text>
            </View>
          )}

          {quiz?.targetingInfo.audience && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Target Audience
              </Text>
              <Text className="text-black-200 text-base font-rubik mt-2">
                {quiz?.targetingInfo.audience}
              </Text>
            </View>
          )}

          {quiz?.targetingInfo.businessGoal && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Business Goal
              </Text>
              <Text className="text-black-200 text-base font-rubik mt-2">
                {quiz?.targetingInfo.businessGoal}
              </Text>
            </View>
          )}

          {quiz?.targetingInfo.learningObjectives?.length > 0 && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Learning Objectives
              </Text>
              {quiz?.targetingInfo.learningObjectives?.map(
                (objective, index) => (
                  <View key={index} className="flex flex-row items-start mt-3">
                    <View className="size-2 rounded-full bg-primary-300 mr-3 mt-2" />
                    <Text className="text-black-200 text-base font-rubik flex-1">
                      {objective}
                    </Text>
                  </View>
                )
              )}
            </View>
          )}

          {quiz?.targetingInfo.prerequisites?.length > 0 && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Prerequisites
              </Text>
              {quiz?.targetingInfo.prerequisites?.map((prerequisite, index) => (
                <View key={index} className="flex flex-row items-start mt-3">
                  <View className="size-2 rounded-full bg-primary-300 mr-3 mt-2" />
                  <Text className="text-black-200 text-base font-rubik flex-1">
                    {prerequisite}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold mb-3">
              Quiz Settings
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {quiz?.settings.showTimer && (
                <View className="bg-primary-100 rounded-full px-4 py-2">
                  <Text className="text-xs font-rubik-bold text-primary-300">
                    Timer Enabled
                  </Text>
                </View>
              )}
              {quiz?.settings.shuffleQuestions && (
                <View className="bg-primary-100 rounded-full px-4 py-2">
                  <Text className="text-xs font-rubik-bold text-primary-300">
                    Shuffled Questions
                  </Text>
                </View>
              )}
              {quiz?.settings.showExplanations && (
                <View className="bg-primary-100 rounded-full px-4 py-2">
                  <Text className="text-xs font-rubik-bold text-primary-300">
                    Shows Explanations
                  </Text>
                </View>
              )}
              {quiz?.settings.allowSkip && (
                <View className="bg-primary-100 rounded-full px-4 py-2">
                  <Text className="text-xs font-rubik-bold text-primary-300">
                    Skip Questions
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              To Pass
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              {quiz?.settings.passingScore}%
            </Text>
          </View>

          <TouchableOpacity
            className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
            onPress={() => router.push(`/quiz/play/${id}`)}
          >
            <Image source={icons.play} className="size-5 mr-2" />
            <Text className="text-white text-lg text-center font-rubik-bold">
              Start Quiz
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Property;

/* import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { user, AuthContext, logout, useAuth } from "@/context/authContext";
import icons from "@/constants/icons";
import images from "@/constants/images";
import Comment from "@/components/Comment";
import { facilities } from "@/constants/data";
import avatar from "@/assets/images/logo.png";
import { useEffect } from "react";

const properties = {
  user: {
    name: "John Doe",
    avatar: avatar,
  },
  properties: [
    {
      $id: "1",
      name: "Luxury Villa",
      address: "123 Palm Street, Beverly Hills",
      price: "2,500",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&q=80",
    },
    {
      $id: "2",
      name: "Modern Apartment",
      address: "456 Downtown Ave, Los Angeles",
      price: "1,800",
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80",
    },
    {
      $id: "3",
      name: "Seaside Condo",
      address: "789 Ocean Drive, Malibu",
      price: "3,200",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80",
    },
    {
      $id: "4",
      name: "Mountain Retreat",
      address: "321 Highland Road, Hollywood Hills",
      price: "4,100",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80",
    },
  ],
};

const Property = () => {
  const { id } = useLocalSearchParams();
  const windowHeight = Dimensions.get("window").height;

  const property = properties.properties.find(
    (property) => property.$id === id
  );

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={properties.user.avatar}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image
                  source={icons.heart}
                  className="size-7"
                  tintColor={"#191D31"}
                />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">
            {property?.name}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {property?.type}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <Image source={icons.star} className="size-5" />
              <Text className="text-black-200 text-sm mt-1 font-rubik-medium">
                {property?.rating} ({property?.reviews.length} reviews)
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center mt-5">
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
              <Image source={icons.bed} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.bedrooms} Beds
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
              <Image source={icons.bath} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.bathrooms} Baths
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
              <Image source={icons.area} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.area} sqft
            </Text>
          </View>

          <View className="w-full border-t border-primary-200 pt-7 mt-5">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Agent
            </Text>

            <View className="flex flex-row items-center justify-between mt-4">
              <View className="flex flex-row items-center">
                <Image
                  source={properties?.user.avatar}
                  className="size-14 rounded-full"
                />

                <View className="flex flex-col items-start justify-center ml-3">
                  <Text className="text-lg text-black-300 text-start font-rubik-bold">
                    {property?.name}
                  </Text>
                  <Text className="text-sm text-black-200 text-start font-rubik-medium">
                    {property?.email}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <Image source={icons.chat} className="size-7" />
                <Image source={icons.phone} className="size-7" />
              </View>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Overview
            </Text>
            <Text className="text-black-200 text-base font-rubik mt-2">
              {property?.description}
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Facilities
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Location
            </Text>
            <View className="flex flex-row items-center justify-start mt-4 gap-2">
              <Image source={icons.location} className="w-7 h-7" />
              <Text className="text-black-200 text-sm font-rubik-medium">
                {property?.address}
              </Text>
            </View>

            <Image
              source={images.map}
              className="h-52 w-full mt-5 rounded-xl"
            />
          </View>
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              ${property?.price}
            </Text>
          </View>

          <TouchableOpacity className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400">
            <Text className="text-white text-lg text-center font-rubik-bold">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Property;
 */
