
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

/* =====================================================
   ACTIVITY MULTIPLIERS
===================================================== */

const ACTIVITY_FALLBACKS: Record<string, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  VERY: 1.725,
  ATHLETE: 1.9,
};

const ACTIVITY_NAMES: Record<string, string> = {
  sedentary: "SEDENTARY",
  light: "LIGHTLY ACTIVE",
  moderate: "MODERATELY ACTIVE",
  very: "VERY ACTIVE",
  athlete: "ATHLETE",
};

const getParam = (value?: string | string[]) => {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
};

const normalizeActivity = (value: string) =>
  value.trim().toLowerCase().replace(/[\s-]+/g, "_");

/* =====================================================
   RESULTS SCREEN
===================================================== */

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    name?: string;
    height?: string;
    weight?: string;
    age?: string;
    activity?: string;
    activityLevel?: string;
    activityFactor?: string;
    goal?: string;
  }>();

  /* USER DATA */

  const name = getParam(params.name) || "there";

  const heightNum = Number(getParam(params.height));
  const weightNum = Number(getParam(params.weight));
  const ageNum = Number(getParam(params.age));

  const isValidData =
    Number.isFinite(heightNum) &&
    heightNum >= 100 &&
    heightNum <= 250 &&
    Number.isFinite(weightNum) &&
    weightNum >= 20 &&
    weightNum <= 300 &&
    Number.isFinite(ageNum) &&
    ageNum >= 13 &&
    ageNum <= 100;

  /* ACTIVITY DATA */

  const rawActivity =
    getParam(params.activityLevel) ||
    getParam(params.activity) ||
    "moderate";

  const activityKey = normalizeActivity(rawActivity);

  const activityName =
    ACTIVITY_NAMES[activityKey] || "MODERATELY ACTIVE";

  const passedFactor = Number(getParam(params.activityFactor));

  const activityFactor =
    Number.isFinite(passedFactor) && passedFactor > 0
      ? passedFactor
      : ACTIVITY_FALLBACKS[activityKey.toUpperCase()] || 1.55;

  /* INITIAL GOAL */

  const initialGoal = getParam(params.goal).toLowerCase();

  const initialGoalIsLoss =
    initialGoal.includes("lose") || initialGoal.includes("fat");

  const [mode, setMode] = useState<"GAIN" | "LOSE">(
    initialGoalIsLoss ? "LOSE" : "GAIN"
  );

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const validHeight = isValidData ? heightNum : 167;
  const validWeight = isValidData ? weightNum : 51;
  const validAge = isValidData ? ageNum : 21;

  const heightMeters = validHeight / 100;

  const bmiNum = validWeight / (heightMeters * heightMeters);
  const bmiDisplay = bmiNum.toFixed(1);
  const bmiPrimeDisplay = (bmiNum / 25).toFixed(2);

  const minHealthyWeight = (
    18.5 * heightMeters * heightMeters
  ).toFixed(1);

  const maxHealthyWeight = (
    24.9 * heightMeters * heightMeters
  ).toFixed(1);

  const bmiCategoryLabel = useMemo(() => {
    if (bmiNum < 18.5) return "SLIGHTLY LOW";
    if (bmiNum < 25) return "NORMAL";
    if (bmiNum < 30) return "SLIGHTLY HIGH";
    return "HIGH";
  }, [bmiNum]);

  // Maps BMI from 12 to 35 across the 180-degree gauge.
  const needleAngle = useMemo(() => {
    const minBmi = 12;
    const maxBmi = 35;

    const clampedBmi = Math.min(
      Math.max(bmiNum, minBmi),
      maxBmi
    );

    return ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 180;
  }, [bmiNum]);

  /* =====================================================
     BMR AND MAINTENANCE CALORIES
     Male Mifflin-St Jeor equation
  ===================================================== */

  const bmr =
    10 * validWeight +
    6.25 * validHeight -
    5 * validAge +
    5;

  const maintenanceCalories = Math.round(
    bmr * activityFactor
  );

  /* =====================================================
     GAIN / LOSS TARGETS
  ===================================================== */

  const gainMild = maintenanceCalories + 250;
  const gainLean = maintenanceCalories + 500;
  const gainFast = maintenanceCalories + 750;

  const lossMild = Math.max(1500, maintenanceCalories - 250);
  const lossStandard = Math.max(1500, maintenanceCalories - 500);
  const lossAggressive = Math.max(1500, maintenanceCalories - 750);

  const targetCaloriesDisplay =
    mode === "GAIN" ? gainLean : lossStandard;

  /* PROTEIN RANGE */

  const minProtein = Math.round(validWeight * 1.6);
  const maxProtein = Math.round(validWeight * 2.2);

  /* =====================================================
     NAVIGATION TO MAIN APP
  ===================================================== */

  const handleNavigateToMainApp = () => {
    router.replace({
      pathname: "/(tabs)",
      params: {
        name,
        height: validHeight.toString(),
        weight: validWeight.toString(),
        age: validAge.toString(),
        activityLevel: activityName,
        activityFactor: activityFactor.toString(),
        goal: mode,
        bmi: bmiDisplay,
        bmr: Math.round(bmr).toString(),
        maintenanceCalories: maintenanceCalories.toString(),
        targetCalories: targetCaloriesDisplay.toString(),
      },
    });
  };

  /* =====================================================
     INVALID DATA SCREEN
  ===================================================== */

  if (!isValidData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <View style={styles.invalidContainer}>
          <Text style={styles.invalidText}>
            Your personal information is missing or invalid.
            Please complete your stats again.
          </Text>

          <Pressable
            onPress={() =>
              router.replace({
                pathname: "/(onboarding)/stats",
                params: { name },
              })
            }
          >
            <Text style={styles.invalidButton}>
              GO BACK →
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical
        bounces
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.greeting}>Hey, {name}</Text>

          <Text style={styles.headerStats}>
            {validHeight} CM   •   {validWeight} KG   •   {validAge} YEARS
          </Text>
        </View>

        <View style={styles.headerDivider} />

        {/* BMI SECTION */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Y O U R   B M I</Text>
          <Text style={styles.sectionTag}>BODY MASS INDEX</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.bmiCardTop}>
            <View>
              <Text style={styles.bmiValueText}>{bmiDisplay}</Text>
              <Text style={styles.bmiUnitText}>kg / m²</Text>
            </View>

            <View style={styles.bmiCategoryBadge}>
              <Text style={styles.bmiCategoryText}>
                {bmiCategoryLabel}
              </Text>
            </View>
          </View>

          {/* SEMI-CIRCLE BMI GAUGE */}

          <View style={styles.gaugeWrapper}>
            <View style={styles.gaugeSemiCircle}>
              <View
                style={[
                  styles.arcSegment,
                  styles.arcUnderweight,
                ]}
              />

              <View
                style={[
                  styles.arcSegment,
                  styles.arcNormal,
                ]}
              />

              <View
                style={[
                  styles.arcSegment,
                  styles.arcOverweight,
                ]}
              />

              <View
                style={[
                  styles.arcSegment,
                  styles.arcObese,
                ]}
              />

              <View style={styles.gaugeInnerMask} />

              {/* DYNAMIC NEEDLE */}

              <View
                style={[
                  styles.needlePivot,
                  {
                    transform: [
                      { rotate: `${needleAngle}deg` },
                    ],
                  },
                ]}
              >
                <View style={styles.needleLine} />
              </View>

              <View style={styles.needleCenterPin} />
            </View>

            <View style={styles.gaugeLabelsRow}>
              <Text style={styles.gaugeLabelText}>
                UNDERWEIGHT
              </Text>

              <Text style={styles.gaugeLabelText}>
                NORMAL
              </Text>

              <Text style={styles.gaugeLabelText}>
                OVERWEIGHT
              </Text>

              <Text style={styles.gaugeLabelText}>
                OBESE
              </Text>
            </View>
          </View>

          {/* BMI INFORMATION */}

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>
              Healthy BMI range
            </Text>

            <Text style={styles.metricVal}>
              18.5 – 24.9
            </Text>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>
              Healthy weight range
            </Text>

            <Text style={styles.metricVal}>
              {minHealthyWeight} – {maxHealthyWeight} kg
            </Text>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>
              BMI Prime
            </Text>

            <Text style={styles.metricVal}>
              {bmiPrimeDisplay}
            </Text>
          </View>
        </View>

        {/* DAILY CALORIES */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            D A I L Y   C A L O R I E S
          </Text>

          <Text style={styles.sectionTag}>
            ESTIMATED TARGET
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.calorieTopRow}>
            <View>
              <Text style={styles.calorieValueText}>
                {targetCaloriesDisplay.toLocaleString()}
              </Text>

              <Text style={styles.calorieUnitText}>
                KCAL / DAY
              </Text>
            </View>

            <Text style={styles.modeTagText}>
              {mode === "GAIN" ? "GAIN WEIGHT" : "LOSE WEIGHT"}
            </Text>
          </View>

          {/* GAIN / LOSE TOGGLE */}

          <View style={styles.segmentedControl}>
            <Pressable
              onPress={() => setMode("GAIN")}
              style={[
                styles.segmentButton,
                mode === "GAIN" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  mode === "GAIN" && styles.segmentTextActive,
                ]}
              >
                GAIN
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMode("LOSE")}
              style={[
                styles.segmentButton,
                mode === "LOSE" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  mode === "LOSE" && styles.segmentTextActive,
                ]}
              >
                LOSE
              </Text>
            </Pressable>
          </View>

          {/* DYNAMIC TARGET BARS */}

          <Text style={styles.targetHeading}>
            {mode === "GAIN"
              ? "G A I N   T A R G E T S"
              : "L O S S   T A R G E T S"}
          </Text>

          {mode === "GAIN" ? (
            <View style={styles.barsContainer}>
              <View style={styles.barRow}>
                <View style={styles.barMeta}>
                  <Text style={styles.barTitle}>Mild gain</Text>
                  <Text style={styles.barSub}>+0.25 kg/wk</Text>
                </View>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: "70%" },
                    ]}
                  />
                </View>

                <Text style={styles.barValue}>
                  {gainMild.toLocaleString()}
                </Text>
              </View>

              <View style={styles.barRow}>
                <View style={styles.barMeta}>
                  <Text style={styles.barTitle}>Lean gain</Text>
                  <Text style={styles.barSub}>+0.5 kg/wk</Text>
                </View>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: "85%" },
                    ]}
                  />
                </View>

                <Text style={styles.barValue}>
                  {gainLean.toLocaleString()}
                </Text>
              </View>

              <View style={styles.barRow}>
                <View style={styles.barMeta}>
                  <Text style={styles.barTitle}>Fast gain</Text>
                  <Text style={styles.barSub}>+0.75 kg/wk</Text>
                </View>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: "100%" },
                    ]}
                  />
                </View>

                <Text style={styles.barValue}>
                  {gainFast.toLocaleString()}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.barsContainer}>
              <View style={styles.barRow}>
                <View style={styles.barMeta}>
                  <Text style={styles.barTitle}>Mild loss</Text>
                  <Text style={styles.barSub}>-0.25 kg/wk</Text>
                </View>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: "100%" },
                    ]}
                  />
                </View>

                <Text style={styles.barValue}>
                  {lossMild.toLocaleString()}
                </Text>
              </View>

              <View style={styles.barRow}>
                <View style={styles.barMeta}>
                  <Text style={styles.barTitle}>Weight loss</Text>
                  <Text style={styles.barSub}>-0.5 kg/wk</Text>
                </View>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: "82%" },
                    ]}
                  />
                </View>

                <Text style={styles.barValue}>
                  {lossStandard.toLocaleString()}
                </Text>
              </View>

              <View style={styles.barRow}>
                <View style={styles.barMeta}>
                  <Text style={styles.barTitle}>
                    Aggressive loss
                  </Text>

                  <Text style={styles.barSub}>
                    -0.75 kg/wk
                  </Text>
                </View>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: "62%" },
                    ]}
                  />
                </View>

                <Text style={styles.barValue}>
                  {lossAggressive.toLocaleString()}
                </Text>
              </View>
            </View>
          )}

          {/* RECOMMENDATION */}

          <View style={styles.recommendationCard}>
            <View style={styles.redLeftAccentLine} />

            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationHeadline}>
                {targetCaloriesDisplay.toLocaleString()} kcal/day
              </Text>

              <Text style={styles.recommendationSubline}>
                Recommended starting target ·{" "}
                {mode === "GAIN" ? "+0.5 kg/wk" : "-0.5 kg/wk"}
              </Text>
            </View>
          </View>
        </View>

        {/* QUICK STATS */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Q U I C K   S T A T S
          </Text>
        </View>

        <View style={styles.grid2x2}>
          <View style={styles.gridCard}>
            <Text style={styles.gridCardLabel}>
              MAINTENANCE
            </Text>

            <Text style={styles.gridCardValue}>
              {maintenanceCalories.toLocaleString()}
            </Text>

            <Text style={styles.gridCardSub}>
              estimated kcal/day
            </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridCardLabel}>
              ACTIVITY
            </Text>

            <Text style={styles.gridCardValue}>
              {activityName}
            </Text>

            <Text style={styles.gridCardSub}>
              Activity level
            </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridCardLabel}>GOAL</Text>

            <Text style={styles.gridCardValue}>
              {mode}
            </Text>

            <Text style={styles.gridCardSub}>
              {mode === "GAIN"
                ? "build your body"
                : "shred fat"}
            </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridCardLabel}>
              PROTEIN
            </Text>

            <Text style={styles.gridCardValue}>
              {minProtein}–{maxProtein}g
            </Text>

            <Text style={styles.gridCardSub}>
              recommended daily range
            </Text>
          </View>
        </View>

        {/* BOTTOM NAVIGATION ARROW */}

        <View style={styles.bottomNavContainer}>
          <Pressable
            onPress={handleNavigateToMainApp}
            style={({ pressed }) => [
              styles.arrowButton,
              pressed && styles.arrowButtonPressed,
            ]}
            hitSlop={15}
          >
            <Text style={styles.arrowText}>→</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "#000000",
  },

  // flexGrow allows the content to extend beyond the screen.
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 64,
  },

  /* HEADER */

  header: {
    marginBottom: 16,
  },

  greeting: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  headerStats: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888888",
    letterSpacing: 2,
    marginTop: 6,
  },

  headerDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 28,
  },

  /* SECTION HEADERS */

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },

  sectionTitle: {
    color: "#888888",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3.5,
  },

  sectionTag: {
    color: "#555555",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  /* CARDS */

  card: {
    width: "100%",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
  },

  /* BMI CARD */

  bmiCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  bmiValueText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 52,
  },

  bmiUnitText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    marginTop: 2,
  },

  bmiCategoryBadge: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  bmiCategoryText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#CCCCCC",
    letterSpacing: 1.5,
  },

  /* GAUGE */

  gaugeWrapper: {
    alignItems: "center",
    marginVertical: 24,
  },

  gaugeSemiCircle: {
    width: 200,
    height: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    backgroundColor: "#222222",
    overflow: "hidden",
    position: "relative",
  },

  arcSegment: {
    position: "absolute",
    width: 200,
    height: 100,
  },

  arcUnderweight: {
    backgroundColor: "#A01B1B",
  },

  arcNormal: {
    backgroundColor: "#108A43",
    transform: [{ rotate: "45deg" }],
  },

  arcOverweight: {
    backgroundColor: "#D69E2E",
    transform: [{ rotate: "110deg" }],
  },

  arcObese: {
    backgroundColor: "#C90000",
    transform: [{ rotate: "150deg" }],
  },

  gaugeInnerMask: {
    position: "absolute",
    top: 25,
    left: 25,
    width: 150,
    height: 75,
    borderTopLeftRadius: 75,
    borderTopRightRadius: 75,
    backgroundColor: "#111111",
    zIndex: 2,
  },

  needlePivot: {
    position: "absolute",
    bottom: 0,
    left: 100,
    width: 1,
    height: 80,
    zIndex: 3,
  },

  needleLine: {
    width: 2,
    height: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 1,
  },

  needleCenterPin: {
    position: "absolute",
    bottom: -4,
    left: 95,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    zIndex: 4,
  },

  gaugeLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 8,
  },

  gaugeLabelText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#555555",
    letterSpacing: 1,
  },

  /* BMI METRIC ROWS */

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  metricLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888888",
  },

  metricVal: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  rowDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  /* DAILY CALORIES CARD */

  calorieTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  calorieValueText: {
    fontSize: 44,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 48,
  },

  calorieUnitText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666666",
    letterSpacing: 1.5,
    marginTop: 4,
  },

  modeTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#888888",
    letterSpacing: 2,
  },

  /* SEGMENTED CONTROL */

  segmentedControl: {
    width: "100%",
    height: 48,
    backgroundColor: "#000000",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    padding: 3,
    marginBottom: 24,
  },

  segmentButton: {
    flex: 1,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentButtonActive: {
    backgroundColor: "#C90000",
  },

  segmentText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#666666",
    letterSpacing: 3,
  },

  segmentTextActive: {
    color: "#FFFFFF",
  },

  /* TARGET BARS */

  targetHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: "#888888",
    letterSpacing: 3,
    marginBottom: 18,
  },

  barsContainer: {
    marginBottom: 20,
  },

  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  barMeta: {
    width: 90,
  },

  barTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#CCCCCC",
  },

  barSub: {
    fontSize: 10,
    color: "#666666",
    marginTop: 2,
  },

  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#222222",
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: "#C90000",
    borderRadius: 4,
  },

  barValue: {
    width: 45,
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "right",
  },

  /* RECOMMENDATION */

  recommendationCard: {
    width: "100%",
    backgroundColor: "rgba(35,10,10,0.85)",
    borderWidth: 1,
    borderColor: "rgba(201,0,0,0.25)",
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    padding: 16,
  },

  redLeftAccentLine: {
    width: 3,
    backgroundColor: "#C90000",
    borderRadius: 2,
    marginRight: 14,
  },

  recommendationContent: {
    flex: 1,
  },

  recommendationHeadline: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  recommendationSubline: {
    fontSize: 11,
    fontWeight: "500",
    color: "#AAAAAA",
    marginTop: 4,
  },

  /* QUICK STATS GRID */

  grid2x2: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 32,
  },

  gridCard: {
    width: "48%",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
  },

  gridCardLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#666666",
    letterSpacing: 2,
    marginBottom: 8,
  },

  gridCardValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  gridCardSub: {
    fontSize: 10,
    fontWeight: "500",
    color: "#555555",
    marginTop: 4,
  },

  /* BOTTOM NAVIGATION */

  bottomNavContainer: {
    width: "100%",
    alignItems: "flex-end",
    paddingRight: 8,
    marginTop: 8,
  },

  arrowButton: {
    padding: 8,
  },

  arrowButtonPressed: {
    opacity: 0.6,
  },

  arrowText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
  },

  /* INVALID DATA */

  invalidContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  invalidText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  invalidButton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
