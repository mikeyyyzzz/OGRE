
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Pressable,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function StatsScreen() {
  const params = useLocalSearchParams<{ name?: string }>();

  const name = Array.isArray(params.name)
    ? params.name[0]
    : params.name || "";

  const [heightValue, setHeightValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [ageValue, setAgeValue] = useState("");

  const { width, height } = useWindowDimensions();

  const stats = [
    {
      label: "HEIGHT",
      value: heightValue,
      setValue: setHeightValue,
      placeholder: "--",
      unit: "cm",
    },
    {
      label: "WEIGHT",
      value: weightValue,
      setValue: setWeightValue,
      placeholder: "--",
      unit: "kg",
    },
    {
      label: "AGE",
      value: ageValue,
      setValue: setAgeValue,
      placeholder: "--",
      unit: "yrs",
    },
  ];

  const handleNext = () => {
    const heightNum = Number(heightValue);
    const weightNum = Number(weightValue);
    const ageNum = Number(ageValue);

    if (!heightValue || !weightValue || !ageValue) {
      Alert.alert("Missing information", "Please enter your height, weight and age.");
      return;
    }

    if (
      heightNum < 100 ||
      heightNum > 250 ||
      weightNum < 20 ||
      weightNum > 300 ||
      ageNum < 13 ||
      ageNum > 100
    ) {
      Alert.alert(
        "Invalid information",
        "Please check your height, weight and age."
      );
      return;
    }

    router.push({
      pathname: "/(onboarding)/activity",
      params: {
        name,
        height: heightValue,
        weight: weightValue,
        age: ageValue,
      },
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
              width: width * 0.85,
              marginTop: height * 0.50,
            },
          ]}
        >
          <Text style={styles.heading}>YOUR STATS</Text>

          <View style={styles.redLine} />

          <View style={styles.cardsContainer}>
            {stats.map((item) => (
              <View
                key={item.label}
                style={[
                  styles.card,
                  {
                    width: width * 0.195,
                    height: height * 0.073,
                  },
                ]}
              >
                <Text style={styles.cardLabel}>{item.label}</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={item.value}
                    onChangeText={(text) =>
                      item.setValue(text.replace(/[^0-9]/g, ""))
                    }
                    placeholder={item.placeholder}
                    placeholderTextColor="#FFFFFF"
                    keyboardType="number-pad"
                    maxLength={3}
                    textAlign="center"
                  />

                  {item.value.length > 0 && (
                    <Text style={styles.unit}>{item.unit}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.nextButton,
            pressed && styles.nextButtonPressed,
          ]}
          hitSlop={15}
        >
          <Text style={styles.nextArrow}>→</Text>
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
  },

  content: {
    alignItems: "center",
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 7,
    textAlign: "center",
    includeFontPadding: false,
  },

  redLine: {
    width: 43,
    height: 2,
    backgroundColor: "#E50914",
    marginTop: 25,
    marginBottom: 40,
  },

  cardsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  card: {
    backgroundColor: "rgba(20,20,20,0.48)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  cardLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 4,
    marginBottom: 9,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 4,
    minWidth: 55,
    height: 28,
    padding: 0,
  },

  unit: {
    color: "#AAAAAA",
    fontSize: 9,
    marginLeft: 3,
  },

  nextButton: {
    position: "absolute",
    bottom: 45,
    right: 25,
    width: 55,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  nextArrow: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "300",
    opacity: 0.65,
  },

  nextButtonPressed: {
    opacity: 0.4,
  },
});
