
import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { C } from '../../theme/tokens';

export function Screen({
  children,
  scroll = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.content}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  );
}

export function Header({
  eyebrow = 'OGRE PERFORMANCE',
  title,
  right,
}: {
  eyebrow?: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={s.header}>
      <View style={{ flex: 1 }}>
        <Text style={s.eyebrow}>{eyebrow}</Text>
        <Text style={s.title}>{title}</Text>
      </View>

      {right}
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View style={[s.card, style]}>
      {children}
    </View>
  );
}

export function Section({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>

      {action ? (
        <Pressable onPress={onAction}>
          <Text style={s.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Metric({
  label,
  value,
  unit,
  detail,
}: {
  label: string;
  value: string | number;
  unit?: string;
  detail?: string;
}) {
  return (
    <View style={s.metric}>
      <Text style={s.metricLabel}>{label}</Text>

      <Text style={s.metricValue}>
        {value}
        <Text style={s.unit}>
          {unit ? ` ${unit}` : ''}
        </Text>
      </Text>

      {detail ? (
        <Text style={s.detail}>{detail}</Text>
      ) : null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  secondary = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        s.button,
        secondary && s.buttonSecondary,
      ]}
    >
      <Text
        style={[
          s.buttonText,
          secondary && { color: C.silver },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// The main navigation is managed by Expo Router.
// This wrapper keeps older screens compatible.
export function BottomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  eyebrow: {
    color: C.electric,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.2,
    marginBottom: 7,
  },

  title: {
    color: C.text,
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: -0.8,
  },

  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 20,
    padding: 17,
  },

  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 12,
  },

  sectionTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.1,
  },

  action: {
    color: C.electric,
    fontSize: 12,
    fontWeight: '700',
  },

  metric: {
    flex: 1,
    minWidth: 0,
  },

  metricLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  metricValue: {
    color: C.text,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 7,
  },

  unit: {
    fontSize: 12,
    color: C.muted,
    fontWeight: '600',
  },

  detail: {
    color: C.muted,
    fontSize: 11,
    marginTop: 5,
  },

  button: {
    backgroundColor: C.blue,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonSecondary: {
    backgroundColor: C.raised,
    borderWidth: 1,
    borderColor: C.line,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
