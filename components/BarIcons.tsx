import { Image } from "react-native";
import { scale } from "react-native-size-matters";
import React from "react";

const home = require("../assets/icons/home.png");
const homeSolid = require("../assets/icons/home_solid.png");
const explore = require("../assets/icons/explore.png");
const exploreSolid = require("../assets/icons/explore_solid.png");
const book = require("../assets/icons/book.png");
const bookSolid = require("../assets/icons/book_solid.png");
const chats = require("../assets/icons/chats.png");
const chatsSolid = require("../assets/icons/chats_solid.png");
const user = require("../assets/icons/user.png");
const userSolid = require("../assets/icons/user_solid.png");

export const tabIcons = {
  index: {
    default: home,
    focused: homeSolid,
  },
  explore: {
    default: explore,
    focused: exploreSolid,
  },
  diary: {
    default: book,
    focused: bookSolid,
  },
  chats: {
    default: chats,
    focused: chatsSolid,
  },
  profil: {
    default: user,
    focused: userSolid,
  },
};

type IconProps = {
  focused: boolean;
  icon: {
    default: any;
    focused: any;
  };
};

export function renderTabIcon({ focused, icon }: IconProps) {
  return (
    <Image
      source={focused ? icon.focused : icon.default}
      resizeMode="contain"
      style={{
        width: scale(27),
        height: scale(27),
        tintColor: "#374957",
      }}
    />
  );
}
