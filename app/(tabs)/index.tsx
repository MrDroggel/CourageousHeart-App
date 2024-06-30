import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import i18next from "i18next";
import { router } from "expo-router";
import { DocumentData, doc, getDoc, updateDoc } from "firebase/firestore";
import { Topics } from "@/constants/Topics";
import { Chip } from "@/components/Chip";
import ReactNativeModal from "react-native-modal";
import { TopicTranslKeys } from "@/constants/TopicTranslKeys";
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from "../../FirebaseConfig";

const mapIcon = require("../../assets/icons/map.png");
const helpIcon = require("../../assets/icons/question.png");
const userDefaultImage = require("../../assets/images/user_default.png");
const heartIcon = require("../../assets/icons/heart.png");
const signUpImage = require("../../assets/images/sign_up_3.png");

const auth = FIREBASE_AUTH;
const db = FIREBASE_FIRESTORE;
const HEADER_MAX_HEIGHT = scale(250);
const OPACITY_MIN = -1;
const OPACITY_MAX = 1;

const styles = ScaledSheet.create({
  container_overlay: {
    backgroundColor: "white",
    paddingTop: "35@s",
    borderTopStartRadius: "40@s",
    borderTopEndRadius: "40@s",
    justifyContent: "center",
  },
  image: {
    width: "183@s",
    height: "180@s",
    alignSelf: "center",
  },
  container_content: {
    backgroundColor: "#ECDEEA",
    borderTopRightRadius: "40@s",
    borderTopLeftRadius: "40@s",
    paddingVertical: "20@s",
    width: "100%",
    height: "370@s",
  },
  container_topics: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: "10@s",
    width: "100%",
  },
  container_info_buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "15@s",
    paddingVertical: "15@s",
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
    paddingTop: "30@s",
    // borderWidth: 1,
  },
  container_scroll_outer: {
    flexGrow: 1,
    backgroundColor: "#ECDEEA",
    width: Dimensions.get("window").width,
    marginTop: "190@s",
  },
  container_scroll_inner: {
    flexGrow: 1,
    paddingVertical: "40@s",
    flex: 1,
    backgroundColor: "white",
  },
  container_greeting: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "25@s",
  },
  container_score: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10@s",
    borderRadius: "40@s",
    height: "35@s",
    width: "90@s",
  },
  profilPicture: {
    borderRadius: "80@s",
    borderColor: "black",
    borderWidth: "1.5@s",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20@s",
  },
  mapButton: {
    width: "55@s",
    height: "55@s",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "80@s",
    backgroundColor: "black",
    alignSelf: "flex-start",
    zIndex: 2,
  },
  helpButton: {
    width: "35@s",
    height: "35@s",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "80@s",
    borderWidth: "2@s",
    borderColor: "black",
    alignSelf: "flex-start",
    zIndex: 2,
  },
  greeting: {
    fontSize: "18@s",
    fontWeight: "300",
  },
  name: {
    fontSize: "18@s",
    fontWeight: "bold",
    marginLeft: "5@s",
    borderColor: "black",
  },
  score: {
    fontSize: "15@s",
    fontWeight: "bold",
    marginLeft: "5@s",
  },
  button_save: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50@s",
    backgroundColor: "black",
    height: "48@s",
    width: "150@s",
    marginTop: "10@s",
  },
});

export default function HomeScreen() {
  const time = new Date().getHours();

  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const ref = useRef<Text>(null);

  const [userData, setUserData] = useState<DocumentData>();
  const [newCreated, setNewCreated] = useState(true);
  const [selectedLabels, setSelectedTopics] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleLabel = (id: number) => {
    setSelectedTopics((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          router.replace("/(registration)");
        }
      }
    };

    fetchUserData();
  }, []);

  const hideFilter = () => {
    setNewCreated(false);
  };

  const getSelectedLabelIds = () =>
    Object.keys(selectedLabels)
      .filter((key) => selectedLabels[parseInt(key, 10)])
      .map((key) => parseInt(key, 10));

  const saveTopics = () => {
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
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const updatedData = {
        TOPICS: topics,
        NEW_CREATED: false,
      };
      updateDoc(docRef, updatedData).then(() => {
        hideFilter();
      });
    }
  };

  const headerY = scrollOffsetY.interpolate({
    inputRange: [0, scale(190)],
    outputRange: [0, scale(-100)],
    extrapolate: "clamp",
  });

  const radius = scrollOffsetY.interpolate({
    inputRange: [0, scale(190)],
    outputRange: [scale(40), 0],
  });

  const scoreTop = scrollOffsetY.interpolate({
    inputRange: [0, scale(190)],
    outputRange: [0, scale(-109)],
    extrapolate: "clamp",
  });

  const scoreColor = scrollOffsetY.interpolate({
    inputRange: [scale(100), scale(190)],
    outputRange: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"],
    extrapolate: "clamp",
  });

  const animatedOpacity = scrollOffsetY.interpolate({
    inputRange: [0, scale(250)],
    outputRange: [OPACITY_MAX, OPACITY_MIN],
    extrapolate: "clamp",
  });

  const getGreeting = () => {
    if (time < 11) {
      return (
        <Animated.Text
          style={[
            styles.greeting,
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
            styles.greeting,
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
          styles.greeting,
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

  return (
    <View style={{ backgroundColor: "#ECDEEA", alignItems: "center", flex: 1 }}>
      <ReactNativeModal
        isVisible={userData?.NEW_CREATED && newCreated}
        style={{ margin: 0, justifyContent: "flex-end" }}
        backdropOpacity={0.3}
        animationOutTiming={500}
      >
        <View style={styles.container_overlay}>
          <View style={{ marginBottom: scale(10) }}>
            <Text
              style={{
                fontSize: scale(25),
                fontWeight: "bold",
                paddingHorizontal: scale(20),
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
              onPress={saveTopics}
            >
              <Text
                style={{
                  fontSize: scale(15),
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
        <TouchableOpacity style={styles.helpButton} activeOpacity={0.8}>
          <Image
            source={helpIcon}
            resizeMode="contain"
            style={{
              width: scale(15),
              height: scale(15),
              tintColor: "black",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapButton}
          activeOpacity={0.8}
          onPress={() => handleSignOut()}
        >
          <Image
            source={mapIcon}
            resizeMode="contain"
            style={{ width: scale(30), height: scale(30), tintColor: "white" }}
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
                height: scale(125),
                width: scale(125),
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
                height: scale(125),
                width: scale(125),
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
                styles.name,
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
            source={heartIcon}
            resizeMode="contain"
            style={{ width: scale(22), height: scale(22), tintColor: "black" }}
          />
          {userData && <Text style={styles.score}>{userData.SCORE}</Text>}
        </Animated.View>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container_scroll_outer}
        // style={[{ borderTopRightRadius: radius, borderTopLeftRadius: radius }]}
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
          <View style={{ flex: 1 }}>
            <Image
              source={signUpImage}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={signUpImage}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={signUpImage}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={signUpImage}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={signUpImage}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}
