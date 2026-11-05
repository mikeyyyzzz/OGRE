
import React from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { C, R } from '../../theme/tokens';

// --------------------------------------------------
// PAGE
// --------------------------------------------------

type PageProps = {
  children: React.ReactNode;
  scroll?: boolean;
};

export function Page({
  children,
  scroll = true,
}: PageProps) {
  return (
    <View style={styles.page}>
      <StatusBar barStyle="light-content" />

      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  );
}

// --------------------------------------------------
// PAGE HEADER
// --------------------------------------------------

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  right,
}: PageHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.eyebrow}>
          OGRE // PERFORMANCE SYSTEM
        </Text>

        <Text style={styles.headerTitle}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right}
    </View>
  );
}

// --------------------------------------------------
// CARD
// --------------------------------------------------

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Card({
  children,
  style,
}: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

// --------------------------------------------------
// ACTION BUTTON
// --------------------------------------------------

type ActionProps = {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
};

export function Action({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: ActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        secondary && styles.secondaryAction,
        disabled && styles.disabledAction,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.actionText,
          secondary && styles.secondaryActionText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// --------------------------------------------------
// INPUT FIELD
// --------------------------------------------------

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
} & Omit<
  TextInputProps,
  'value' | 'onChange' | 'onChangeText'
>;

export function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  style,
  ...rest
}: FieldProps) {
  return (
    <View style={styles.fieldContainer}>
      {label ? (
        <Text style={styles.fieldLabel}>
          {label}
        </Text>
      ) : null}

      <TextInput
        {...rest}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        selectionColor={C.electric}
        style={[styles.input, style]}
      />
    </View>
  );
}

// --------------------------------------------------
// SHARED STYLES
// --------------------------------------------------

export const S = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  label: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  value: {
    color: C.text,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 6,
  },

  small: {
    color: C.silver,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },

  section: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 22,
    marginBottom: 12,
  },

  eyebrow: {
    color: C.electric,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 13,
  },

  chip: {
    flex: 1,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: R.md,
    backgroundColor: C.raised,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipText: {
    color: C.text,
    fontSize: 11,
    fontWeight: '800',
  },
});

// --------------------------------------------------
// COMPONENT STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: C.bg,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 115,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 12,
  },

  eyebrow: {
    color: C.electric,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },

  headerTitle: {
    color: C.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.7,
  },

  subtitle: {
    color: C.silver,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  card: {
    backgroundColor: C.card,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    padding: 17,
    marginBottom: 12,
  },

  action: {
    minHeight: 49,
    backgroundColor: C.blue,
    borderRadius: R.md,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryAction: {
    backgroundColor: C.raised,
    borderWidth: 1,
    borderColor: C.border,
  },

  disabledAction: {
    opacity: 0.45,
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },

  secondaryActionText: {
    color: C.silver,
  },

  fieldContainer: {
    marginBottom: 14,
  },

  fieldLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },

  input: {
    minHeight: 48,
    backgroundColor: C.panel,
    color: C.text,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
});
