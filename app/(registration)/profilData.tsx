import { View, Text, Platform, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import i18next from "i18next";

import * as Localization from "expo-localization";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { ScaledSheet, scale } from "react-native-size-matters";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import ReactNativeModal from "react-native-modal";
import Input from "../../components/Input";

const angleLeftIcon = require("../../assets/icons/angle_left.png");
const trashIcon = require("../../assets/icons/trash.png");
const userDefaultImage = require("../../assets/images/user_default.png");
const penIcon = require("../../assets/icons/pen_circle.png");
const angleRightIcon = require("../../assets/icons/angle_small_right.png");

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
    paddingBottom: "35@s",
  },
  container_title: {
    flex: 0.4,
    justifyContent: "flex-start",
    paddingTop: "10@s",
  },
  container_picture: {
    flex: 0.55,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: "20@s",
  },
  container_image: {
    height: "130@s",
  },
  container_form: {
    flex: 0.95,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  container_input: {
    width: "100%",
    paddingHorizontal: "20@s",
    marginBottom: "12@s",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  container_button: {
    flex: 0.3,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    paddingHorizontal: "20@s",
  },
  container_next: {
    width: "115@s",
    height: "48@s",
  },
  title: {
    color: "black",
    fontSize: "40@s",
    fontWeight: "bold",
  },
  default_profilPicture: {
    height: "125@s",
    width: "125@s",
    borderRadius: "80@s",
    borderWidth: "1.5@s",
    borderColor: "black",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    tintColor: "#ECDEEA",
  },
  profilPicture: {
    height: "125@s",
    width: "125@s",
    borderRadius: "80@s",
    borderWidth: 2,
    borderColor: "black",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  datePicker: {
    justifyContent: "center",
    paddingLeft: "20@s",
    borderRadius: "40@s",
    height: "48@s",
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "flex-end",
  },
  overlayContent: {
    backgroundColor: "lightgrey",
    padding: "20@s",
    borderTopStartRadius: "40@s",
    borderTopEndRadius: "40@s",
    justifyContent: "center",
  },
  button_back: {
    width: "30@s",
    height: "30@s",
    marginTop: "30@s",
    marginLeft: "15@s",
    alignSelf: "flex-start",
  },
  button_pen: {
    width: "33@s",
    height: "33@s",
    alignSelf: "flex-end",
    top: "-33@s",
    backgroundColor: "white",
    borderRadius: "50@s",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  button_trash: {
    width: "33@s",
    height: "33@s",
    alignSelf: "flex-end",
    top: "33@s",
    borderRadius: "50@s",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: "3@s",
    zIndex: 3,
  },
  button_ok: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderColor: "black",
    borderWidth: "1@s",
    height: "48@s",
    width: "120@s",
    marginTop: "10@s",
  },
  button_next: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50@s",
    width: "130@s",
    alignSelf: "flex-end",
    backgroundColor: "black",
  },
});

