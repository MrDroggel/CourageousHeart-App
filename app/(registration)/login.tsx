import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import i18next from "i18next";
import { ScaledSheet, scale } from "react-native-size-matters";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Toast from "react-native-root-toast";
import { Link, router, useLocalSearchParams } from "expo-router";
import ReactNativeModal from "react-native-modal";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import Input from "../../components/Input";

const angleLeftIcon = require("../../assets/icons/angle_left.png");
const signUpImage = require("../../assets/images/sign_up_3.png");
const close = require("../../assets/icons/close.png");

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    height: "100%",
    marginBottom: "35@s",
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
  container_overlay: {
    backgroundColor: "white",
    paddingTop: "30@s",
    paddingBottom: "20@s",
    borderTopStartRadius: "40@s",
    borderTopEndRadius: "40@s",
    justifyContent: "center",
  },
  container_image: {
    justifyContent: "center",
    flex: 1,
    width: "100%",
    height: scale(180),
  },
  container_title: {
    flex: 0.4,
    justifyContent: "flex-start",
    width: "100%",
  },
  container_form: {
    flex: 1.4,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: "15@s",
  },
  container_button: {
    paddingHorizontal: "20@s",
    width: "100%",
    flexGrow: 0.2,
    height: "15@s",
    justifyContent: "flex-end",
  },
  image: {
    width: "140@s",
    height: "140@s",
    alignSelf: "center",
    marginBottom: "25@s",
  },
  title: {
    color: "black",
    fontSize: "40@s",
    fontWeight: "bold",
    alignSelf: "center",
  },
  button_back: {
    width: "30@s",
    height: "30@s",
    marginTop: "30@s",
    marginLeft: "15@s",
    alignSelf: "flex-start",
  },
  button_login: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50@s",
    height: "48@s",
    width: "100%",
    marginTop: "10@s",
    backgroundColor: "black",
  },
  button_close: {
    alignSelf: "flex-end",
    height: "30@s",
    width: "30@s",
    marginEnd: "30@s",
    marginBottom: "10@s",
  },
});

export default function LoginScreen() {
  const { afterCreation } = useLocalSearchParams();

  const [email, onChangeEmail] = useState("");
  const [pw, onChangePw] = useState("");
  const [pwError, setPwError] = useState("");
  const [mailError, setMailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [afterAccCreation, setAfterAccCreation] = useState(false);

  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pw)
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-credential":
              setMailError(i18next.t("login_failed"));
              setPwError(i18next.t("login_failed"));
              break;
            default:
              break;
          }
        })
        .then((user) => {
          if (user) {
            if (!user.user.emailVerified) {
              setMailError(i18next.t("mail_verification_error"));
              setPwError(i18next.t("mail_verification_error"));
            }
          }
          setLoading(false);
        })
        .finally(() => {});
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // todo handle exception
    }
    setLoading(false);
  };

  const hideModal = () => {
    setAfterAccCreation(false);
  };

  const forgotPassword = async () => {
    if (email.trim().length !== 0) {
      await sendPasswordResetEmail(auth, email)
        .then(() => {
          Toast.show(i18next.t("reset_password"), {
            duration: 6000,
            position: Toast.positions.TOP,
            opacity: 1,
          });
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/user-not-found":
              setMailError(i18next.t("sign_up_mail_error_invalid"));
              break;
            default:
              break;
          }
        });
    } else {
      setMailError(i18next.t("reset_password_mail_empty"));
    }
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

    if (pw.trim().length === 0) {
      valid = false;
      setPwError(i18next.t("login_pw_empty"));
    }

    if (valid) {
      signIn();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (afterCreation === "true") {
      setAfterAccCreation(true);
      timer = setTimeout(() => {
        setAfterAccCreation(false);
      }, 10000); // Modal nach 5 Sekunden schließen
    }

    return () => {
      if (timer) clearTimeout(timer); // Bereinigen des Timers, falls der Effekt neu ausgelöst wird
    };
  }, [afterCreation]);

  return (
    <View style={{ backgroundColor: "white", alignItems: "center", flex: 1 }}>
      <ReactNativeModal
        isVisible={afterAccCreation}
        style={{ margin: 0, justifyContent: "flex-end" }}
        backdropOpacity={0.3}
        onBackdropPress={hideModal}
        animationInTiming={300}
        animationOutTiming={500}
      >
        <View style={styles.container_overlay}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_close}
            onPress={hideModal}
          >
            <Image
              source={close}
              style={{ height: scale(30), width: scale(30) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                fontSize: scale(25),
                fontWeight: "bold",
                paddingHorizontal: scale(20),
              }}
            >
              {i18next.t("check_inbox")}
            </Text>
          </View>
        </View>
      </ReactNativeModal>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button_back}
        onPress={router.back}
      >
        <Image
          source={angleLeftIcon}
          style={{ height: scale(20), width: scale(20) }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.container_title}>
          <Text style={styles.title}>
            {i18next.t("login_title").toUpperCase()}
          </Text>
        </View>

        <View style={styles.container_image}>
          <Image
            source={signUpImage}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container_form}
        >
          <Input
            email
            error={mailError}
            placeholder={i18next.t("email")}
            onChange={onChangeEmail}
            setError={setMailError}
            value={email}
            password={false}
          />
          <Input
            email={false}
            error={pwError}
            placeholder={i18next.t("password")}
            onChange={onChangePw}
            setError={setPwError}
            value={pw}
            password
          />
          <View>
            <Text
              style={{ fontWeight: "bold", marginBottom: scale(30) }}
              onPress={() => {
                forgotPassword();
              }}
            >
              {i18next.t("password_forgot")}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <Text>{i18next.t("no_account")}</Text>
            <Link
              href="/profilData"
              style={{
                fontWeight: "bold",
                marginLeft: scale(10),
              }}
            >
              <Text>{i18next.t("sign_up")}</Text>
            </Link>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.container_button}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button_login}
            onPress={() => {
              validate();
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  fontSize: scale(15),
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {i18next.t("login_action").toUpperCase()}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
