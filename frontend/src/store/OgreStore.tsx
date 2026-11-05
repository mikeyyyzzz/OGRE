
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Profile = {
  name: string;
  height: number;
  weight: number;
  age: number;
  activityLevel: string;
  activityFactor: number;
  goal: string;
  bmi: number;
  bmr: number;
  maintenanceCalories: number;
  targetCalories: number;
  sex?: string;
};

export type FoodEntry = {
  id: string;
  name: string;
  meal: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt: string;
};

export type SetEntry = {
  reps: number;
  weight: number;
};

export type WorkoutExercise = {
  name: string;
  sets: SetEntry[];
};

export type WorkoutEntry = {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: WorkoutExercise[];
};

export type Measurement = {
  id: string;
  date: string;
  weight: number;
  chest?: number;
  waist?: number;
  arms?: number;
  thighs?: number;
  shoulders?: number;
};

export type GoalEntry = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

type State = {
  profile: Profile | null;
  foods: FoodEntry[];
  workouts: WorkoutEntry[];
  measurements: Measurement[];
  water: number;
  waterDate: string;
  goals: GoalEntry[];
};

type Store = State & {
  ready: boolean;

  setProfile: (profile: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;

  addFood: (food: Omit<FoodEntry, 'id' | 'createdAt'>) => void;
  updateFood: (id: string, patch: Partial<FoodEntry>) => void;
  removeFood: (id: string) => void;

  addWorkout: (workout: Omit<WorkoutEntry, 'id' | 'date'>) => void;
  removeWorkout: (id: string) => void;

  addMeasurement: (
    measurement: Omit<Measurement, 'id' | 'date'>
  ) => void;
  removeMeasurement: (id: string) => void;

  addWater: (ml: number) => void;
  setWater: (ml: number) => void;

  addGoal: (title: string) => void;
  toggleGoal: (id: string) => void;
  removeGoal: (id: string) => void;

  resetDay: () => void;
};

const STORAGE_KEY = 'ogre.app.state.v2';

const todayKey = () => new Date().toISOString().slice(0, 10);

const initialState: State = {
  profile: null,
  foods: [],
  workouts: [],
  measurements: [],
  water: 0,
  waterDate: todayKey(),
  goals: [
    {
      id: 'goal-workout',
      title: "Complete today's workout",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal-protein',
      title: 'Hit your protein target',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal-water',
      title: 'Drink enough water',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ],
};

const StoreContext = createContext<Store | null>(null);

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function recalculateProfile(
  profile: Profile,
  weight: number
): Profile {
  const heightInMeters = profile.height / 100;
  const bmi =
    heightInMeters > 0
      ? Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
      : 0;

  // Preserve the Phase 1 male-formula calculation unless sex is specified.
  const sexAdjustment =
    profile.sex?.toLowerCase() === 'female' ? -161 : 5;

  const bmr = Math.round(
    10 * weight +
      6.25 * profile.height -
      5 * profile.age +
      sexAdjustment
  );

  const maintenanceCalories = Math.round(
    bmr * profile.activityFactor
  );

  let targetCalories = maintenanceCalories;

  if (profile.goal === 'LOSE') {
    targetCalories = Math.max(1500, maintenanceCalories - 500);
  } else if (profile.goal === 'GAIN') {
    targetCalories = maintenanceCalories + 500;
  }

  return {
    ...profile,
    weight,
    bmi,
    bmr,
    maintenanceCalories,
    targetCalories,
  };
}

export function OgreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);

  // Load saved application data once.
  useEffect(() => {
    let mounted = true;

    async function loadState() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved && mounted) {
          const parsed = JSON.parse(saved) as Partial<State>;

          setState({
            ...initialState,
            ...parsed,
            foods: parsed.foods ?? [],
            workouts: parsed.workouts ?? [],
            measurements: parsed.measurements ?? [],
            goals: parsed.goals ?? initialState.goals,
            water:
              parsed.waterDate === todayKey()
                ? parsed.water ?? 0
                : 0,
            waterDate: todayKey(),
          });
        }
      } catch (error) {
        console.warn('OGRE storage load failed:', error);
      } finally {
        if (mounted) setReady(true);
      }
    }

    loadState();

    return () => {
      mounted = false;
    };
  }, []);

  // Persist every state update after the initial load.
  useEffect(() => {
    if (!ready) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(
      error => console.warn('OGRE storage save failed:', error)
    );
  }, [state, ready]);

  const setProfile = useCallback((profile: Profile) => {
    setState(current => {
      const firstMeasurement: Measurement = {
        id: createId(),
        date: new Date().toISOString(),
        weight: profile.weight,
      };

      return {
        ...current,
        profile,
        measurements:
          current.measurements.length > 0
            ? current.measurements
            : [firstMeasurement],
      };
    });
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      setState(current => {
        if (!current.profile) return current;

        const updated = {
          ...current.profile,
          ...patch,
        };

        return {
          ...current,
          profile: recalculateProfile(
            updated,
            updated.weight
          ),
        };
      });
    },
    []
  );

  const addFood = useCallback(
    (food: Omit<FoodEntry, 'id' | 'createdAt'>) => {
      setState(current => ({
        ...current,
        foods: [
          {
            ...food,
            id: createId(),
            createdAt: new Date().toISOString(),
          },
          ...current.foods,
        ],
      }));
    },
    []
  );

  const updateFood = useCallback(
    (id: string, patch: Partial<FoodEntry>) => {
      setState(current => ({
        ...current,
        foods: current.foods.map(food =>
          food.id === id ? { ...food, ...patch } : food
        ),
      }));
    },
    []
  );

  const removeFood = useCallback((id: string) => {
    setState(current => ({
      ...current,
      foods: current.foods.filter(food => food.id !== id),
    }));
  }, []);

  const addWorkout = useCallback(
    (workout: Omit<WorkoutEntry, 'id' | 'date'>) => {
      setState(current => ({
        ...current,
        workouts: [
          {
            ...workout,
            id: createId(),
            date: new Date().toISOString(),
          },
          ...current.workouts,
        ],
      }));
    },
    []
  );

  const removeWorkout = useCallback((id: string) => {
    setState(current => ({
      ...current,
      workouts: current.workouts.filter(
        workout => workout.id !== id
      ),
    }));
  }, []);

  const addMeasurement = useCallback(
    (measurement: Omit<Measurement, 'id' | 'date'>) => {
      setState(current => {
        const entry: Measurement = {
          ...measurement,
          id: createId(),
          date: new Date().toISOString(),
        };

        const nextState: State = {
          ...current,
          measurements: [entry, ...current.measurements],
        };

        if (current.profile && measurement.weight > 0) {
          nextState.profile = recalculateProfile(
            current.profile,
            measurement.weight
          );
        }

        return nextState;
      });
    },
    []
  );

  const removeMeasurement = useCallback((id: string) => {
    setState(current => ({
      ...current,
      measurements: current.measurements.filter(
        measurement => measurement.id !== id
      ),
    }));
  }, []);

  const addWater = useCallback((ml: number) => {
    if (!Number.isFinite(ml) || ml <= 0) return;

    setState(current => {
      const isNewDay = current.waterDate !== todayKey();

      return {
        ...current,
        water: (isNewDay ? 0 : current.water) + ml,
        waterDate: todayKey(),
      };
    });
  }, []);

  const setWater = useCallback((ml: number) => {
    setState(current => ({
      ...current,
      water: Math.max(0, ml),
      waterDate: todayKey(),
    }));
  }, []);

  const addGoal = useCallback((title: string) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setState(current => ({
      ...current,
      goals: [
        ...current.goals,
        {
          id: createId(),
          title: cleanTitle,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const toggleGoal = useCallback((id: string) => {
    setState(current => ({
      ...current,
      goals: current.goals.map(goal =>
        goal.id === id
          ? { ...goal, completed: !goal.completed }
          : goal
      ),
    }));
  }, []);

  const removeGoal = useCallback((id: string) => {
    setState(current => ({
      ...current,
      goals: current.goals.filter(goal => goal.id !== id),
    }));
  }, []);

  const resetDay = useCallback(() => {
    setState(current => ({
      ...current,
      foods: current.foods.filter(
        food => food.createdAt.slice(0, 10) !== todayKey()
      ),
      water: 0,
      waterDate: todayKey(),
      goals: current.goals.map(goal => ({
        ...goal,
        completed: false,
      })),
    }));
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      ready,
      setProfile,
      updateProfile,
      addFood,
      updateFood,
      removeFood,
      addWorkout,
      removeWorkout,
      addMeasurement,
      removeMeasurement,
      addWater,
      setWater,
      addGoal,
      toggleGoal,
      removeGoal,
      resetDay,
    }),
    [
      state,
      ready,
      setProfile,
      updateProfile,
      addFood,
      updateFood,
      removeFood,
      addWorkout,
      removeWorkout,
      addMeasurement,
      removeMeasurement,
      addWater,
      setWater,
      addGoal,
      toggleGoal,
      removeGoal,
      resetDay,
    ]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useOgre() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error(
      'useOgre must be used inside OgreProvider'
    );
  }

  return context;
}
