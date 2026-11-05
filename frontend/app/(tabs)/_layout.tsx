
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Tabs, router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C } from '../../src/theme/tokens';

const TAB_ITEMS = [
  {
    route: 'index',
    label: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
    href: '/(tabs)',
  },
  {
    route: 'workouts',
    label: 'Train',
    icon: 'barbell-outline',
    activeIcon: 'barbell',
    href: '/(tabs)/workouts',
  },
  {
    route: 'nutrition',
    label: 'Fuel',
    icon: 'restaurant-outline',
    activeIcon: 'restaurant',
    href: '/(tabs)/nutrition',
  },
  {
    route: 'progress',
    label: 'Progress',
    icon: 'stats-chart-outline',
    activeIcon: 'stats-chart',
    href: '/(tabs)/progress',
  },
] as const;

function OGRETabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      {TAB_ITEMS.map((item) => {
        const focused =
          item.route === 'index'
            ? pathname === '/(tabs)' || pathname === '/'
            : pathname.includes(`/${item.route}`);

        return (
          <Pressable
            key={item.route}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: focused }}
            onPress={() => {
              if (!focused) {
                router.navigate(item.href as any);
              }
            }}
            style={styles.tabItem}
          >
            <Ionicons
              name={
                (focused ? item.activeIcon : item.icon) as any
              }
              size={27}
              color={focused ? C.electric : '#55B5FF'}
            />

            <Text
              style={[
                styles.tabLabel,
                focused && styles.activeTabLabel,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PeakAIFloatingButton() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  if (pathname.endsWith('/coach')) {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open PEAK AI"
      onPress={() => router.navigate('/(tabs)/coach' as any)}
      style={[
        styles.peakButton,
        {
          bottom: 76 + Math.max(insets.bottom, 10),
        },
      ]}
    >
      <Ionicons
        name="sparkles"
        size={27}
        color="#FFFFFF"
      />

      <View style={styles.peakDot} />
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        tabBar={() => <OGRETabBar />}
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: C.bg,
          },
          animation: 'fade',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Home' }}
        />

        <Tabs.Screen
          name="workouts"
          options={{ title: 'Train' }}
        />

        <Tabs.Screen
          name="nutrition"
          options={{ title: 'Fuel' }}
        />

        <Tabs.Screen
          name="progress"
          options={{ title: 'Progress' }}
        />

        <Tabs.Screen
          name="coach"
          options={{ href: null }}
        />

        <Tabs.Screen
          name="profile"
          options={{ href: null }}
        />
      </Tabs>

      <PeakAIFloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  tabBar: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#050505',
    borderTopWidth: 1,
    borderTopColor: '#292929',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#292929',
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    paddingTop: 10,
    paddingHorizontal: 10,
  },

  tabItem: {
    flex: 1,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  tabLabel: {
    color: '#AEB7C2',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
  },

  activeTabLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  peakButton: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -29,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#236EB5',
    borderWidth: 2,
    borderColor: '#8CCBFF',
    shadowColor: '#2995F5',
    shadowOpacity: 0.42,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 12,
    zIndex: 20,
  },

  peakDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B8E4FF',
  },
});
