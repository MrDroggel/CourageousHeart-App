import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Text } from "react-native";

import { ScaledSheet, moderateScale } from "react-native-size-matters";

const eyeCrossedIcon = require("../assets/icons/eye_crossed.png");
const eyeIcon = require("../assets/icons/eye.png");

const style = ScaledSheet.create({
  container_input: {
    height: "48@ms",
    maxHeight: 80,
    backgroundColor: "white",
    flexDirection: "row",
    paddingLeft: "20@ms",
    borderRadius: "50@ms",
    borderColor: "black",
    width: "100%",
    alignSelf: "center",
  },
  inputField: {
    width: "100%",
    fontSize: "14@ms",
  },
});

export default function Input({
  placeholder,
  onChange,
  value,
  password,
  error,
  setError,
  email,
}: {
  placeholder: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  password: boolean;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  email: boolean;
}) {
  const [hidePassword, setHidePassword] = useState(password);
  const [isFocused, setIsFocused] = useState(false);

  const togglePassword = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <View
      style={{
        marginBottom: moderateScale(12),
        width: "100%",
        alignItems: "flex-start",
        maxWidth: 600,
      }}
    >
      <View
        style={[
          style.container_input,
          {
            paddingRight: password ? moderateScale(50) : moderateScale(20),
            backgroundColor: isFocused ? "#ECDEEA" : "white",
            alignItems: "center",
            borderColor: error.length !== 0 ? "#B00020" : "black",
            borderWidth:
              error.length !== 0 ? moderateScale(2) : moderateScale(1.5),
          },
        ]}
      >
        <TextInput
          placeholder={placeholder}
          keyboardType={email ? "email-address" : "default"}
          onChangeText={onChange}
          value={value}
          placeholderTextColor="grey"
          onFocus={() => {
            setIsFocused(true);
            setError("");
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={style.inputField}
        />
        {password && (
          <TouchableOpacity
            style={{
              width: moderateScale(44),
              height: moderateScale(44),
              paddingLeft: moderateScale(10),
              justifyContent: "center",
            }}
            activeOpacity={1}
            onPress={togglePassword}
          >
            {hidePassword ? (
              <Image
                source={eyeCrossedIcon}
                resizeMode="contain"
                style={{
                  height: moderateScale(20),
                  width: moderateScale(20),
                  tintColor: "#374957",
                }}
              />
            ) : (
              <Image
                source={eyeIcon}
                resizeMode="contain"
                style={{
                  height: moderateScale(20),
                  width: moderateScale(20),
                  tintColor: "#374957",
                }}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      <Text
        style={{
          marginTop: moderateScale(4),
          color: "#B00020",
          fontSize: moderateScale(11),
        }}
      >
        {error}
      </Text>
    </View>
  );
}
