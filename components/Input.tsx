import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Text } from "react-native";

import { ScaledSheet, scale } from "react-native-size-matters";

const eyeCrossedIcon = require("../assets/icons/eye_crossed.png");
const eyeIcon = require("../assets/icons/eye.png");

const style = ScaledSheet.create({
  inputContainer: {
    height: "48@s",
    backgroundColor: "white",
    flexDirection: "row",
    paddingLeft: "20@s",
    borderRadius: "50@s",
    borderColor: "black",
    borderWidth: "1.5@s",
    width: "100%",
  },
  inputField: {
    height: "48@s",
    width: "100%",
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
        paddingHorizontal: scale(20),
        marginBottom: scale(12),
        width: "100%",
        alignItems: "flex-start",
      }}
    >
      <View
        style={[
          style.inputContainer,
          {
            paddingRight: password ? scale(48) : scale(10),
            backgroundColor: isFocused ? "#ECDEEA" : "white",
            alignItems: "center",
            borderColor: error.length !== 0 ? "red" : "black",
            borderWidth: error.length !== 0 ? scale(2) : scale(1),
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
              width: scale(44),
              height: scale(44),
              paddingLeft: scale(10),
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
                  height: scale(20),
                  width: scale(20),
                  tintColor: "#374957",
                }}
              />
            ) : (
              <Image
                source={eyeIcon}
                resizeMode="contain"
                style={{
                  height: scale(20),
                  width: scale(20),
                  tintColor: "#374957",
                }}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ marginTop: scale(4), color: "red", fontSize: scale(11) }}>
        {error}
      </Text>
    </View>
  );
}
