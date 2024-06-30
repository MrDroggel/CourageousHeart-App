import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { ScaledSheet, scale } from "react-native-size-matters";
import i18next from "../../services/i18next";

const signUpImage = require("../../assets/images/sign_up_1.png");

const styles = ScaledSheet.create({
  container_outer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: "35@s",
    width: "100%",
  },
  container_title: {
    alignItems: "center",
    flex: 0.5,
    justifyContent: "flex-start",
  },
  container_description: {
    paddingHorizontal: "20@s",
    alignItems: "center",
    flex: 0.8,
  },
  container_image: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
  },
  container_buttons: {
    paddingHorizontal: "20@s",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  title: {
    color: "#AF8FEA",
    fontSize: "40@s",
    fontWeight: "bold",
  },
  image: {
    width: "200@s",
    height: "200@s",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50@s",
    backgroundColor: "#C6B1ED",
    height: "48@s",
    width: "100%",
    marginTop: "25@s",
  },
});

export default function LandingScreen() {
  return (
    <View style={styles.container_outer}>
      <View style={styles.container_title}>
        <Text style={styles.title}>{i18next.t("welcome").toUpperCase()}</Text>
      </View>

      <View style={styles.container_description}>
        <Text style={{ textAlign: "center", fontSize: scale(12) }}>
          {i18next.t("welcome_text")}
        </Text>
      </View>

      <View style={styles.container_image}>
        <Image source={signUpImage} resizeMode="contain" style={styles.image} />
      </View>

      <View style={styles.container_buttons}>
        <Link href="/login" asChild>
          <TouchableOpacity activeOpacity={0.8} style={styles.button}>
            <Text
              style={{
                fontSize: scale(15),
                color: "white",
                fontWeight: "bold",
              }}
            >
              {i18next.t("login_title").toUpperCase()}
            </Text>
          </TouchableOpacity>
        </Link>
        <Link href="/profilData" asChild>
          <TouchableOpacity activeOpacity={0.8} style={styles.button}>
            <Text
              style={{
                fontSize: scale(15),
                color: "white",
                fontWeight: "bold",
              }}
            >
              {i18next.t("sign_up").toUpperCase()}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
