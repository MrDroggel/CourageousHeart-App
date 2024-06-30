import { TopicTranslKeys } from "@/constants/TopicTranslKeys";
import i18next from "i18next";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

interface ChipProps {
  label: TopicTranslKeys;
  isSelected: boolean;
  toggleSelected: () => void;
}

const styles = ScaledSheet.create({
  container: {
    justifyContent: "center",
    margin: "6@s",
    paddingHorizontal: "20@s",
    borderWidth: "1.5@s",
    borderRadius: "40@s",
    borderColor: "black",
    height: "40@s",
  },
  text: {
    fontSize: "14@s",
    fontWeight: "500",
  },
});

export function Chip({ label, isSelected, toggleSelected }: ChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isSelected ? "black" : "white" },
      ]}
      onPress={toggleSelected}
      activeOpacity={1}
    >
      <Text style={[styles.text, { color: isSelected ? "white" : "black" }]}>
        {i18next.t(label)}
      </Text>
    </TouchableOpacity>
  );
}
