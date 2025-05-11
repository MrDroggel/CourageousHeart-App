import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  GestureResponderEvent,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import i18next from "i18next";
import { TabTranslKeys } from "@/constants/TabTranslKeys";

interface TabButtonProps {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  label: TabTranslKeys;
}

export function TabButton({ children, onPress, label }: TabButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        margin: moderateScale(3.5),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <View
        style={{
          width: moderateScale(60),
          height: moderateScale(45),
          backgroundColor: useIsFocused() ? "#fff" : "#ECDEEA",
          borderRadius: moderateScale(35),
        }}
      >
        {children}
      </View>
      <Text
        style={{ fontSize: moderateScale(11), marginTop: moderateScale(4) }}
      >
        {label === "index"
          ? i18next.t("home").toLocaleUpperCase()
          : i18next.t(label).toLocaleUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}
