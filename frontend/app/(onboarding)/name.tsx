
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";

export default function NameScreen() {
  const [name, setName] = useState("");
  const { width, height } = useWindowDimensions();

  const handleContinue = () => {
    if (!name.trim()) return;

    router.push({
      pathname: "/(onboarding)/stats" as any,
      params: { name: name.trim() },
    });
  };

  return (
    <ImageBackground
      source={require("../../assets/images/baki.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.content,
            {
              paddingHorizontal: width * 0.075,
              paddingTop: height * 0.50,
            },
          ]}
        >
          <Text style={styles.heading}>
            WHAT SHOULD WE{"\n"}CALL YOU?
          </Text>

          <View style={styles.redLine} />

          <Text style={styles.label}>YOUR NAME</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={!name.trim()}
          style={({ pressed }) => [
            styles.button,
            {
              width: width * 0.85,
              height: height * 0.085,
              marginBottom: height * 0.12,
            },
            pressed && styles.buttonPressed,
            !name.trim() && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>CONTINUE →</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#080808",
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.48)",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },

  content: {
    width: "100%",
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 4,
    lineHeight: 29,
    textAlign: "center",
    includeFontPadding: false,
  },

  redLine: {
    width: 58,
    height: 4,
    backgroundColor: "#E50914",
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 42,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 6,
    textAlign: "center",
    marginBottom: 24,
  },

  input: {
    height: 58,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 16,
    backgroundColor: "rgba(25,25,25,0.72)",
    paddingHorizontal: 24,
    color: "#FFFFFF",
    fontSize: 15,
  },

  button: {
    backgroundColor: "rgba(15,15,15,0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#AAAAAA",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 9,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.75,
  },
});
