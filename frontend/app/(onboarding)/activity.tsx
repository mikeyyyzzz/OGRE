
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ActivityIcon = React.ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

const activityLevels: {
  id: string;
  icon: ActivityIcon;
  title: string;
  description: string;
}[] = [
  {
    id: "sedentary",
    icon: "sofa",
    title: "SEDENTARY",
    description: "Little to no exercise",
  },
  {
    id: "light",
    icon: "walk",
    title: "LIGHTLY ACTIVE",
    description: "1-3 workouts per week",
  },
  {
    id: "moderate",
    icon: "run",
    title: "MODERATELY ACTIVE",
    description: "3-5 workouts per week",
  },
  {
    id: "very",
    icon: "weight-lifter",
    title: "VERY ACTIVE",
    description: "6-7 workouts per week",
  },
  {
    id: "athlete",
    icon: "fire",
    title: "ATHLETE",
    description: "Hard training / physical job",
  },
];

export default function ActivityScreen() {
  const params = useLocalSearchParams<{
    name?: string;
    height?: string;
    weight?: string;
    age?: string;
  }>();

  const getParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] || "" : value || "";

  const name = getParam(params.name);
  const heightValue = getParam(params.height);
  const weightValue = getParam(params.weight);
  const ageValue = getParam(params.age);

  const [selectedActivity, setSelectedActivity] = useState("moderate");
  const { width, height } = useWindowDimensions();

  const handleNext = () => {
  router.push({
    pathname: "/(onboarding)/results",
    params: {
      name: String(params.name ?? ""),
      height: String(params.height ?? ""),
      weight: String(params.weight ?? ""),
      age: String(params.age ?? ""),
      activity: selectedActivity,
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

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: height * 0.34,
              paddingBottom: 110,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>HOW ACTIVE ARE YOU?</Text>

          <View style={styles.redLine} />

          <View
            style={[
              styles.optionsContainer,
              { width: width * 0.82 },
            ]}
          >
            {activityLevels.map((item) => {
              const isSelected = selectedActivity === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedActivity(item.id)}
                  style={({ pressed }) => [
                    styles.activityCard,
                    isSelected && styles.selectedCard,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={30}
                      color="#E50914"
                    />
                  </View>

                  <View style={styles.activityTextContainer}>
                    <Text style={styles.activityTitle}>
                      {item.title}
                    </Text>

                    <Text style={styles.activityDescription}>
                      {item.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <Pressable
          onPress={handleNext}
          hitSlop={15}
          style={({ pressed }) => [
            styles.nextButton,
            { bottom: Math.max(height * 0.035, 25) },
            pressed && styles.nextButtonPressed,
          ]}
        >
          <Text style={styles.nextArrow}>→</Text>
        </Pressable>
      </View>
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
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.48)",
  },

  container: {
    flex: 1,
    alignItems: "center",
  },

  scroll: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    alignItems: "center",
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 5,
    textAlign: "center",
    includeFontPadding: false,
  },

  redLine: {
    width: 43,
    height: 2,
    backgroundColor: "#E50914",
    marginTop: 23,
    marginBottom: 30,
  },

  optionsContainer: {
    gap: 10,
  },

  activityCard: {
    width: "100%",
    height: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    backgroundColor: "rgba(20,20,20,0.58)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
  },

  selectedCard: {
    borderColor: "#E50914",
    backgroundColor: "rgba(35,15,15,0.72)",
  },

  cardPressed: {
    opacity: 0.75,
  },

  iconContainer: {
    width: 62,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  activityTextContainer: {
    flex: 1,
    justifyContent: "center",
  },

  activityTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2.5,
    marginBottom: 7,
  },

  activityDescription: {
    color: "#999999",
    fontSize: 13,
    fontWeight: "400",
  },

  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  checkmark: {
    color: "#080808",
    fontSize: 21,
    fontWeight: "800",
  },

  nextButton: {
    position: "absolute",
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
    opacity: 0.85,
  },

  nextButtonPressed: {
    opacity: 0.4,
  },
});