export default function ProfilDataScreen() {
  const [name, onChangeName] = useState("");
  const [nameError, setNameError] = useState("");
  const [dob, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [initial, setInitial] = useState(true);
  const [dobError, setDobError] = useState("");
  const [image, setImage] = useState("");

  const pickImage = async () => {
    const response =
      await ImagePicker.requestMediaLibraryPermissionsAsync(false);
    if (!response.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onChangeDate = (event: any, selectedDate: any) => {
    if (Platform.OS === "android") {
      setShow(false);
      setInitial(false);
    }
    setDate(selectedDate);
  };

  const showDatepicker = () => {
    setDobError("");
    setShow(true);
  };

  const hideDatepicker = () => {
    setShow(false);
  };

  const confirmDate = () => {
    setInitial(false);
    hideDatepicker();
  };

  const validate = () => {
    let valid = true;

    if (name.trim().length === 0) {
      valid = false;
      setNameError(i18next.t("sign_up_name_error"));
    }

    if (initial) {
      valid = false;
      setDobError(i18next.t("sign_up_dob_error_empty"));
    }

    if (valid) {
      router.push({
        pathname: "/accountData",
        params: { name, dob: dob.toLocaleDateString(), imgUrl: image },
      });
    }
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button_back}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={angleLeftIcon}
          style={{ height: scale(20), width: scale(20) }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.container_title}>
        <Text style={styles.title}>
          {i18next.t("sign_up_title").toUpperCase()}
        </Text>
      </View>

      <View style={styles.container_picture}>
        <View
          style={[
            styles.container_image,
            { top: image.length !== 0 ? -scale(33) : 0 },
          ]}
        >
          {image.length !== 0 && (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.button_trash}
              onPress={() => setImage("")}
            >
              <Image
                source={trashIcon}
                tintColor="white"
                resizeMode="contain"
                style={{ width: scale(16), height: scale(16) }}
              />
            </TouchableOpacity>
          )}
          {image.length === 0 ? (
            <Image
              source={userDefaultImage}
              resizeMode="contain"
              style={styles.default_profilPicture}
            />
          ) : (
            <Image
              source={{ uri: image }}
              resizeMode="contain"
              style={styles.profilPicture}
            />
          )}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_pen}
            onPress={pickImage}
          >
            <Image
              source={penIcon}
              resizeMode="contain"
              style={{ width: scale(27), height: scale(27) }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container_form}>
        <Input
          email={false}
          placeholder={i18next.t("name")}
          error={nameError}
          onChange={onChangeName}
          setError={setNameError}
          value={name}
          password={false}
        />
        <View style={styles.container_input}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={showDatepicker}
            style={[
              styles.datePicker,
              {
                borderColor: dobError.length !== 0 ? "red" : "black",
                borderWidth: dobError.length !== 0 ? scale(2) : scale(1),
              },
            ]}
          >
            {initial ? (
              <Text style={{ color: "gray" }}>{i18next.t("dob")}</Text>
            ) : (
              <Text style={{ color: "black" }}>{dob.toLocaleDateString()}</Text>
            )}
          </TouchableOpacity>
          <Text
            style={{ marginTop: scale(4), color: "red", fontSize: scale(11) }}
          >
            {dobError}
          </Text>
          {show && Platform.OS === "android" && (
            <View style={{ alignSelf: "center" }}>
              <DateTimePicker
                display="spinner"
                value={dob}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            </View>
          )}
          {Platform.OS === "ios" && (
            <ReactNativeModal
              isVisible={show}
              style={{ margin: 0, justifyContent: "flex-end" }}
              backdropOpacity={0}
              animationOutTiming={500}
            >
              <View style={styles.overlayContent}>
                <View style={{ alignSelf: "center" }}>
                  <DateTimePicker
                    display="spinner"
                    value={dob}
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                    locale={Localization.getLocales()[0].languageCode!}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.button_ok}
                  onPress={confirmDate}
                >
                  <Text
                    style={{
                      fontSize: scale(15),
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {i18next.t("ok").toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            </ReactNativeModal>
          )}
        </View>
        <View
          style={{
            flex: 0.3,
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "row",
            alignSelf: "center",
            paddingTop: scale(15),
          }}
        >
          <Text>{i18next.t("already_account")}</Text>
          <Link
            href="/login"
            style={{ fontWeight: "bold", marginLeft: scale(10) }}
          >
            {i18next.t("login_title")}
          </Link>
        </View>
      </View>

      <View style={styles.container_button}>
        <View style={styles.container_next}>
          <TouchableOpacity
            style={styles.button_next}
            activeOpacity={0.8}
            onPress={validate}
          >
            <Text
              style={{
                color: "white",
                marginEnd: scale(8),
                fontWeight: "bold",
                fontSize: scale(12),
              }}
            >
              {i18next.t("next").toUpperCase()}
            </Text>
            <Image
              source={angleRightIcon}
              resizeMode="contain"
              style={{
                height: scale(25),
                width: scale(25),
                tintColor: "white",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
