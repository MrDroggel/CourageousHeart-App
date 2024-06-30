import React from "react";
import { StyleSheet, View, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text>This is the ExploreScreen</Text>
    </View>
  );
}
