
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  Page,
  PageHeader,
  Card,
  S,
  Action,
  Field,
} from '../../src/components/common/FeatureUI';

import { useOgre } from '../../src/store/OgreStore';
import { C } from '../../src/theme/tokens';

type Goal = 'GAIN' | 'LOSE' | 'MAINTAIN';

type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'very'
  | 'athlete';

const GOALS: { label: string; value: Goal }[] = [
  { label: 'BUILD MUSCLE', value: 'GAIN' },
  { label: 'MAINTAIN', value: 'MAINTAIN' },
  { label: 'LOSE FAT', value: 'LOSE' },
];

const ACTIVITIES: { label: string; value: ActivityLevel }[] = [
  { label: 'Sedentary', value: 'sedentary' },
  { label: 'Lightly active', value: 'light' },
  { label: 'Moderately active', value: 'moderate' },
  { label: 'Very active', value: 'very' },
  { label: 'Athlete', value: 'athlete' },
];

export default function ProfileScreen() {
  const {
    profile,
    updateProfile,
    measurements,
    workouts,
    foods,
  } = useOgre();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'moderate' as ActivityLevel,
    goal: 'GAIN' as Goal,
  });

  const latestMeasurement = useMemo(() => {
    if (!measurements?.length) return undefined;

    return [...measurements].sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )[0];
  }, [measurements]);

  const openEditor = () => {
    if (!profile) {
      Alert.alert(
        'Profile unavailable',
        'Complete Phase 1 onboarding first.'
      );
      return;
    }

    setForm({
      name: profile.name ?? '',
      age: String(profile.age ?? ''),
      height: String(profile.height ?? ''),
      weight: String(profile.weight ?? ''),
      activityLevel: profile.activityLevel as ActivityLevel,
      goal: profile.goal as Goal,
    });

    setEditing(true);
  };

  const saveProfile = () => {
    if (!profile) return;

    const name = form.name.trim();
    const age = Number(form.age);
    const height = Number(form.height);
    const weight = Number(form.weight);

    if (!name) {
      Alert.alert('Missing name', 'Enter your name.');
      return;
    }

    if (
      !Number.isFinite(age) ||
      !Number.isFinite(height) ||
      !Number.isFinite(weight)
    ) {
      Alert.alert('Invalid details', 'Enter valid numbers.');
      return;
    }

    if (age < 13 || age > 100) {
      Alert.alert('Invalid age', 'Age must be between 13 and 100.');
      return;
    }

    if (height < 100 || height > 250) {
      Alert.alert('Invalid height', 'Height must be 100–250 cm.');
      return;
    }

    if (weight < 20 || weight > 300) {
      Alert.alert('Invalid weight', 'Weight must be 20–300 kg.');
      return;
    }

    updateProfile({
      name,
      age,
      height,
      weight,
      activityLevel: form.activityLevel,
      goal: form.goal,
    });

    setEditing(false);

    Alert.alert(
      'PROFILE UPDATED',
      'Your OGRE profile has been updated.'
    );
  };

  const bmi =
    profile && profile.height > 0
      ? profile.weight / Math.pow(profile.height / 100, 2)
      : 0;

  const workoutCount = workouts?.length ?? 0;
  const foodCount = foods?.length ?? 0;

  const stat = (label: string, value: string) => (
    <View style={{ flex: 1 }}>
      <Text style={S.label}>{label}</Text>
      <Text style={S.value}>{value}</Text>
    </View>
  );

  if (!profile) {
    return (
      <Page>
        <PageHeader
          title="PROFILE"
          subtitle="Your personal performance identity."
        />
        <Card>
          <Ionicons
            name="person-circle-outline"
            size={48}
            color={C.electric}
          />
          <Text style={S.value}>No profile found</Text>
          <Text style={S.small}>
            Complete Phase 1 onboarding to load your details.
          </Text>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title="PROFILE"
        subtitle="Your body. Your goals. Your performance."
      />

      <Card style={{ backgroundColor: C.deep }}>
        <View style={[S.row, { alignItems: 'center' }]}>
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              backgroundColor: C.blue,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 27,
                fontWeight: '900',
              }}
            >
              {profile.name.trim().charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: '900',
              }}
            >
              {profile.name}
            </Text>
            <Text style={{ color: '#BBD7F0', marginTop: 5 }}>
              OGRE ATHLETE
            </Text>
          </View>

          <Pressable
            onPress={editing ? () => setEditing(false) : openEditor}
            style={{
              padding: 11,
              borderRadius: 12,
              backgroundColor: '#28577E',
            }}
          >
            <Ionicons
              name={editing ? 'close' : 'create-outline'}
              size={22}
              color="#fff"
            />
          </Pressable>
        </View>
      </Card>

      {editing ? (
        <Card>
          <Text style={S.section}>EDIT PERSONAL DETAILS</Text>

          <Field
            label="FULL NAME"
            value={form.name}
            onChange={value =>
              setForm(previous => ({ ...previous, name: value }))
            }
            placeholder="Your name"
          />

          <Field
            label="AGE"
            value={form.age}
            onChange={value =>
              setForm(previous => ({ ...previous, age: value }))
            }
            keyboardType="number-pad"
          />

          <Field
            label="HEIGHT (CM)"
            value={form.height}
            onChange={value =>
              setForm(previous => ({ ...previous, height: value }))
            }
            keyboardType="decimal-pad"
          />

          <Field
            label="WEIGHT (KG)"
            value={form.weight}
            onChange={value =>
              setForm(previous => ({ ...previous, weight: value }))
            }
            keyboardType="decimal-pad"
          />

          <Text style={S.section}>ACTIVITY LEVEL</Text>

          {ACTIVITIES.map(item => (
            <Pressable
              key={item.value}
              onPress={() =>
                setForm(previous => ({
                  ...previous,
                  activityLevel: item.value,
                }))
              }
              style={{
                padding: 14,
                marginBottom: 8,
                borderRadius: 12,
                backgroundColor:
                  form.activityLevel === item.value
                    ? C.deep
                    : C.panel,
                borderWidth: 1,
                borderColor:
                  form.activityLevel === item.value
                    ? C.electric
                    : C.border,
              }}
            >
              <Text
                style={{
                  color: C.text,
                  fontWeight: '800',
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}

          <Text style={S.section}>FITNESS GOAL</Text>

          {GOALS.map(item => (
            <Pressable
              key={item.value}
              onPress={() =>
                setForm(previous => ({
                  ...previous,
                  goal: item.value,
                }))
              }
              style={{
                padding: 14,
                marginBottom: 8,
                borderRadius: 12,
                backgroundColor:
                  form.goal === item.value ? C.deep : C.panel,
                borderWidth: 1,
                borderColor:
                  form.goal === item.value
                    ? C.electric
                    : C.border,
              }}
            >
              <Text
                style={{
                  color: C.text,
                  fontWeight: '800',
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}

          <Action label="SAVE PROFILE" onPress={saveProfile} />

          <View style={{ height: 10 }} />

          <Action
            label="CANCEL"
            secondary
            onPress={() => setEditing(false)}
          />
        </Card>
      ) : (
        <>
          <Text style={S.section}>BODY STATISTICS</Text>

          <View style={[S.row, { gap: 10 }]}>
            <Card style={{ flex: 1 }}>
              {stat('AGE', `${profile.age} years`)}
            </Card>
            <Card style={{ flex: 1 }}>
              {stat('HEIGHT', `${profile.height} cm`)}
            </Card>
          </View>

          <View style={[S.row, { gap: 10 }]}>
            <Card style={{ flex: 1 }}>
              {stat('CURRENT WEIGHT', `${profile.weight} kg`)}
            </Card>
            <Card style={{ flex: 1 }}>
              {stat('BMI', bmi ? bmi.toFixed(1) : '—')}
            </Card>
          </View>

          <Card>
            <Text style={S.label}>FITNESS GOAL</Text>
            <Text style={S.value}>
              {profile.goal === 'GAIN'
                ? 'BUILD MUSCLE'
                : profile.goal === 'LOSE'
                  ? 'LOSE FAT'
                  : 'MAINTAIN'}
            </Text>

            <View style={S.divider} />

            <Text style={S.label}>ACTIVITY LEVEL</Text>
            <Text style={S.value}>
              {String(profile.activityLevel).toUpperCase()}
            </Text>
          </Card>

          <Text style={S.section}>YOUR OGRE ACTIVITY</Text>

          <View style={[S.row, { gap: 10 }]}>
            <Card style={{ flex: 1 }}>
              {stat('WORKOUTS', String(workoutCount))}
            </Card>
            <Card style={{ flex: 1 }}>
              {stat('MEALS LOGGED', String(foodCount))}
            </Card>
          </View>

          <Card>
            <Text style={S.label}>LATEST BODY WEIGHT RECORD</Text>
            <Text style={S.value}>
              {latestMeasurement
                ? `${latestMeasurement.weight} kg`
                : `${profile.weight} kg`}
            </Text>
            <Text style={S.small}>
              {latestMeasurement
                ? new Date(latestMeasurement.date).toLocaleDateString()
                : 'Your Phase 1 onboarding weight'}
            </Text>
          </Card>

          <Action
            label="EDIT MY PROFILE"
            onPress={openEditor}
          />
        </>
      )}
    </Page>
  );
}
