import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { scale } from "react-native-size-matters";
import { TabTranslKeys } from "@/constants/TabTranslKeys";
import { TabButton } from "../../components/TabButton";
import { tabIcons, renderTabIcon } from "../../components/BarIcons";

const tabScreens: { name: TabTranslKeys }[] = [
  { name: "index" },
  { name: "explore" },
  { name: "diary" },
  { name: "chats" },
  { name: "profil" },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ECDEEA",
          height: scale(75),
          alignItems: "center",
        },
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarButton: (props) => (
          <TabButton {...props} label={route.name as TabTranslKeys} />
        ),
      })}
    >
      {tabScreens.map(({ name }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarLabel: () => null,
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({ focused }) => (
              <View>
                {renderTabIcon({
                  focused,
                  icon: tabIcons[name],
                })}
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
