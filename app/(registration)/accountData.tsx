import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import i18next from "i18next";

import { useNavigation } from "@react-navigation/native";
import { ScaledSheet, moderateScale } from "react-native-size-matters";
import {
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, router, useLocalSearchParams } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import Input from "../../components/Input";
import {
  FIREBASE_AUTH,
  FIREBASE_STORAGE,
  FIREBASE_FIRESTORE,
} from "../../FirebaseConfig";

const angleLeftIcon = require("../../assets/icons/angle_left.png");

const styles = ScaledSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: "35@ms",
  },
  container_title: {
    flexGrow: 0.4,
    justifyContent: "flex-start",
    paddingTop: "10@ms",
  },
  container_form: {
    flexGrow: 0.4,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: "20@ms",
    paddingHorizontal: "20@ms",
  },
  container_button: {
    flexGrow: 0.2,
    justifyContent: "flex-end",
    paddingHorizontal: "20@ms",
    width: "100%",
  },
  title: {
    color: "black",
    fontSize: "40@ms",
    fontWeight: "bold",
  },
  button_back: {
    width: "30@ms",
    height: "30@ms",
    marginTop: "30@ms",
    marginLeft: "15@ms",
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  button_signUp: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50@ms",
    height: "48@ms",
    maxHeight: 80,
    width: "100%",
    maxWidth: 600,
    backgroundColor: "black",
  },
});

export default function AccountDataScreen() {
  const { name, dob, imgUrl } = useLocalSearchParams<{
    name: string;
    dob: string;
    imgUrl: string;
  }>();
  const [email, onChangeEmail] = useState("");
  const [pw, onChangePw] = useState("");
  const [pwRepeat, onChangePwRepeat] = useState("");
  const [mailError, setMailError] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwRepeatError, setPwRepeatError] = useState("");
  const [loading, setLoading] = useState(false);

  let inUse = false;

  const auth = FIREBASE_AUTH;
  const storage = FIREBASE_STORAGE;
  const db = FIREBASE_FIRESTORE;

  const uploadImageAsync = async (uri: string | undefined) => {
    if (uri) {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();

        const date = new Date().getTime().toString();
        const storageRef = ref(
          storage,
          `/images/profil/${date}not_verified.png`,
        );
        await uploadBytes(storageRef, blob).catch((error) => {});

        const url = await getDownloadURL(storageRef);

        return url;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // TODO handle Exception
      }
    }
    return "";
  };

  const createUser = async (user: User) => {
    if (dob) {
      const dateParts = dob.split(".");
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const year = parseInt(dateParts[2], 10);
      const date = new Date(year, month, day);
      try {
        await setDoc(doc(db, "users", user.uid), {
          USER_NAME: name,
          EMAIL: email,
          DOB: date,
          BLOCKED: false,
          SCORE: 0,
          NEW_CREATED: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // eslint-disable-next-line no-console
      }
    }
  };

  const signUp = async () => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, pw)
      .then(async (userCredential) => {
        try {
          await sendEmailVerification(userCredential.user);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // TODO handle Exception
        }

        await createUser(userCredential.user);

        await uploadImageAsync(imgUrl)
          .then(async (storageUri) => {
            await updateProfile(userCredential.user, {
              photoURL: storageUri,
            });
          })
          .finally(async () => {
            await updateProfile(userCredential.user, { displayName: name });
          });
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            setMailError(i18next.t("sign_up_mail_already_in_use"));
            inUse = true;
            break;
          default:
            break;
        }
      });
    setLoading(false);
  };

  const validate = () => {
    let valid = true;

    if (email.trim().length === 0) {
      valid = false;
      setMailError(i18next.t("sign_up_mail_error_empty"));
    } else if (
      !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      valid = false;
      setMailError(i18next.t("sign_up_mail_error_invalid"));
    }

    if (pw.trim().length <= 5) {
      valid = false;
      setPwError(i18next.t("sign_up_pw_error_characters"));
    }

    if (pw !== pwRepeat) {
      valid = false;
      setPwRepeatError(i18next.t("sign_up_pw_repeat_error"));
    }

    if (valid) {
      signUp().then(async () => {
        if (!inUse) {
          await auth.signOut();
          router.replace({
            pathname: "/login",
            params: { afterCreation: "true" },
          });
        }
      });
    }
  };

  const navigation = useNavigation();

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container_form}
        >
          <Input
            email
            placeholder={i18next.t("email")}
            error={mailError}
            onChange={onChangeEmail}
            setError={setMailError}
            value={email}
            password={false}
          />
          <Input
            email={false}
            placeholder={i18next.t("password")}
            error={pwError}
            onChange={onChangePw}
            setError={setPwError}
            value={pw}
            password
          />
          <Input
            email={false}
            placeholder={i18next.t("password_repeat")}
            error={pwRepeatError}
            onChange={onChangePwRepeat}
            setError={setPwRepeatError}
            value={pwRepeat}
            password
          />

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
              href={{ pathname: "/login", params: { afterCreation: "false" } }}
              style={{
                fontWeight: "bold",
                marginLeft: moderateScale(10),
                fontSize: moderateScale(12),
              }}
            >
              {i18next.t("login_title")}
            </Link>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.container_button}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button_signUp}
            onPress={validate}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  fontSize: moderateScale(15),
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {i18next.t("sign_up").toUpperCase()}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
