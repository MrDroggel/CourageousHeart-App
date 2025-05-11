import { View, Text, Platform, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import i18next from "i18next";

import * as Localization from "expo-localization";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { ScaledSheet, moderateScale } from "react-native-size-matters";
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
    paddingBottom: "35@ms",
  },
  container_title: {
    flex: 0.4,
    justifyContent: "flex-start",
    paddingTop: "10@ms",
  },
  container_picture: {
    flex: 0.55,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: "20@ms",
  },
  container_image: {
    height: "130@ms",
  },
  container_form: {
    flex: 0.95,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: "20@ms",
  },
  container_picker: {
    justifyContent: "center",
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  container_button: {
    flex: 0.3,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    paddingHorizontal: "20@ms",
  },
  container_next: {
    width: "115@ms",
    height: "48@ms",
  },
  title: {
    color: "black",
    fontSize: "40@ms",
    fontWeight: "bold",
  },
  default_profilPicture: {
    height: "125@ms",
    width: "125@ms",
    borderRadius: "80@ms",
    borderWidth: "1.5@ms",
    borderColor: "black",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    tintColor: "#ECDEEA",
  },
  profilPicture: {
    height: "125@ms",
    width: "125@ms",
    borderRadius: "80@ms",
    borderWidth: "1.5@ms",
    borderColor: "black",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  datePicker: {
    justifyContent: "center",
    paddingLeft: "20@ms",
    borderRadius: "40@ms",
    height: "48@ms",
    maxHeight: 80,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    fontSize: "14@ms",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "flex-end",
  },
  overlayContent: {
    backgroundColor: "lightgrey",
    padding: "20@ms",
    borderTopStartRadius: "40@ms",
    borderTopEndRadius: "40@ms",
    justifyContent: "center",
  },
  button_back: {
    width: "30@ms",
    height: "30@ms",
    marginTop: "30@ms",
    marginLeft: "15@ms",
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  button_pen: {
    width: "33@ms",
    height: "33@ms",
    alignSelf: "flex-end",
    top: "-33@ms",
    backgroundColor: "white",
    borderRadius: "50@ms",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  button_trash: {
    width: "33@ms",
    height: "33@ms",
    alignSelf: "flex-end",
    top: "33@ms",
    borderRadius: "50@ms",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: "3@ms",
    zIndex: 3,
  },
  button_ok: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50@ms",
    borderColor: "black",
    borderWidth: "1@ms",
    height: "48@ms",
    width: "120@ms",
    marginTop: "10@ms",
  },
  button_next: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50@ms",
    width: "130@ms",
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
          style={{ height: moderateScale(25), width: moderateScale(25) }}
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
            { top: image.length !== 0 ? -moderateScale(33) : 0 },
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
                style={{ width: moderateScale(16), height: moderateScale(16) }}
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
              style={{ width: moderateScale(27), height: moderateScale(27) }}
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
        <View style={styles.container_picker}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={showDatepicker}
            style={[
              styles.datePicker,
              {
                borderColor: dobError.length !== 0 ? "#B00020" : "black",
                borderWidth:
                  dobError.length !== 0 ? moderateScale(2) : moderateScale(1.5),
              },
            ]}
          >
            {initial ? (
              <Text style={{ color: "gray", fontSize: moderateScale(14) }}>
                {i18next.t("dob")}
              </Text>
            ) : (
              <Text style={{ color: "black", fontSize: moderateScale(14) }}>
                {dob.toLocaleDateString()}
              </Text>
            )}
          </TouchableOpacity>
          <Text
            style={{
              marginTop: moderateScale(4),
              color: "#B00020",
              fontSize: moderateScale(11),
            }}
          >
            {dobError}
          </Text>
        </View>
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
                    fontSize: moderateScale(15),
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
        <View
          style={{
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "row",
            alignSelf: "center",
            paddingTop: moderateScale(15),
          }}
        >
          <Text style={{ fontSize: moderateScale(12) }}>
            {i18next.t("already_account")}
          </Text>
          <Link
            href="/login"
            style={{
              fontWeight: "bold",
              marginLeft: moderateScale(10),
              fontSize: moderateScale(12),
            }}
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
                marginEnd: moderateScale(8),
                fontWeight: "bold",
                fontSize: moderateScale(12),
              }}
            >
              {i18next.t("next").toUpperCase()}
            </Text>
            <Image
              source={angleRightIcon}
              resizeMode="contain"
              style={{
                height: moderateScale(25),
                width: moderateScale(25),
                tintColor: "white",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
