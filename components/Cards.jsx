import icons from "@/constants/icons";
import images from "@/constants/images";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const FeaturedCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-start w-60 h-80 relative"
    >
      <Image
        source={{ uri: item.coverImage || images.defaultQuizCover }}
        className="size-full rounded-2xl"
      />

      <Image
        source={images.cardGradient}
        className="size-full rounded-2xl absolute bottom-0"
      />

      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <Image source={icons.star} className="size-3.5" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-1">
          {item.settings.passingScore}%
        </Text>
      </View>

      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <Text
          className="text-xl font-rubik-extrabold text-white"
          numberOfLines={1}
        >
          {item.basicInfo.title}
        </Text>
        <Text className="text-base font-rubik text-white" numberOfLines={1}>
          {item.basicInfo.category} • {item.basicInfo.difficulty}
        </Text>

        <View className="flex flex-row items-center justify-between w-full mt-2">
          <View className="flex flex-row items-center">
            <Image source={icons.clock} className="size-4" />
            <Text className="text-sm font-rubik text-white ml-1">
              {Math.floor(item.basicInfo.timeLimit / 60)} min
            </Text>
          </View>

          <View className="flex flex-row items-center">
            <Image source={icons.heart} className="size-4" />
            <Text className="text-sm font-rubik text-white ml-1">
              {item.totalEngagement || 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const Card = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
      onPress={onPress}
    >
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <Image source={icons.star} className="size-2.5" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
          {item.settings.passingScore}%
        </Text>
      </View>

      <Image
        source={{ uri: item.coverImage || images.defaultQuizCover }}
        className="w-full h-40 rounded-lg"
      />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">
          {item.basicInfo.title}
        </Text>
        <Text className="text-xs font-rubik text-black-100">
          {item.basicInfo.category} • {item.basicInfo.difficulty}
        </Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <View className="flex flex-row items-center">
            <Image source={icons.clock} className="size-3.5" />
            <Text className="text-xs font-rubik text-black-100 ml-1">
              {Math.floor(item.basicInfo.timeLimit / 60)} min
            </Text>
          </View>

          <View className="flex flex-row items-center">
            <Image source={icons.users} className="size-3.5" />
            <Text className="text-xs font-rubik text-black-100 ml-1">
              {item.totalEngagement || 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* import icons from "@/constants/icons";
import images from "@/constants/images";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const FeaturedCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-start w-60 h-80 relative"
    >
      <Image source={item.coverImage} className="size-full rounded-2xl" />

      <Image
        source={images.cardGradient}
        className="size-full rounded-2xl absolute bottom-0"
      />

      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <Image source={icons.star} className="size-3.5" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-1">
          {item.rating}
        </Text>
      </View>

      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <Text
          className="text-xl font-rubik-extrabold text-white"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-base font-rubik text-white" numberOfLines={1}>
          {item.address}
        </Text>

        <View className="flex flex-row items-center justify-between w-full"></View>
      </View>
    </TouchableOpacity>
  );
};

export const Card = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
      onPress={onPress}
    >
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <Image source={icons.star} className="size-2.5" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
          {item.rating}
        </Text>
      </View>

      <Image source={{ uri: item.image }} className="w-full h-40 rounded-lg" />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">
          {item.name}
        </Text>
        <Text className="text-xs font-rubik text-black-100">
          {item.address}
        </Text>

        <View className="flex flex-row items-center justify-between mt-2"></View>
      </View>
    </TouchableOpacity>
  );
};
 */
