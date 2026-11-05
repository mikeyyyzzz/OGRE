
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

export default function ProgressScreen() {
  const {
    profile,
    measurements,
    workouts,
    goals,
    addMeasurement,
    removeMeasurement,
    addGoal,
    toggleGoal,
    removeGoal,
  } = useOgre();

  const [weight, setWeight] = useState(
    String(profile?.weight ?? '')
  );

  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [arms, setArms] = useState('');
  const [thighs, setThighs] = useState('');
  const [shoulders, setShoulders] = useState('');
  const [goalText, setGoalText] = useState('');
  const [showMeasurementForm, setShowMeasurementForm] =
    useState(false);

  const sortedMeasurements = useMemo(
    () =>
      [...measurements].sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      ),
    [measurements]
  );

  const firstWeight =
    sortedMeasurements[0]?.weight ?? profile?.weight ?? 0;

  const latestWeight =
    sortedMeasurements[sortedMeasurements.length - 1]?.weight ??
    profile?.weight ??
    0;

  const weightChange =
    firstWeight > 0
      ? Number((latestWeight - firstWeight).toFixed(1))
      : 0;

  const completedGoals = goals.filter(
    goal => goal.completed
  ).length;

  const workoutDays = useMemo(() => {
    const uniqueDays = new Set(
      workouts.map(workout =>
        new Date(workout.date).toDateString()
      )
    );

    return uniqueDays.size;
  }, [workouts]);

  const weeklyWorkouts = useMemo(() => {
    const now = new Date();

    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    return workouts.filter(workout => {
      const date = new Date(workout.date);
      return date >= start && date <= now;
    }).length;
  }, [workouts]);

  const bmi =
    profile && profile.height > 0
      ? latestWeight /
        Math.pow(profile.height / 100, 2)
      : 0;

  const validateOptionalMeasurement = (
    value: string,
    label: string
  ): number | undefined | null => {
    if (!value.trim()) return undefined;

    const parsed = Number(value);

    if (
      !Number.isFinite(parsed) ||
      parsed <= 0 ||
      parsed > 300
    ) {
      Alert.alert(
        'Invalid measurement',
        `Enter a valid ${label} measurement in centimetres.`
      );

      return null;
    }

    return parsed;
  };

  const saveMeasurement = () => {
    const parsedWeight = Number(weight);

    if (
      !Number.isFinite(parsedWeight) ||
      parsedWeight < 20 ||
      parsedWeight > 300
    ) {
      Alert.alert(
        'Invalid weight',
        'Enter a weight between 20 and 300 kg.'
      );
      return;
    }

    const parsedChest =
      validateOptionalMeasurement(chest, 'chest');

    if (parsedChest === null) return;

    const parsedWaist =
      validateOptionalMeasurement(waist, 'waist');

    if (parsedWaist === null) return;

    const parsedArms =
      validateOptionalMeasurement(arms, 'arms');

    if (parsedArms === null) return;

    const parsedThighs =
      validateOptionalMeasurement(thighs, 'thighs');

    if (parsedThighs === null) return;

    const parsedShoulders =
      validateOptionalMeasurement(shoulders, 'shoulders');

    if (parsedShoulders === null) return;

    addMeasurement({
      weight: parsedWeight,
      chest: parsedChest,
      waist: parsedWaist,
      arms: parsedArms,
      thighs: parsedThighs,
      shoulders: parsedShoulders,
    });

    setWeight(String(parsedWeight));
    setChest('');
    setWaist('');
    setArms('');
    setThighs('');
    setShoulders('');
    setShowMeasurementForm(false);

    Alert.alert(
      'PROGRESS SAVED',
      'Your new measurement has been added to your history.'
    );
  };

  const addNewGoal = () => {
    const value = goalText.trim();

    if (!value) {
      Alert.alert(
        'Missing goal',
        'Enter a goal before adding it.'
      );
      return;
    }

    addGoal(value);
    setGoalText('');
  };

  const deleteMeasurement = (id: string) => {
    Alert.alert(
      'Delete measurement?',
      'This record will be permanently removed from your progress history.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeMeasurement(id),
        },
      ]
    );
  };

  const deleteGoal = (id: string, title: string) => {
    Alert.alert(
      'Delete goal?',
      title,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeGoal(id),
        },
      ]
    );
  };

  const metric = (label: string, value: string) => (
    <View style={{ flex: 1 }}>
      <Text style={S.label}>{label}</Text>
      <Text style={S.value}>{value}</Text>
    </View>
  );

  return (
    <Page>
      <PageHeader
        title="PROGRESS"
        subtitle="Measure your evolution. Every workout, every kilogram and every milestone counts."
      />

      <Card style={{ backgroundColor: C.deep }}>
        <Text
          style={[
            S.eyebrow,
            { color: '#A8D8FF' },
          ]}
        >
          YOUR PERFORMANCE
        </Text>

        <Text
          style={{
            color: '#fff',
            fontSize: 34,
            fontWeight: '900',
            marginTop: 8,
          }}
        >
          {weightChange > 0 ? '+' : ''}
          {weightChange.toFixed(1)} KG
        </Text>

        <Text
          style={{
            color: '#C5D8EA',
            marginTop: 6,
            fontSize: 12,
          }}
        >
          Change between your first and latest saved weight
        </Text>

        <View
          style={[
            S.row,
            { marginTop: 20, justifyContent: 'space-between' },
          ]}
        >
          <View>
            <Text style={S.label}>START</Text>
            <Text style={S.value}>
              {firstWeight || '—'} kg
            </Text>
          </View>

          <View>
            <Text style={S.label}>CURRENT</Text>
            <Text
              style={[
                S.value,
                { color: C.electric },
              ]}
            >
              {latestWeight || '—'} kg
            </Text>
          </View>
        </View>
      </Card>

      <Text style={S.section}>YOUR STATISTICS</Text>

      <View style={[S.row, { gap: 10 }]}>
        <Card style={{ flex: 1 }}>
          {metric(
            'CURRENT WEIGHT',
            latestWeight ? `${latestWeight} kg` : '—'
          )}
        </Card>

        <Card style={{ flex: 1 }}>
          {metric('TOTAL WORKOUTS', `${workouts.length}`)}
        </Card>
      </View>

      <View style={[S.row, { gap: 10 }]}>
        <Card style={{ flex: 1 }}>
          {metric('ACTIVE DAYS', `${workoutDays}`)}
        </Card>

        <Card style={{ flex: 1 }}>
          {metric(
            'GOALS COMPLETED',
            `${completedGoals}/${goals.length}`
          )}
        </Card>
      </View>

      <View style={[S.row, { gap: 10 }]}>
        <Card style={{ flex: 1 }}>
          {metric('WORKOUTS THIS WEEK', `${weeklyWorkouts}`)}
        </Card>

        <Card style={{ flex: 1 }}>
          {metric('CURRENT BMI', bmi ? bmi.toFixed(1) : '—')}
        </Card>
      </View>

      <View
        style={[
          S.row,
          { justifyContent: 'space-between' },
        ]}
      >
        <Text style={S.section}>WEIGHT HISTORY</Text>

        <Pressable
          onPress={() =>
            setShowMeasurementForm(value => !value)
          }
          style={{ justifyContent: 'center' }}
        >
          <Text
            style={{
              color: C.electric,
              fontWeight: '900',
              fontSize: 13,
            }}
          >
            {showMeasurementForm ? 'CLOSE' : '+ ADD'}
          </Text>
        </Pressable>
      </View>

      {showMeasurementForm && (
        <Card>
          <Text style={S.label}>BODY WEIGHT (KG)</Text>

          <Field
            label=""
            value={weight}
            onChange={setWeight}
            keyboardType="decimal-pad"
            placeholder="e.g. 52"
          />

          <Text style={S.section}>
            BODY MEASUREMENTS (CM)
          </Text>

          <View style={[S.row, { gap: 10 }]}>
            <View style={{ flex: 1 }}>
              <Field
                label="CHEST"
                value={chest}
                onChange={setChest}
                keyboardType="decimal-pad"
                placeholder="Optional"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Field
                label="WAIST"
                value={waist}
                onChange={setWaist}
                keyboardType="decimal-pad"
                placeholder="Optional"
              />
            </View>
          </View>

          <View style={[S.row, { gap: 10 }]}>
            <View style={{ flex: 1 }}>
              <Field
                label="ARMS"
                value={arms}
                onChange={setArms}
                keyboardType="decimal-pad"
                placeholder="Optional"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Field
                label="THIGHS"
                value={thighs}
                onChange={setThighs}
                keyboardType="decimal-pad"
                placeholder="Optional"
              />
            </View>
          </View>

          <Field
            label="SHOULDERS"
            value={shoulders}
            onChange={setShoulders}
            keyboardType="decimal-pad"
            placeholder="Optional"
          />

          <Action
            label="SAVE MEASUREMENT"
            onPress={saveMeasurement}
          />
        </Card>
      )}

      {sortedMeasurements.length === 0 ? (
        <Card>
          <Ionicons
            name="scale-outline"
            size={30}
            color={C.electric}
          />
          <Text style={S.value}>
            No weight records yet
          </Text>
          <Text style={S.small}>
            Add your first measurement to start building your
            progress history.
          </Text>
        </Card>
      ) : (
        [...sortedMeasurements]
          .reverse()
          .map(item => (
            <Card key={item.id}>
              <View
                style={[
                  S.row,
                  { justifyContent: 'space-between' },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: C.text,
                      fontSize: 22,
                      fontWeight: '900',
                    }}
                  >
                    {item.weight} kg
                  </Text>

                  <Text style={S.small}>
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    deleteMeasurement(item.id)
                  }
                  hitSlop={10}
                  style={({ pressed }) => ({
                    padding: 9,
                    opacity: pressed ? 0.5 : 1,
                  })}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={C.danger}
                  />
                </Pressable>
              </View>

              <View
                style={[
                  S.row,
                  {
                    flexWrap: 'wrap',
                    marginTop: 14,
                    gap: 12,
                  },
                ]}
              >
                {[
                  ['Chest', item.chest],
                  ['Waist', item.waist],
                  ['Arms', item.arms],
                  ['Thighs', item.thighs],
                  ['Shoulders', item.shoulders],
                ]
                  .filter(
                    ([, value]) => value !== undefined
                  )
                  .map(([label, value]) => (
                    <Text
                      key={String(label)}
                      style={{
                        color: C.silver,
                        fontSize: 12,
                      }}
                    >
                      {label}: {value} cm
                    </Text>
                  ))}
              </View>
            </Card>
          ))
      )}

      <Text style={S.section}>PERSONAL GOALS</Text>

      <Card>
        <Text style={S.label}>CREATE A NEW GOAL</Text>

        <Field
          label=""
          value={goalText}
          onChange={setGoalText}
          placeholder="e.g. Reach 55 kg"
        />

        <Action
          label="ADD GOAL"
          onPress={addNewGoal}
        />
      </Card>

      {goals.length === 0 ? (
        <Card>
          <Text style={S.small}>
            No goals yet. Add a goal and start tracking your
            progress.
          </Text>
        </Card>
      ) : (
        goals.map(goal => (
          <Card key={goal.id}>
            <View
              style={[
                S.row,
                { alignItems: 'center' },
              ]}
            >
              <Pressable
                onPress={() => toggleGoal(goal.id)}
                style={[
                  S.row,
                  { flex: 1, alignItems: 'center' },
                ]}
              >
                <View
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: goal.completed
                      ? C.success
                      : C.muted,
                    backgroundColor: goal.completed
                      ? C.success
                      : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  {goal.completed && (
                    <Ionicons
                      name="checkmark"
                      size={17}
                      color="#07120C"
                    />
                  )}
                </View>

                <Text
                  style={{
                    color: goal.completed
                      ? C.muted
                      : C.text,
                    fontWeight: '700',
                    flex: 1,
                    textDecorationLine: goal.completed
                      ? 'line-through'
                      : 'none',
                  }}
                >
                  {goal.title}
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  deleteGoal(goal.id, goal.title)
                }
                hitSlop={10}
              >
                <Ionicons
                  name="trash-outline"
                  size={19}
                  color={C.danger}
                />
              </Pressable>
            </View>
          </Card>
        ))
      )}

      <Text style={S.section}>RECENT WORKOUTS</Text>

      {workouts.length === 0 ? (
        <Card>
          <Text style={S.small}>
            Complete a workout in the Train tab and your
            training history will appear here.
          </Text>
        </Card>
      ) : (
        [...workouts]
          .sort(
            (a, b) =>
              new Date(b.date).getTime() -
              new Date(a.date).getTime()
          )
          .slice(0, 5)
          .map(workout => (
            <Card key={workout.id}>
              <View
                style={[
                  S.row,
                  { justifyContent: 'space-between' },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: C.text,
                      fontWeight: '900',
                      fontSize: 16,
                    }}
                  >
                    {workout.name}
                  </Text>

                  <Text style={S.small}>
                    {new Date(
                      workout.date
                    ).toLocaleDateString()}
                  </Text>
                </View>

                <Ionicons
                  name="checkmark-circle"
                  color={C.electric}
                  size={22}
                />
              </View>

              <Text style={S.small}>
                {workout.duration} minutes ·{' '}
                {workout.exercises.length} exercises
              </Text>
            </Card>
          ))
      )}
    </Page>
  );
}
