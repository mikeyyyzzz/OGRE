
import React from 'react';
import {
  ScrollView,
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { C } from '../../src/theme/tokens';

type HomeParams = {
  name?: string | string[];
  height?: string | string[];
  weight?: string | string[];
  age?: string | string[];
  activityLevel?: string | string[];
  goal?: string | string[];
  targetCalories?: string | string[];
  maintenanceCalories?: string | string[];
  bmi?: string | string[];
  bmr?: string | string[];
  consumedCalories?: string | string[];
  protein?: string | string[];
  carbs?: string | string[];
  fats?: string | string[];
};

function getValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function formatNumber(value: number) {
  return Math.round(value).toLocaleString('en-IN');
}

function ActionButton({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.actionButton,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={21} color={C.electric} />
      <Text style={styles.actionText}>{title}</Text>
      <Ionicons name="chevron-forward" size={16} color={C.muted} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const params = useLocalSearchParams<HomeParams>();

  const name = getValue(params.name).trim() || 'ATHLETE';
  const firstName = name.split(' ')[0];

  const height = Number(getValue(params.height)) || 0;
  const weight = Number(getValue(params.weight)) || 0;
  const age = Number(getValue(params.age)) || 0;

  const calorieTarget =
    Number(getValue(params.targetCalories)) || 0;

  const consumedCalories =
    Number(getValue(params.consumedCalories)) || 0;

  const protein = Number(getValue(params.protein)) || 0;
  const carbs = Number(getValue(params.carbs)) || 0;
  const fats = Number(getValue(params.fats)) || 0;

  const calorieProgress =
    calorieTarget > 0
      ? Math.min(consumedCalories / calorieTarget, 1)
      : 0;

  const remainingCalories = Math.max(
    calorieTarget - consumedCalories,
    0,
  );

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const openProfile = () => {
    router.push({
      pathname: '/(tabs)/profile' as any,
      params: {
        ...params,
        name,
        height: String(height || ''),
        weight: String(weight || ''),
        age: String(age || ''),
      },
    });
  };

  const openWorkouts = () => {
    router.push('/(tabs)/workouts' as any);
  };

  const openNutrition = () => {
    router.push('/(tabs)/nutrition' as any);
  };

  const openProgress = () => {
    router.push('/(tabs)/progress' as any);
  };

  const openCoach = () => {
    router.push('/(tabs)/coach' as any);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              OGRE // PERFORMANCE SYSTEM
            </Text>

            <Text style={styles.greeting}>
              LET'S WORK,
            </Text>

            <Text style={styles.name}>
              {firstName.toUpperCase()}.
            </Text>

            <Text style={styles.date}>{today}</Text>
          </View>

          <Pressable
            onPress={openProfile}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            style={({ pressed }) => [
              styles.profileButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={25}
              color={C.electric}
            />
          </Pressable>
        </View>

        {/* TODAY'S MISSION */}

        <View style={styles.missionCard}>
          <View style={styles.missionGlow} />

          <Text style={styles.missionEyebrow}>
            TODAY'S MISSION
          </Text>

          <Text style={styles.missionTitle}>
            BUILD YOUR EDGE.
          </Text>

          <Text style={styles.missionDescription}>
            Small actions. Relentless consistency.
            Your next level starts today.
          </Text>

          <Pressable
            onPress={openWorkouts}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              START TRAINING
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* DAILY PERFORMANCE */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            DAILY PERFORMANCE
          </Text>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>
              CALORIE TARGET
            </Text>

            <Text style={styles.metricValue}>
              {calorieTarget
                ? formatNumber(calorieTarget)
                : '--'}
            </Text>

            <Text style={styles.metricUnit}>kcal / day</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>
              CURRENT WEIGHT
            </Text>

            <Text style={styles.metricValue}>
              {weight || '--'}
            </Text>

            <Text style={styles.metricUnit}>kg</Text>
          </View>
        </View>

        {/* DAILY FUEL */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            YOUR DAILY FUEL
          </Text>

          <Pressable onPress={openNutrition}>
            <Text style={styles.sectionAction}>LOG FOOD</Text>
          </Pressable>
        </View>

        <View style={styles.fuelCard}>
          <Text style={styles.metricLabel}>
            CALORIES CONSUMED
          </Text>

          <View style={styles.calorieRow}>
            <Text style={styles.calorieValue}>
              {formatNumber(consumedCalories)}
            </Text>

            <Text style={styles.calorieTarget}>
              / {calorieTarget
                ? formatNumber(calorieTarget)
                : '--'} kcal
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${calorieProgress * 100}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.fuelHint}>
            {calorieTarget > 0
              ? `${formatNumber(remainingCalories)} kcal remaining today`
              : 'Your daily nutrition target will appear here.'}
          </Text>

          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>PROTEIN</Text>
              <Text style={styles.macroValue}>{protein} g</Text>
            </View>

            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>CARBS</Text>
              <Text style={styles.macroValue}>{carbs} g</Text>
            </View>

            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>FATS</Text>
              <Text style={styles.macroValue}>{fats} g</Text>
            </View>
          </View>
        </View>

        {/* TRAINING */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            TRAINING PLAN
          </Text>

          <Pressable onPress={openWorkouts}>
            <Text style={styles.sectionAction}>VIEW ALL</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={openWorkouts}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <View style={styles.trainingCard}>
            <View style={styles.trainingIcon}>
              <Ionicons
                name="barbell"
                size={27}
                color={C.electric}
              />
            </View>

            <View style={styles.trainingText}>
              <Text style={styles.trainingTitle}>
                YOUR WORKOUT
              </Text>

              <Text style={styles.trainingSubtitle}>
                Open your training plan and start a session.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={C.muted}
            />
          </View>
        </Pressable>

        {/* QUICK ACCESS */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            QUICK ACCESS
          </Text>
        </View>

        <View style={styles.quickAccess}>
          <ActionButton
            title="Nutrition tracker"
            icon="restaurant-outline"
            onPress={openNutrition}
          />

          <ActionButton
            title="Progress analytics"
            icon="stats-chart-outline"
            onPress={openProgress}
          />

          <ActionButton
            title="PEAK AI coach"
            icon="sparkles-outline"
            onPress={openCoach}
          />

          <ActionButton
            title="My profile"
            icon="person-outline"
            onPress={openProfile}
          />
        </View>

        {/* PROFILE SNAPSHOT */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            YOUR PROFILE
          </Text>

          <Pressable onPress={openProfile}>
            <Text style={styles.sectionAction}>EDIT</Text>
          </Pressable>
        </View>

        <View style={styles.profileSnapshot}>
          <View style={styles.profileMetric}>
            <Text style={styles.snapshotLabel}>HEIGHT</Text>
            <Text style={styles.snapshotValue}>
              {height ? `${height} cm` : '--'}
            </Text>
          </View>

          <View style={styles.profileMetric}>
            <Text style={styles.snapshotLabel}>WEIGHT</Text>
            <Text style={styles.snapshotValue}>
              {weight ? `${weight} kg` : '--'}
            </Text>
          </View>

          <View style={styles.profileMetric}>
            <Text style={styles.snapshotLabel}>AGE</Text>
            <Text style={styles.snapshotValue}>
              {age || '--'}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          OGRE // BUILT DIFFERENT
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 125,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    color: C.electric,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.2,
    marginBottom: 13,
  },

  greeting: {
    color: C.text,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.7,
  },

  name: {
    color: C.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },

  date: {
    color: C.muted,
    fontSize: 12,
    marginTop: 8,
  },

  profileButton: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: C.raised,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  missionCard: {
    backgroundColor: '#14283C',
    borderWidth: 1,
    borderColor: '#2C4054',
    borderRadius: 25,
    padding: 22,
    marginBottom: 29,
    overflow: 'hidden',
  },

  missionGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#1D4A70',
    opacity: 0.18,
    right: -50,
    top: -55,
  },

  missionEyebrow: {
    color: '#A8D8FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2.5,
  },

  missionTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 22,
    letterSpacing: -0.6,
  },

  missionDescription: {
    color: '#B6C9DB',
    fontSize: 14,
    lineHeight: 23,
    marginTop: 10,
    maxWidth: 290,
  },

  primaryButton: {
    minHeight: 52,
    alignSelf: 'flex-start',
    backgroundColor: C.blue,
    borderRadius: 14,
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 23,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
    marginTop: 5,
  },

  sectionTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  sectionAction: {
    color: C.electric,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },

  metricCard: {
    flex: 1,
    minHeight: 145,
    backgroundColor: C.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.line,
    padding: 17,
    justifyContent: 'center',
  },

  metricLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  metricValue: {
    color: C.text,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 12,
  },

  metricUnit: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3,
  },

  fuelCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 23,
    padding: 19,
    marginBottom: 27,
  },

  calorieRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
    gap: 5,
  },

  calorieValue: {
    color: C.text,
    fontSize: 37,
    fontWeight: '900',
  },

  calorieTarget: {
    color: C.muted,
    fontSize: 14,
    fontWeight: '800',
  },

  progressTrack: {
    height: 9,
    borderRadius: 10,
    backgroundColor: C.raised,
    overflow: 'hidden',
    marginTop: 18,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: C.electric,
  },

  fuelHint: {
    color: C.muted,
    fontSize: 11,
    marginTop: 10,
  },

  macroRow: {
    flexDirection: 'row',
    marginTop: 21,
    gap: 10,
  },

  macroItem: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 12,
  },

  macroLabel: {
    color: C.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  macroValue: {
    color: C.text,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 7,
  },

  trainingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 17,
    backgroundColor: C.card,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: C.line,
    marginBottom: 26,
  },

  trainingIcon: {
    width: 51,
    height: 51,
    borderRadius: 16,
    backgroundColor: C.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trainingText: {
    flex: 1,
  },

  trainingTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
  },

  trainingSubtitle: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  quickAccess: {
    gap: 9,
    marginBottom: 26,
  },

  actionButton: {
    minHeight: 57,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 16,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  actionText: {
    color: C.text,
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },

  profileSnapshot: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 20,
    padding: 17,
    marginBottom: 24,
  },

  profileMetric: {
    flex: 1,
  },

  snapshotLabel: {
    color: C.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  snapshotValue: {
    color: C.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8,
  },

  footer: {
    color: C.muted,
    fontSize: 9,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 10,
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
