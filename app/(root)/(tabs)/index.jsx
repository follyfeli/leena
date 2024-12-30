import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
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
  console.log(user);
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

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

  const handleCardPress = (id) => router.push(`/detailscatalogue/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={properties.properties}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
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
                <Image
                  source={properties.user.avatar}
                  className="size-12 rounded-full"
                />

                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    {t("homemorning")}
                  </Text>
                  <Text className="text-base font-rubik-medium text-[#003333]">
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            <Search />

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-[#003333]">
                  Featured
                </Text>
                <View></View>
              </View>

              <FlatList
                data={properties.properties}
                renderItem={({ item }) => (
                  <FeaturedCard
                    item={item}
                    onPress={() => handleCardPress(item.$id)}
                  />
                )}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-5 mt-5"
              />
            </View>

            {/* <Button title="seed" onPress={seed} /> */}

            <View className="mt-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-[#003333]">
                  Our Recommendation
                </Text>
                <View></View>
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

const styles = StyleSheet.create({});
