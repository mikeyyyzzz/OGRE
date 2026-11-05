
import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { C } from '../../src/theme/tokens';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

export default function CoachScreen() {
  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text:
        "I'm PEAK AI. Your personal fitness intelligence system. What are we working on today?",
    },
  ]);

  function sendMessage() {
    const trimmed = message.trim();

    if (!trimmed) return;

    setMessages((previous) => [
      ...previous,
      {
        role: 'user',
        text: trimmed,
      },
      {
        role: 'assistant',
        text:
          'Your message has been received. Live AI integration will be connected through the OGRE backend.',
      },
    ]);

    setMessage('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close PEAK AI"
        >
          <Ionicons
            name="chevron-down"
            size={25}
            color={C.text}
          />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>
            OGRE INTELLIGENCE
          </Text>

          <Text style={styles.title}>
            PEAK AI
          </Text>
        </View>

        <Ionicons
          name="sparkles"
          size={25}
          color={C.electric}
        />
      </View>

      <View style={styles.hero}>
        <Ionicons
          name="sparkles"
          size={35}
          color={C.electric}
        />

        <Text style={styles.heroTitle}>
          YOUR PERFORMANCE COACH.
        </Text>

        <Text style={styles.heroText}>
          Train smarter. Eat better. Recover stronger.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 18,
          gap: 14,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((item, index) => (
          <View
            key={index}
            style={[
              styles.message,
              item.role === 'user'
                ? styles.userMessage
                : styles.aiMessage,
            ]}
          >
            <Text style={styles.messageLabel}>
              {item.role === 'user' ? 'YOU' : 'PEAK AI'}
            </Text>

            <Text style={styles.messageText}>
              {item.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Ask PEAK AI anything..."
          placeholderTextColor={C.muted}
          style={styles.input}
          multiline
          returnKeyType="send"
          blurOnSubmit={false}
        />

        <Pressable
          onPress={sendMessage}
          style={styles.sendButton}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Ionicons
            name="send"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      <Text style={styles.notice}>
        DEVELOPMENT MODE · LIVE AI NOT CONNECTED
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 20,
    paddingTop: 55,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },

  eyebrow: {
    color: C.electric,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },

  title: {
    color: C.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 3,
  },

  hero: {
    backgroundColor: '#14283C',
    margin: 18,
    padding: 20,
    borderRadius: 20,
  },

  heroTitle: {
    color: C.text,
    fontWeight: '900',
    fontSize: 16,
    marginTop: 12,
  },

  heroText: {
    color: C.silver,
    fontSize: 12,
    marginTop: 7,
  },

  message: {
    maxWidth: '88%',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
  },

  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: C.card,
  },

  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: C.deep,
  },

  messageLabel: {
    color: C.electric,
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 7,
  },

  messageText: {
    color: C.text,
    fontSize: 13,
    lineHeight: 20,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    backgroundColor: C.card,
    color: C.text,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
  },

  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: C.blue,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notice: {
    color: C.muted,
    fontSize: 9,
    textAlign: 'center',
    paddingBottom: 10,
  },
});
