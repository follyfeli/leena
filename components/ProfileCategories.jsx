import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Individual category content components with more detailed implementations
const GalleryContent = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentTitle}>My Gallery</Text>
    <View style={styles.galleryGrid}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <View key={item} style={styles.galleryItem}>
          <Text>Image {item}</Text>
        </View>
      ))}
    </View>
  </View>
);

const ShopContent = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentTitle}>My Shop</Text>
    <View style={styles.shopItemsContainer}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.shopItem}>
          <Text>Product {item}</Text>
          <Text>$19.99</Text>
        </View>
      ))}
    </View>
  </View>
);

const ContactContent = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentTitle}>Contacts</Text>
    {[1, 2, 3].map((contact) => (
      <View key={contact} style={styles.contactItem}>
        <Text>Contact {contact}</Text>
        <Text>+1 234 567 8900</Text>
      </View>
    ))}
  </View>
);

const SettingsContent = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentTitle}>Settings</Text>
    {["Notifications", "Privacy", "Account", "Appearance"].map((setting) => (
      <TouchableOpacity key={setting} style={styles.settingItem}>
        <Text>{setting}</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    ))}
  </View>
);

const ProfileCategories = () => {
  const [activeCategory, setActiveCategory] = useState("Gallery");

  // Categories configuration with more explicit typing
  const categories = [
    {
      name: "Gallery",
      icon: "image-outline",
      component: GalleryContent,
    },
    {
      name: "Shop",
      icon: "cart-outline",
      component: ShopContent,
    },
    {
      name: "Contact",
      icon: "call-outline",
      component: ContactContent,
    },
    {
      name: "Settings",
      icon: "settings-outline",
      component: SettingsContent,
    },
  ];

  // Render the active content component with error handling
  const renderActiveContent = () => {
    const categoryMatch = categories.find((cat) => cat.name === activeCategory);

    if (!categoryMatch) {
      return (
        <View style={styles.contentContainer}>
          <Text>Category not found</Text>
        </View>
      );
    }

    const ActiveContent = categoryMatch.component;
    return <ActiveContent />;
  };

  return (
    <View style={styles.container}>
      {/* Horizontal Categories Scrollview */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              activeCategory === category.name && styles.activeCategoryButton,
            ]}
            onPress={() => {
              console.log(`Pressed ${category.name}`); // Debug log
              setActiveCategory(category.name);
            }}
          >
            <Ionicons
              name={category.icon}
              size={24}
              color={activeCategory === category.name ? "white" : "#007AFF"}
            />
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.name && styles.activeCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dynamic Content Area with Key for Re-rendering */}
      <View key={activeCategory} style={styles.contentWrapper}>
        {renderActiveContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: "#007AFF",
  },
  categoryText: {
    marginLeft: 8,
    color: "#007AFF",
    fontWeight: "600",
  },
  activeCategoryText: {
    color: "white",
  },
  contentWrapper: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  contentContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    minHeight: 200,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  // New styles for content
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  galleryItem: {
    width: "30%",
    height: 100,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  shopItemsContainer: {
    flexDirection: "column",
  },
  shopItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 10,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
});

export default ProfileCategories;

/* import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Individual category content components
const GalleryContent = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentTitle}>My Gallery</Text>
  </View>
);

const ShopContent = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentTitle}>My Shop</Text>
  </View>
);

const ContactContent = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentTitle}>Contacts</Text>
  </View>
);

const SettingsContent = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentTitle}>Settings</Text>
  </View>
);

const ProfileCategories = () => {
  const [activeCategory, setActiveCategory] = useState("Gallery");

  // Categories configuration
  const categories = [
    {
      name: "Gallery",
      icon: "image-outline",
      component: GalleryContent,
    },
    {
      name: "Shop",
      icon: "cart-outline",
      component: ShopContent,
    },
    {
      name: "Contact",
      icon: "call-outline",
      component: ContactContent,
    },
    {
      name: "Settings",
      icon: "settings-outline",
      component: SettingsContent,
    },
  ];

  // Render the active content component
  const ActiveContent = categories.find(
    (cat) => cat.name === activeCategory
  ).component;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              activeCategory === category.name && styles.activeCategoryButton,
            ]}
            onPress={() => setActiveCategory(category.name)}
          >
            <Ionicons
              name={category.icon}
              size={24}
              color={activeCategory === category.name ? "white" : "#007AFF"}
            />
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.name && styles.activeCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.contentWrapper}>
        <ActiveContent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: "#007AFF",
  },
  categoryText: {
    marginLeft: 8,
    color: "#007AFF",
    fontWeight: "600",
  },
  activeCategoryText: {
    color: "white",
  },
  contentWrapper: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  contentContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    minHeight: 200,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
});

export default ProfileCategories;
 */
