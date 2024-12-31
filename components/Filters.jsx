import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, ScrollView, TouchableOpacity, View } from "react-native";
import Colors from "@/constants/Colors";
import { useLanguage } from "@/i18n";

const Filters = () => {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    params.filter || "All"
  );

  const categories = [
    { title: t("categoriesfirsttitle"), category: "All", icon: "🔍" },
    { title: t("categoriessecondtitle"), category: "Core", icon: "📚" },
    { title: t("categoriesthirdtitle"), category: "Languages", icon: "🗣️" },
    { title: t("categoriesfourthtitle"), category: "Business", icon: "💼" },
    { title: t("categoriesfifthtitle"), category: "Tech", icon: "💻" },
    { title: t("categoriessixththitle"), category: "Creative", icon: "🎨" },
    { title: t("categoriesseventhtitle"), category: "Health", icon: "🧘‍♀️" },
    { title: t("categorieseighthtitle"), category: "Lifestyle", icon: "🌟" },
    { title: t("categoriesninthtitle"), category: "Professional", icon: "📊" },
    { title: t("categoriestenthtitle"), category: "Others", icon: "✨" },
  ];

  const handleCategoryPress = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      router.setParams({ filter: "" });
      return;
    }

    setSelectedCategory(category);
    router.setParams({ filter: category });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      {categories.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleCategoryPress(item.category)}
          key={index}
          className={`flex flex-row items-center mr-4 px-4 py-2 rounded-full ${
            selectedCategory === item.category
              ? "bg-[#003333] border border-primary-200"
              : "bg-primary-100 border border-primary-200"
          }`}
        >
          <Text className="mr-2">{item.icon}</Text>
          <Text
            className={`text-sm ${
              selectedCategory === item.category
                ? "text-[#FFA500] font-rubik-bold"
                : "text-black-300 font-rubik"
            }`}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Filters;
