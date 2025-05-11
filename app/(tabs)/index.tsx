import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import i18next from "i18next";
import { router } from "expo-router";
import {
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Topics } from "@/constants/Topics";
import { Chip } from "@/components/Chip";
import ReactNativeModal from "react-native-modal";
import { TopicTranslKeys } from "@/constants/TopicTranslKeys";
import { Trans } from "react-i18next";
import Carousel from "react-native-reanimated-carousel";
import "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from "../../FirebaseConfig";

interface TroubleAnswer {
  message: string;
  message_original: string;
  sender_name: string;
  sender_id: string;
  liked: boolean;
}

const map = require("../../assets/icons/map.png");
const help = require("../../assets/icons/question.png");
const userDefaultImage = require("../../assets/images/user_default.png");
const heartSolid = require("../../assets/icons/heart_solid.png");
const heartRegular = require("../../assets/icons/heart_regular.png");
const mentalHealth = require("../../assets/images/mental_health.png");
const abuse = require("../../assets/images/abuse.png");
const body = require("../../assets/images/female_body.png");
const send = require("../../assets/icons/send.png");
const close = require("../../assets/icons/close.png");
const paperPlanes = require("../../assets/images/paper_planes.png");
const report = require("../../assets/icons/report.png");

const auth = FIREBASE_AUTH;
const db = FIREBASE_FIRESTORE;
const HEADER_MAX_HEIGHT = moderateScale(250);
const OPACITY_MIN = -1;
const OPACITY_MAX = 1;

const styles = ScaledSheet.create({
  container_overlay: {
    backgroundColor: "white",
    paddingTop: "20@ms",
    borderTopStartRadius: "40@ms",
    borderTopEndRadius: "40@ms",
    justifyContent: "center",
  },
  container_content: {
    backgroundColor: "#ECDEEA",
    borderTopRightRadius: "40@ms",
    borderTopLeftRadius: "40@ms",
    paddingVertical: "20@ms",
    width: "100%",
    height: "370@ms",
  },
  container_topics: {
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: "10@ms",
    width: "100%",
  },
  container_info_buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "15@ms",
    paddingVertical: "15@ms",
    alignSelf: "flex-end",
    width: "100%",
    zIndex: 2,
  },
  container_header: {
    backgroundColor: "#ECDEEA",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    width: "100%",
    height: HEADER_MAX_HEIGHT,
    alignItems: "center",
    paddingTop: "30@ms",
  },
  container_scroll_outer: {
    flexGrow: 1,
    backgroundColor: "white",
    width: Dimensions.get("window").width,
    marginTop: "190@ms",
    paddingBottom: "240@ms",
  },
  container_scroll_inner: {
    flexGrow: 1,
    paddingVertical: "40@ms",
    backgroundColor: "white",
  },
  container_greeting: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "25@ms",
  },
  container_score: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10@ms",
    borderRadius: "40@ms",
    height: "35@ms",
    width: "90@ms",
  },
  container_input: {
    position: "absolute",
    bottom: "30@ms",
    elevation: 5,
    height: "48@ms",
    backgroundColor: "white",
    flexDirection: "row",
    paddingLeft: "20@ms",
    borderRadius: "50@ms",
    borderColor: "black",
    borderWidth: "1.5@ms",
    width: "100%",
    alignItems: "center",
  },
  container_troubleBox: {
    flex: 1,
    paddingHorizontal: "15@ms",
  },
  conatiner_topics: {
    paddingTop: "60@ms",
    flex: 1,
    paddingHorizontal: "15@ms",
  },
  container_fab: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: "15@ms",
  },
  container_message: {
    backgroundColor: "#ECDEEA",
    borderRadius: "15@ms",
    elevation: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: "2@ms",
    alignSelf: "center",
  },
  container_message_text: {
    backgroundColor: "black",
    borderWidth: 1,
    borderTopLeftRadius: "15@ms",
    borderTopRightRadius: "15@ms",
    borderBottomLeftRadius: "15@ms",
    borderBottomRightRadius: "15@ms",
    paddingBottom: "15@ms",
    justifyContent: "center",
    alignItems: "center",
    height: "85@ms",
  },
  profilPicture: {
    borderRadius: "80@ms",
    borderColor: "black",
    borderWidth: "1.5@ms",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20@ms",
  },
  button_map: {
    width: "55@ms",
    height: "55@ms",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "80@ms",
    backgroundColor: "black",
    alignSelf: "flex-start",
    zIndex: 2,
  },
  button_help: {
    width: "35@ms",
    height: "35@ms",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "80@ms",
    borderWidth: "2@ms",
    borderColor: "black",
    alignSelf: "flex-start",
    zIndex: 2,
  },
  text_greeting: {
    fontSize: "18@ms",
    fontWeight: "300",
  },
  text_name: {
    fontSize: "18@ms",
    fontWeight: "bold",
    marginLeft: "5@ms",
    borderColor: "black",
  },
  text_score: {
    fontSize: "15@ms",
    fontWeight: "bold",
    marginLeft: "5@ms",
  },
  button_save: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50@ms",
    backgroundColor: "black",
    height: "48@ms",
    maxHeight: 80,
    width: "150@ms",
  },
  button_getMessage: {
    marginTop: "25@ms",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50@ms",
    backgroundColor: "black",
    height: "48@ms",
    maxHeight: 80,
    width: "100%",
  },
  keyboardAvoidingView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  textInput: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: "20@ms",
    borderRadius: "25@ms",
    backgroundColor: "white",
    borderWidth: "1@ms",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: "2@ms",
    height: "48@ms",
    elevation: 3,
  },
  fab: {
    backgroundColor: "black",
    justifyContent: "center",
    paddingHorizontal: "20@ms",
    height: "48@ms",
    width: "48@ms",
    borderRadius: "25@ms",
    marginLeft: "10@ms",
    elevation: 3,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: "2@ms",
  },
  text_fab: {
    color: "white",
    fontSize: moderateScale(16),
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 2,
  },
  overlayTouchable: {
    flex: 1,
  },
  button_close: {
    alignSelf: "flex-end",
    height: "30@ms",
    width: "30@ms",
    alignItems: "center",
    justifyContent: "center",
    marginEnd: "20@ms",
    marginBottom: "20@ms",
  },
  text_message: {
    color: "white",
    fontWeight: "semibold",
    fontSize: "14@ms",
  },
  text_user: {
    fontWeight: "bold",
    color: "#BF9ED9",
  },
  messageInfo: {
    flexDirection: "row",
    height: "40@ms",
    alignItems: "center",
  },
  card_topics: {
    borderRadius: "20@ms",
    width: "105@ms",
    justifyContent: "space-between",
    paddingBottom: "5@ms",
  },
  text_topics: {
    marginHorizontal: "10@ms",
    marginTop: "15@ms",
    fontSize: "11@ms",
    fontWeight: "bold",
  },
});

