
import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
  const { width, height } = useWindowDimensions();

  const handleGetStarted = () => {
    router.push("/(onboarding)/name" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* WELCOME TEXT */}
        <View
          style={[
            styles.headingContainer,
            {
              marginTop: height * 0.315,
            },
          ]}
        >
          <Text
            style={[
              styles.heading,
              {
                fontSize: width * 0.063,
              },
            ]}
          >
            WELCOME TO OGRE
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                fontSize: width * 0.030,
                letterSpacing: width * 0.012,
              },
            ]}
          >
            LET'S BUILD YOUR PROFILE
          </Text>
        </View>

        {/* GET STARTED BUTTON */}
        <Pressable
          onPress={handleGetStarted}
          style={({ pressed }) => [
            styles.button,
            {
              width: width * 0.88,
              height: height * 0.095,
              marginBottom: height * 0.055,
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            GET STARTED →
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headingContainer: {
    alignItems: "center",
    width: "100%",
  },

  heading: {
    color: "#111111",
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1.2,
    includeFontPadding: false,
  },

  subtitle: {
    color: "#858585",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 32,
    includeFontPadding: false,
  },

  button: {
    backgroundColor: "#111111",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 3.5,
  },

  buttonPressed: {
    opacity: 0.85,
  },
});
