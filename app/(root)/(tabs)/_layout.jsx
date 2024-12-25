import { Tabs } from "expo-router";
import { Image, View, StyleSheet } from "react-native";
import icons from "../../../constants/icons";

const TabIcon = ({ focused, icon, title }) => (
  <View style={styles.container}>
    <Image
      source={icon}
      tintColor={focused ? "#003333" : "#666876"}
      resizeMode="contain"
      style={styles.icon}
    />
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          position: "absolute",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
    flexDirection: "column",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
