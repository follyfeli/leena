import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/service/firebase/firebaseconfig";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import { Card, FeaturedCard } from "@/components/Cards";
import avatar from "@/assets/images/logo.png";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/i18n";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  /*  useEffect(() => {
    fetchQuizzes();
    console.log("les quizzes:", quizzes);
    console.log("les quizzes:", quizzes.quizId);
  }, [params.filter, quizzes.length]); */

  const fetchQuizzes = async () => {
    try {
      setLoading(true);

      // Fetch all quizzes and calculate engagement
      const allQuizzesQuery = query(collection(db, "quizzes"));
      const allQuizzesSnapshot = await getDocs(allQuizzesQuery);

      // Map and calculate engagement for each quiz
      const allQuizzesWithEngagement = allQuizzesSnapshot.docs.map((doc) => {
        const data = doc.data();
        // Calculate engagement based on likes and comments length
        // If these arrays don't exist, default to empty arrays
        const likesCount = data.likes?.length || 0;
        const commentsCount = data.comments?.length || 0;
        const totalEngagement = likesCount + commentsCount;

        return {
          $id: doc.id,
          ...data,
          totalEngagement,
        };
      });

      // Sort by engagement and get top 5 for featured
      const sortedQuizzes = [...allQuizzesWithEngagement].sort(
        (a, b) => b.totalEngagement - a.totalEngagement
      );
      setFeaturedQuizzes(sortedQuizzes.slice(0, 5));

      // Handle filtering
      if (params.filter && params.filter !== "All") {
        const filtered = allQuizzesWithEngagement.filter(
          (quiz) => quiz.category === params.filter
        );
        setQuizzes(filtered);
      } else {
        setQuizzes(allQuizzesWithEngagement);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = () =>
    router.push(`/detailscatalogue/${quizzes.quizId}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={quizzes}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(quizzes.quizId)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image source={avatar} className="size-12 rounded-full" />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    {t("homemorning")}
                  </Text>
                  <Text className="text-base font-rubik-medium text-[#003333]">
                    {user?.name ?? ""}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            <Search />

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-[#003333]">
                  {t("homefeaturedquiz")}
                </Text>
              </View>

              <FlatList
                data={featuredQuizzes}
                renderItem={({ item }) => (
                  <FeaturedCard
                    item={item}
                    onPress={() => handleCardPress(featuredQuizzes.quizId)}
                  />
                )}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-5 mt-5"
              />
            </View>

            <View className="mt-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-[#003333]">
                  {t("homeallquizzes")}
                </Text>
              </View>

              <Filters />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