export default function HomeScreen() {
  const time = new Date().getHours();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const ref = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [message, setMessage] = useState("");
  const [messageAnswer, setMessageAnswer] = useState("");
  const [answerSent, setAnswerSent] = useState(false);
  const [fieldHeight, setFieldHeight] = useState(moderateScale(48));
  const [fieldHeightTrouble, setFieldHeightTrouble] = useState(
    moderateScale(48),
  );
  const [inputHeight, setInputHeight] = useState(moderateScale(18));
  const [inputHeightTrouble, setInputHeightTrouble] = useState(
    moderateScale(18),
  );
  const [initialHeight, setInitialHeight] = useState(moderateScale(18));
  const [initialHeightTrouble, setInitialHeightTrouble] = useState(
    moderateScale(18),
  );
  const [lineCount, setLineCount] = useState(1);
  const [lineCountTrouble, setLineCountTrouble] = useState(1);
  const [userData, setUserData] = useState<DocumentData>();
  const [messages, setMessages] = useState<TroubleAnswer[]>([]);
  const [selectedItem, setSelectedItem] = useState<TroubleAnswer | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [showHistory, setShowHistory] = useState(false);

  const [randomMessage, setRandomMessage] = useState<{
    id: string;
    data: DocumentData;
  }>();
  const [showTopics, setShowTopics] = useState(true);
  const [showfinalizeMessage, setShowFinalizeMessage] = useState(false);
  const [showRandomMessage, setShowRandomMessage] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [emptyTroubleBox, setEmptyTroubleBox] = useState(false);
  const [selectedLabels, setSelectedTopics] = useState<{
    [key: number]: boolean;
  }>({});

  const [carouselHeight, setCarouselHeight] = useState(
    Dimensions.get("window").width * 0.6,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [displayText, setDisplayText] = useState("0");

  const { width: screenWidth } = Dimensions.get("window");
  const score = useSharedValue<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setText = (text: string) => {
    setDisplayText(text);
  };

  const countTo = useCallback(
    (endValue: number) => {
      score.value = withTiming(endValue, { duration: 900 }, (isFinished) => {
        if (isFinished) {
          // setText(score.value.toString());
        }
      });
    },
    [score],
  );

  const toggleLabel = (id: number) => {
    setSelectedTopics((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      // Live-Listener für Benutzerdaten
      const userDocRef = doc(db, "users", user.uid);
      // eslint-disable-next-line consistent-return
      const unsubscribeUser = onSnapshot(userDocRef, (userDocSnap) => {
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData(data);

          countTo(data.SCORE);

          const fetchedMessages: TroubleAnswer[] = [];

          // Falls der Benutzer als neu markiert ist, füge eine Willkommensnachricht hinzu
          if (data.NEW_CREATED) {
            const answer: TroubleAnswer = {
              message: i18next.t("first_message"),
              message_original: "",
              sender_name: "CourageousHeart",
              sender_id: "welcomeMessage",
              liked: false,
            };
            fetchedMessages.push(answer);
          }

          // Echtzeit-Listener für Nachrichten
          const troubleBoxDocRef = collection(db, "troubleBox");
          const q = query(
            troubleBoxDocRef,
            where("RECIPIENT_ID", "==", user.uid),
          );

          const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
            const liveMessages: TroubleAnswer[] = [...fetchedMessages]; // Enthält bereits die Willkommensnachricht, falls vorhanden

            querySnapshot.forEach((document) => {
              const answerData = document.data();
              const answer: TroubleAnswer = {
                message: answerData.MESSAGE,
                message_original: answerData.MESSAGE_ORIGINAL,
                sender_name: answerData.SENDER_NAME,
                sender_id: answerData.SENDER_ID, // Korrigiere den Typo hier: 'SENDER_UD' -> 'SENDER_ID'
                liked: false,
              };
              liveMessages.push(answer);
            });

            setMessages(liveMessages);
          });

          // Clean-up Funktion für den Nachrichten-Listener
          return () => unsubscribeMessages();
        }
        // Wenn der Benutzer nicht existiert, leite zu Registrierung weiter
        router.replace("/(registration)");
      });

      // Clean-up Funktion für den Benutzer-Listener
      return () => unsubscribeUser();
    }
  }, [countTo]);

  useEffect(() => {
    if (inputHeight !== 0 && initialHeight === moderateScale(18)) {
      setInitialHeight(inputHeight);
    }
  }, [initialHeight, inputHeight]);

  useEffect(() => {
    if (
      inputHeightTrouble !== 0 &&
      initialHeightTrouble === moderateScale(18)
    ) {
      setInitialHeightTrouble(inputHeightTrouble);
    }
  }, [initialHeightTrouble, inputHeightTrouble]);

  const hideFilter = () => {
    setShowTopics(false);
  };

  const hideMessage = () => {
    setShowFinalizeMessage(false);
  };

  const getSelectedLabelIds = () =>
    Object.keys(selectedLabels)
      .filter((key) => selectedLabels[parseInt(key, 10)])
      .map((key) => parseInt(key, 10));

  const handleOverlayPress = () => {
    setIsFocused(false);
    setMessage("");
    setInputHeight(initialHeight);
    setLineCount(1);
    Keyboard.dismiss();
  };

  const saveTopics = (isMessage: boolean) => {
    const topics: string[] = [];
    const ids = getSelectedLabelIds();

    ids.forEach((id) => {
      switch (id) {
        case 1:
          topics.push("bullying");
          break;
        case 2:
          topics.push("death");
          break;
        case 3:
          topics.push("break up");
          break;
        case 4:
          topics.push("depression");
          break;
        case 5:
          topics.push("sexual assault");
          break;
        case 6:
          topics.push("pregnancy");
          break;
        case 7:
          topics.push("suicide");
          break;
        case 8:
          topics.push("rape");
          break;
        case 9:
          topics.push("menstruation");
          break;
        case 10:
          topics.push("domestic violence");
          break;
        default:
          break;
      }
    });

    const user = auth.currentUser;
    if (user && userData) {
      if (!isMessage) {
        const docRef = doc(db, "users", user.uid);
        const updatedData = {
          TOPICS: topics,
        };
        updateDoc(docRef, updatedData).then(() => {
          hideFilter();
        });
      } else {
        try {
          addDoc(collection(db, "troubleBox"), {
            MESSAGE: message,
            SENDER_NAME: userData.USER_NAME,
            DOB: userData.DOB,
            SENDER_ID: user.uid,
            TOPICS: topics,
            ANSWERED: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // TODO handle Exception
        }
        hideMessage();
        handleOverlayPress();
        ids.forEach((id) => {
          toggleLabel(id);
        });
      }
    }
  };

  const sendTroubleAnswer = async (
    recipientId: string,
    originalMessage: string,
    messageId: string,
  ) => {
    const user = auth.currentUser;
    if (user && userData) {
      try {
        await addDoc(collection(db, "troubleBox"), {
          MESSAGE_ORIGINAL: originalMessage,
          MESSAGE: messageAnswer,
          SENDER_NAME: userData.USER_NAME,
          SENDER_ID: user.uid,
          RECIPIENT_ID: recipientId,
        });

        const messageDocRef = doc(db, "troubleBox", messageId);
        await updateDoc(messageDocRef, {
          ANSWERED: true,
        });

        setAnswerSent(true);
        Keyboard.dismiss();

        setTimeout(() => {
          setShowRandomMessage(false);
          setMessageAnswer("");
        }, 500);

        setTimeout(() => {
          setAnswerSent(false);
          setRandomMessage(undefined);
        }, 5000);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // TODO: Fehlerbehandlung
      }
    }
  };

  const headerY = scrollOffsetY.interpolate({
    inputRange: [0, moderateScale(190)],
    outputRange: [0, moderateScale(-100)],
    extrapolate: "clamp",
  });

  const radius = scrollOffsetY.interpolate({
    inputRange: [0, moderateScale(190)],
    outputRange: [moderateScale(40), 0],
  });

  const scoreTop = scrollOffsetY.interpolate({
    inputRange: [0, moderateScale(190)],
    outputRange: [0, moderateScale(-109)],
    extrapolate: "clamp",
  });

  const scoreColor = scrollOffsetY.interpolate({
    inputRange: [moderateScale(100), moderateScale(190)],
    outputRange: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"],
    extrapolate: "clamp",
  });

  const animatedOpacity = scrollOffsetY.interpolate({
    inputRange: [0, moderateScale(250)],
    outputRange: [OPACITY_MAX, OPACITY_MIN],
    extrapolate: "clamp",
  });

  const getGreeting = () => {
    if (time < 11) {
      return (
        <Animated.Text
          style={[
            styles.text_greeting,
            {
              opacity: animatedOpacity,
            },
          ]}
        >
          {i18next.t("good_morning")}
        </Animated.Text>
      );
    }
    if (time < 17) {
      return (
        <Animated.Text
          style={[
            styles.text_greeting,
            {
              opacity: animatedOpacity,
            },
          ]}
        >
          {i18next.t("good_day")}
        </Animated.Text>
      );
    }
    return (
      <Animated.Text
        style={[
          styles.text_greeting,
          {
            opacity: animatedOpacity,
          },
        ]}
      >
        {i18next.t("good_evening")}
      </Animated.Text>
    );
  };

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/(registration)");
  };

  const handleContentSizeChange = async (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const newheight = event.nativeEvent.contentSize.height;

    if (Platform.OS === "android" && lineCount < 6 && newheight > inputHeight) {
      setInputHeight(newheight);
      setFieldHeight(newheight + moderateScale(30));

      setLineCount((prevCount) => {
        const updatedCount = prevCount + 1;
        return updatedCount;
      });
    } else if (Platform.OS === "android" && newheight <= inputHeight) {
      setInputHeight(newheight);
      setFieldHeight(newheight + moderateScale(30));
      setLineCount((prevCount) => {
        let updatedCount = prevCount;
        if (lineCount === 2) {
          updatedCount = prevCount;
        } else if (lineCount === 1) {
          updatedCount = prevCount + 1;
        } else {
          updatedCount = prevCount - 1;
        }
        return updatedCount;
      });
    } else if (Platform.OS === "ios") {
      setInputHeight(newheight);
      setFieldHeight(newheight + moderateScale(30));
    }
  };

  const handleContentSizeChangeTrouble = async (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const newheight = event.nativeEvent.contentSize.height;

    if (
      Platform.OS === "android" &&
      lineCountTrouble < 4 &&
      newheight > inputHeightTrouble
    ) {
      setInputHeightTrouble(newheight);
      setFieldHeightTrouble(newheight + moderateScale(30));

      setLineCountTrouble((prevCount) => {
        const updatedCount = prevCount + 1;
        return updatedCount;
      });
    } else if (Platform.OS === "android" && newheight <= inputHeightTrouble) {
      setInputHeightTrouble(newheight);
      setFieldHeightTrouble(newheight + moderateScale(30));
      setLineCountTrouble((prevCount) => {
        let updatedCount = prevCount;
        if (lineCountTrouble === 2) {
          updatedCount = prevCount;
        } else if (lineCountTrouble === 1) {
          updatedCount = prevCount + 1;
        } else {
          updatedCount = prevCount - 1;
        }
        return updatedCount;
      });
    } else if (Platform.OS === "ios") {
      setInputHeightTrouble(newheight);
      setFieldHeightTrouble(newheight + moderateScale(30));
    }
  };

  const getMessage = async () => {
    const messagesRef = collection(db, "troubleBox");
    if (userData) {
      const qeury = await getDocs(messagesRef);
      const troubleBoxMessages: React.SetStateAction<
        { id: string; data: DocumentData } | undefined
      >[] = [];
      qeury.forEach((document) => {
        const messageData = document.data();
        if (messageData.DOB && messageData.ANSWERED === false) {
          const messageDate = (messageData.DOB as Timestamp).toDate();
          const userDob = (userData.DOB as Timestamp).toDate();
          const userTopics = userData.TOPICS || [];
          const messageTopics = messageData.TOPICS || [];

          if (
            messageDate <= userDob &&
            !messageTopics.some((topic: string) =>
              userTopics.includes(topic),
            ) &&
            messageData.SENDER_ID !== auth.currentUser?.uid
          ) {
            troubleBoxMessages.push({ id: document.id, data: messageData });
          }
        }
      });

      if (troubleBoxMessages.length === 0) {
        setEmptyTroubleBox(true);
        setShowRandomMessage(true);
      } else {
        const randomIndex = Math.floor(
          Math.random() * troubleBoxMessages.length,
        );
        setRandomMessage(troubleBoxMessages[randomIndex]);
        setShowRandomMessage(true);
      }
    }
  };

  const hideTroubleMessage = () => {
    Keyboard.dismiss();

    setTimeout(() => {
      setShowRandomMessage(false);
      setInputHeightTrouble(initialHeightTrouble);
      setLineCountTrouble(1);
      setMessageAnswer("");
    }, 40);

    setTimeout(() => {
      setEmptyTroubleBox(false);
    }, 500);
  };

  const toggleLike = (index: number, sender_id: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, liked: !msg.liked } : msg,
      ),
    );

    setTimeout(async () => {
      try {
        // Referenz zu dem spezifischen Dokument des Users
        const userRef = doc(db, "users", sender_id);

        // Aktualisiere das Feld 'score', indem du den Wert um 1 erhöhst
        await updateDoc(userRef, {
          SCORE: !messages.at(index)?.liked ? increment(1) : increment(-1), // Erhöht den Wert des Feldes 'score' um 1
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
      } catch (error) {}
    }, 1000);
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: TroubleAnswer;
    index: number;
  }) => (
    <View>
      <View
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0) {
            setCarouselHeight(height);
          }
        }}
        style={[
          styles.container_message,
          { width: screenWidth - moderateScale(30) },
        ]}
      >
        <TouchableOpacity
          style={styles.container_message_text}
          activeOpacity={0.8}
          onPress={() => {
            setSelectedItem(item);
            setShowHistory(true);
            setSelectedIndex(index);
          }}
        >
          <View
            style={{
              paddingHorizontal: moderateScale(15),
              paddingTop: moderateScale(15),
            }}
          >
            {item.sender_id === "welcomeMessage" ? (
              <Text style={styles.text_message} numberOfLines={3}>
                <Trans
                  i18nKey="first_message"
                  values={{ name: userData?.USER_NAME }}
                  components={{
                    strong: (
                      <Text style={{ fontWeight: "bold", color: "#BF9ED9" }} />
                    ),
                  }}
                />
              </Text>
            ) : (
              <Text style={styles.text_message} numberOfLines={3}>
                {item.message}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={[styles.messageInfo, { justifyContent: "space-between" }]}>
          <Text
            style={{
              marginLeft: moderateScale(15),
              fontSize: moderateScale(12),
            }}
          >
            {i18next.t("answer_from")}
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              @{item.sender_name}
            </Text>
          </Text>
          {item.sender_name !== "CourageousHeart" && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  marginRight: moderateScale(10),
                  top: moderateScale(-1),
                  height: moderateScale(40),
                  width: moderateScale(40),
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => toggleLike(index, item.sender_id)}
              >
                <Image
                  source={!item.liked ? heartRegular : heartSolid}
                  resizeMode="contain"
                  tintColor="black"
                  style={{
                    height: moderateScale(26),
                    width: moderateScale(26),
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  marginRight: moderateScale(5),
                  height: moderateScale(40),
                  width: moderateScale(40),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={report}
                  resizeMode="contain"
                  tintColor="#B00020"
                  style={{
                    height: moderateScale(25),
                    width: moderateScale(25),
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <ReactNativeModal
        isVisible={showHistory}
        backdropOpacity={0.3}
        avoidKeyboard
        animationOutTiming={500}
        style={{
          margin: 0,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={[
            styles.container_overlay,
            { paddingBottom: moderateScale(30) },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_close}
            onPress={() => setShowHistory(false)}
          >
            <Image
              source={close}
              style={{
                height: moderateScale(25),
                width: moderateScale(25),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {selectedItem && (
            <View>
              <View
                style={[
                  styles.container_message,
                  { width: screenWidth - moderateScale(30) },
                ]}
              >
                <View
                  style={[
                    styles.container_message_text,
                    { height: undefined, maxHeight: moderateScale(150) },
                  ]}
                >
                  <Animated.ScrollView
                    contentContainerStyle={{
                      paddingHorizontal: moderateScale(15),
                      paddingTop: moderateScale(15),
                    }}
                    showsVerticalScrollIndicator
                  >
                    {selectedItem.sender_id === "welcomeMessage" ? (
                      <Text style={styles.text_message}>
                        <Trans
                          i18nKey="first_message"
                          values={{ name: userData?.USER_NAME }}
                          components={{
                            strong: (
                              <Text
                                style={{ fontWeight: "bold", color: "#BF9ED9" }}
                              />
                            ),
                          }}
                        />
                      </Text>
                    ) : (
                      <Text style={styles.text_message}>
                        {selectedItem.message_original}
                      </Text>
                    )}
                  </Animated.ScrollView>
                </View>
                {selectedItem.sender_id !== "welcomeMessage" && (
                  <View
                    style={{
                      maxHeight: moderateScale(150),
                      paddingVertical: moderateScale(15),
                    }}
                  >
                    <Animated.ScrollView
                      style={{
                        paddingHorizontal: moderateScale(15),
                      }}
                    >
                      <Text
                        style={[
                          styles.text_message,
                          { color: "black", alignSelf: "center" },
                        ]}
                      >
                        {selectedItem.message}
                      </Text>
                    </Animated.ScrollView>
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.messageInfo,
                  {
                    justifyContent: "space-between",
                    marginHorizontal: moderateScale(15),
                    marginTop: moderateScale(5),
                  },
                ]}
              >
                <Text
                  style={{
                    marginLeft: moderateScale(15),
                    fontSize: moderateScale(12),
                  }}
                >
                  {i18next.t("answer_from")}
                  <Text
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    @{selectedItem.sender_name}
                  </Text>
                </Text>
                {selectedItem.sender_name !== "CourageousHeart" && (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        marginRight: moderateScale(10),
                        top: moderateScale(-1),
                        height: moderateScale(40),
                        width: moderateScale(40),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() =>
                        toggleLike(selectedIndex, selectedItem.sender_id)
                      }
                    >
                      <Image
                        source={
                          !messages.at(selectedIndex)?.liked
                            ? heartRegular
                            : heartSolid
                        }
                        resizeMode="contain"
                        tintColor="black"
                        style={{
                          height: moderateScale(26),
                          width: moderateScale(26),
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        marginRight: moderateScale(5),
                        height: moderateScale(40),
                        width: moderateScale(40),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        source={report}
                        resizeMode="contain"
                        tintColor="#B00020"
                        style={{
                          height: moderateScale(25),
                          width: moderateScale(25),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {selectedItem.sender_name !== "CourageousHeart" && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.button_getMessage,
                    { width: screenWidth - moderateScale(30) },
                  ]}
                  onPress={getMessage}
                >
                  <Text
                    style={{
                      fontSize: moderateScale(15),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {i18next.t("initiate_conversation").toLocaleUpperCase()}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ReactNativeModal>
    </View>
  );

  return (
    <View style={{ backgroundColor: "#ECDEEA", alignItems: "center", flex: 1 }}>
      <ReactNativeModal
        isVisible={userData?.NEW_CREATED && showTopics}
        style={{ margin: 0, justifyContent: "flex-end" }}
        backdropOpacity={0.3}
        animationOutTiming={500}
      >
        <View style={styles.container_overlay}>
          <View style={{ marginBottom: moderateScale(10) }}>
            <Text
              style={{
                fontSize: moderateScale(25),
                fontWeight: "bold",
                paddingHorizontal: moderateScale(20),
              }}
            >
              {i18next.t("avoided_topics_description")}
            </Text>
          </View>
          <View style={styles.container_content}>
            <View style={styles.container_topics}>
              {Topics.map((topic) => (
                <Chip
                  key={topic.id}
                  label={topic.text as TopicTranslKeys}
                  isSelected={!!selectedLabels[topic.id]}
                  toggleSelected={() => toggleLabel(topic.id)}
                />
              ))}
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button_save}
              onPress={() => saveTopics(false)}
            >
              <Text
                style={{
                  fontSize: moderateScale(15),
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {i18next.t("save").toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ReactNativeModal>
      <View style={styles.container_info_buttons}>
        <TouchableOpacity style={styles.button_help} activeOpacity={0.8}>
          <Image
            source={help}
            resizeMode="contain"
            style={{
              width: moderateScale(15),
              height: moderateScale(15),
              tintColor: "black",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button_map}
          activeOpacity={0.8}
          onPress={() => handleSignOut()}
        >
          <Image
            source={map}
            resizeMode="contain"
            style={{
              width: moderateScale(30),
              height: moderateScale(30),
              tintColor: "white",
            }}
          />
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.container_header,
          {
            transform: [{ translateY: headerY }],
          },
        ]}
      >
        {auth.currentUser?.photoURL != null ? (
          <Animated.Image
            source={{ uri: auth.currentUser?.photoURL }}
            resizeMode="contain"
            style={[
              styles.profilPicture,
              {
                height: moderateScale(125),
                width: moderateScale(125),
                opacity: animatedOpacity,
              },
            ]}
          />
        ) : (
          <Animated.Image
            source={userDefaultImage}
            resizeMode="contain"
            style={[
              styles.profilPicture,
              {
                height: moderateScale(125),
                width: moderateScale(125),
                opacity: animatedOpacity,
              },
            ]}
          />
        )}
        <View style={styles.container_greeting}>
          {getGreeting()}
          {userData && (
            <Animated.Text
              ref={ref}
              style={[
                styles.text_name,
                {
                  alignSelf: "center",
                  opacity: animatedOpacity,
                },
              ]}
            >
              {userData.USER_NAME}
            </Animated.Text>
          )}
        </View>
        <Animated.View
          style={[
            styles.container_score,
            {
              top: scoreTop,
              backgroundColor: scoreColor,
            },
          ]}
        >
          <Image
            source={heartSolid}
            resizeMode="contain"
            style={{
              width: moderateScale(22),
              height: moderateScale(22),
              tintColor: "black",
            }}
          />
          {userData && (
            <Animated.Text style={styles.text_score}>
              {userData.SCORE}
            </Animated.Text>
          )}
        </Animated.View>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.container_scroll_outer,
          {
            borderTopRightRadius: moderateScale(40),
            borderTopLeftRadius: moderateScale(40),
          },
        ]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          {
            useNativeDriver: false,
          },
        )}
      >
        <Animated.View
          style={[
            styles.container_scroll_inner,
            {
              borderTopRightRadius: radius,
              borderTopLeftRadius: radius,
            },
          ]}
        >
          <View style={styles.container_troubleBox}>
            <Text style={{ fontSize: moderateScale(20), fontWeight: "bold" }}>
              {i18next.t("trouble_box").toUpperCase()}
            </Text>

            <View
              style={{
                alignSelf: "center",
                flex: 1,
                marginTop: moderateScale(15),
                width: screenWidth,
              }}
            >
              {messages.length !== 0 && (
                <Carousel
                  loop
                  width={screenWidth}
                  modeConfig={{
                    snapDirection: "left",
                    stackInterval: 8,
                  }}
                  height={carouselHeight + moderateScale(5)}
                  data={messages}
                  scrollAnimationDuration={500}
                  // eslint-disable-next-line no-console
                  onSnapToItem={(index) => console.log("current index:", index)}
                  renderItem={renderMessage}
                />
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button_getMessage}
              onPress={getMessage}
            >
              <Text
                style={{
                  fontSize: moderateScale(15),
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {i18next.t("get_message").toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
            <ReactNativeModal
              isVisible={showRandomMessage}
              backdropOpacity={0.3}
              avoidKeyboard
              animationOutTiming={500}
              animationOut={answerSent ? "bounceOutUp" : "slideOutDown"}
              style={{
                margin: 0,
                justifyContent: "flex-end",
              }}
            >
              <View style={styles.container_overlay}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.button_close}
                  onPress={hideTroubleMessage}
                >
                  <Image
                    source={close}
                    style={{
                      height: moderateScale(25),
                      width: moderateScale(25),
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    borderTopRightRadius: moderateScale(40),
                    borderTopLeftRadius: moderateScale(40),
                    paddingHorizontal: moderateScale(20),
                    paddingBottom: moderateScale(25),
                  }}
                >
                  {!randomMessage ? (
                    <View>
                      <View>
                        <Text
                          style={{
                            fontSize: moderateScale(25),
                            fontWeight: "bold",
                          }}
                        >
                          {i18next.t("empty_troubleBox")}
                        </Text>
                      </View>
                      <View>
                        <Image
                          source={paperPlanes}
                          resizeMode="contain"
                          style={{
                            width: moderateScale(200),
                            height: moderateScale(200),
                            alignSelf: "center",
                          }}
                        />
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View
                        style={[styles.container_message, { width: "100%" }]}
                      >
                        <View
                          style={[
                            styles.container_message_text,
                            {
                              maxHeight: moderateScale(150),
                              padding: moderateScale(15),
                              height: undefined,
                            },
                          ]}
                        >
                          <Animated.ScrollView showsVerticalScrollIndicator>
                            <View>
                              <Text style={styles.text_message}>
                                {randomMessage.data.MESSAGE}
                              </Text>
                            </View>
                          </Animated.ScrollView>
                        </View>
                        <View
                          style={[
                            styles.messageInfo,
                            { justifyContent: "space-between" },
                          ]}
                        >
                          <Text
                            style={{
                              marginLeft: moderateScale(15),
                              fontSize: moderateScale(12),
                            }}
                          >
                            {i18next.t("note_from")}
                            <Text
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              @{randomMessage.data.SENDER_NAME}
                            </Text>
                          </Text>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ marginRight: moderateScale(15) }}
                          >
                            <Image
                              source={report}
                              resizeMode="contain"
                              tintColor="#B00020"
                              style={{
                                height: moderateScale(25),
                                width: moderateScale(25),
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          height: scale(100),
                          justifyContent: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            marginTop: moderateScale(30),
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              paddingHorizontal: moderateScale(20),
                              borderRadius: moderateScale(25),
                              backgroundColor: inputIsFocused
                                ? "#ECDEEA"
                                : "white",
                              borderWidth: moderateScale(1.5),
                              height:
                                Platform.OS === "ios"
                                  ? Math.min(
                                      fieldHeightTrouble,
                                      initialHeightTrouble * 3 +
                                        moderateScale(30),
                                    )
                                  : inputHeightTrouble + moderateScale(30),
                            }}
                          >
                            <TextInput
                              onFocus={() => setInputIsFocused(true)}
                              onBlur={() => setInputIsFocused(false)}
                              style={{
                                paddingVertical: Platform.OS === "ios" ? 0 : 0,
                                height:
                                  Platform.OS === "ios"
                                    ? Math.min(
                                        inputHeightTrouble,
                                        initialHeightTrouble * 3,
                                      )
                                    : inputHeightTrouble,
                                fontSize: moderateScale(14),
                              }}
                              placeholder={i18next.t(
                                "random_message_placeholder",
                              )}
                              onContentSizeChange={
                                handleContentSizeChangeTrouble
                              }
                              value={messageAnswer}
                              onChangeText={setMessageAnswer}
                              multiline
                            />
                          </View>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "black",
                              justifyContent: "center",
                              paddingHorizontal: moderateScale(20),
                              height: moderateScale(48),
                              width: moderateScale(48),
                              borderRadius: moderateScale(25),
                              marginLeft: moderateScale(10),
                            }}
                            onPress={() =>
                              sendTroubleAnswer(
                                randomMessage.data.SENDER_ID,
                                randomMessage.data.MESSAGE,
                                randomMessage.id,
                              )
                            }
                            activeOpacity={0.8}
                            disabled={messageAnswer.trim() === ""}
                          >
                            <Image
                              source={send}
                              resizeMode="contain"
                              style={{
                                alignSelf: "center",
                                width: moderateScale(25),
                                height: moderateScale(25),
                                tintColor: "white",
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </ReactNativeModal>
          </View>
          <View style={styles.conatiner_topics}>
            <Text style={{ fontSize: moderateScale(20), fontWeight: "bold" }}>
              {i18next.t("topics").toUpperCase()}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: moderateScale(15),
              }}
            >
              <TouchableOpacity
                style={[styles.card_topics, { backgroundColor: "#D4E1ED" }]}
                activeOpacity={0.8}
              >
                <Text style={styles.text_topics}>
                  {i18next.t("mental_health").toUpperCase()}
                </Text>
                <Image
                  source={mentalHealth}
                  resizeMode="contain"
                  style={{
                    height: moderateScale(100),
                    width: moderateScale(100),
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.card_topics, { backgroundColor: "#BF9ED9" }]}
                activeOpacity={0.8}
              >
                <Text style={styles.text_topics}>
                  {i18next.t("abuse_bullying").toUpperCase()}
                </Text>
                <Image
                  source={abuse}
                  resizeMode="contain"
                  style={{
                    height: moderateScale(100),
                    width: moderateScale(100),
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.card_topics, { backgroundColor: "#EABFCF" }]}
                activeOpacity={0.8}
              >
                <Text style={styles.text_topics}>
                  {i18next.t("female_body").toUpperCase()}
                </Text>
                <Image
                  source={body}
                  resizeMode="contain"
                  style={{
                    height: moderateScale(100),
                    width: moderateScale(100),
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>
      {isFocused && (
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={handleOverlayPress}>
            <View style={styles.overlayTouchable} />
          </TouchableWithoutFeedback>
        </View>
      )}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container_fab}>
          <View
            style={[
              styles.textInput,
              {
                height:
                  Platform.OS === "ios"
                    ? Math.min(
                        fieldHeight,
                        initialHeight * 5 + moderateScale(30),
                      )
                    : inputHeight + moderateScale(30),
              },
            ]}
          >
            <TextInput
              style={{
                paddingVertical: Platform.OS === "ios" ? 0 : 0,
                height:
                  Platform.OS === "ios"
                    ? Math.min(inputHeight, initialHeight * 5)
                    : inputHeight,
                fontSize: moderateScale(14),
              }}
              placeholder={i18next.t("troubleBox_placeholder")}
              onContentSizeChange={handleContentSizeChange}
              value={message}
              onChangeText={setMessage}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              multiline
            />
          </View>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowFinalizeMessage(true)}
            activeOpacity={0.8}
            disabled={message.trim() === ""}
          >
            <Image
              source={send}
              resizeMode="contain"
              style={{
                alignSelf: "center",
                width: moderateScale(25),
                height: moderateScale(25),
                tintColor: "white",
              }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <ReactNativeModal
        isVisible={showfinalizeMessage}
        style={{ margin: 0, justifyContent: "flex-end" }}
        backdropOpacity={0}
        animationOutTiming={500}
      >
        <View style={styles.container_overlay}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button_close}
            onPress={hideMessage}
          >
            <Image
              source={close}
              style={{ height: moderateScale(25), width: moderateScale(25) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{ marginBottom: moderateScale(20) }}>
            <Text
              style={{
                fontSize: moderateScale(25),
                fontWeight: "bold",
                paddingHorizontal: moderateScale(20),
              }}
            >
              {i18next.t("message_topics_description")}
            </Text>
          </View>
          <View style={styles.container_content}>
            <View style={styles.container_topics}>
              {Topics.map((topic) => (
                <Chip
                  key={topic.id}
                  label={topic.text as TopicTranslKeys}
                  isSelected={!!selectedLabels[topic.id]}
                  toggleSelected={() => toggleLabel(topic.id)}
                />
              ))}
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button_save}
              onPress={() => saveTopics(true)}
            >
              <Text
                style={{
                  fontSize: moderateScale(15),
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {i18next.t("send").toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ReactNativeModal>
    </View>
  );
}
