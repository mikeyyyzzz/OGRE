
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const horizontalPadding = clamp(width * 0.075, 24, 31);
  const logoSize = clamp(width * 0.145, 52, 60);

  const inputHeight = clamp(height * 0.066, 54, 62);
  const buttonHeight = clamp(height * 0.066, 54, 62);
  const socialHeight = clamp(height * 0.06, 48, 55);

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }

    // Temporary navigation until authentication is connected.
    router.replace("/(onboarding)/welcome" as any);
  };

  const handleApple = () => {
    Alert.alert(
      "Apple Sign In",
      "Apple authentication will be connected here."
    );
  };

  const handleGoogle = () => {
    Alert.alert(
      "Google Sign In",
      "Google authentication will be connected here."
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.screen}>
            {/* BACKGROUND FIGHTER */}
            <Image
              source={require("../../assets/images/ogre-character.png")}
              resizeMode="contain"
              style={[
  styles.fighter,
  {
    width: clamp(width * 0.98, 340, 420),
    height: clamp(height * 0.62, 480, 540),
    top: clamp(height * 0.15, 120, 140),
    right: -width * 0.07,
  },
]}
            />

            {/* MAIN CONTENT */}
            <View
              style={[
                styles.content,
                { paddingHorizontal: horizontalPadding },
              ]}
            >
              {/* BRAND */}
              <View style={styles.brand}>
                <Text
                  style={[
                    styles.logo,
                    {
                      fontSize: logoSize,
                      lineHeight: logoSize + 5,
                    },
                  ]}
                >
                  OGRE
                </Text>

                <View style={styles.redLine} />

                <Text style={styles.tagline}>
                  VENI. VECI. VEDI.
                </Text>

                <View style={styles.verticalLine} />
              </View>

              {/* LOGIN FORM */}
              <View
                style={[
                  styles.form,
                  {
                    marginTop: clamp(height * 0.165, 125, 155),
                  },
                ]}
              >
                {/* EMAIL */}
                <Text style={styles.label}>EMAIL</Text>

                <View
                  style={[
                    styles.inputContainer,
                    { height: inputHeight },
                  ]}
                >
                  <View style={styles.emailIcon}>
                    <View style={styles.emailOuter}>
                      <View style={styles.emailDiagonalLeft} />
                      <View style={styles.emailDiagonalRight} />
                    </View>
                  </View>

                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#999999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    style={styles.input}
                    returnKeyType="next"
                  />
                </View>

                {/* PASSWORD HEADER */}
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>PASSWORD</Text>

                  <Pressable
                    onPress={() =>
                      router.push("/(auth)/forgot-password" as any)
                    }
                    hitSlop={10}
                  >
                    <Text style={styles.forgotPassword}>
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>

                {/* PASSWORD */}
                <View
                  style={[
                    styles.inputContainer,
                    { height: inputHeight },
                  ]}
                >
                  <View style={styles.lockIcon}>
                    <View style={styles.lockShackle} />
                    <View style={styles.lockBody}>
                      <View style={styles.lockKeyhole} />
                    </View>
                  </View>

                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#999999"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    style={styles.input}
                    returnKeyType="done"
                    onSubmitEditing={handleSignIn}
                  />

                  <Pressable
                    onPress={() =>
                      setShowPassword((previous) => !previous)
                    }
                    style={styles.eyeButton}
                    hitSlop={10}
                  >
                    <View style={styles.eye}>
                      <View style={styles.eyePupil} />
                    </View>

                    {!showPassword && (
                      <View style={styles.eyeSlash} />
                    )}
                  </Pressable>
                </View>

                {/* SIGN IN */}
                <Pressable
                  onPress={handleSignIn}
                  style={({ pressed }) => [
                    styles.signInButton,
                    { height: buttonHeight },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.signInText}>SIGN IN</Text>

                  <View style={styles.arrow}>
                    <View style={styles.arrowLine} />
                    <View style={styles.arrowTop} />
                    <View style={styles.arrowBottom} />
                  </View>
                </Pressable>

                {/* OR DIVIDER */}
                <View style={styles.orContainer}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.orLine} />
                </View>

                {/* APPLE */}
                <Pressable
                  onPress={handleApple}
                  style={({ pressed }) => [
                    styles.socialButton,
                    { height: socialHeight },
                    pressed && styles.socialPressed,
                  ]}
                >
                  <View style={styles.appleLogo}>
                    <View style={styles.appleBody} />
                    <View style={styles.appleLeaf} />
                  </View>

                  <Text style={styles.socialText}>
                    Continue with Apple
                  </Text>
                </Pressable>

                {/* GOOGLE */}
                <Pressable
                  onPress={handleGoogle}
                  style={({ pressed }) => [
                    styles.socialButton,
                    { height: socialHeight },
                    pressed && styles.socialPressed,
                  ]}
                >
                  <Text style={styles.googleLogo}>G</Text>

                  <Text style={styles.socialText}>
                    Continue with Google
                  </Text>
                </Pressable>

                {/* CREATE ACCOUNT */}
                <View style={styles.createAccount}>
                  <Text style={styles.noAccount}>
                    No account?
                  </Text>

                  <Pressable
                    onPress={() =>
                      router.push("/(auth)/register" as any)
                    }
                    hitSlop={8}
                  >
                    <Text style={styles.createText}>
                      Create one
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboard: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  screen: {
    flex: 1,
    minHeight: 800,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  content: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 24,
    zIndex: 5,
  },

  fighter: {
    position: "absolute",
    zIndex: 0,
  },

  brand: {
    alignSelf: "flex-start",
    zIndex: 10,
  },

  logo: {
    color: "#111111",
    fontWeight: "900",
    letterSpacing: 8,
    includeFontPadding: false,
  },

  redLine: {
    width: 31,
    height: 3,
    backgroundColor: "#C90000",
    marginTop: 8,
    marginBottom: 8,
  },

  tagline: {
    color: "#777777",
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: 3.6,
    fontWeight: "500",
    includeFontPadding: false,
  },

  verticalLine: {
    width: 2,
    height: 32,
    backgroundColor: "#E2E2E2",
    marginTop: 14,
    marginLeft: 1,
  },

  form: {
    width: "100%",
    zIndex: 10,
  },

  label: {
    color: "#666666",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "700",
    letterSpacing: 3.5,
    includeFontPadding: false,
    marginBottom: 6,
  },

  inputContainer: {
    width: "100%",
    borderWidth: 1.2,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  input: {
    flex: 1,
    height: "100%",
    color: "#111111",
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 0,
  },

  emailIcon: {
    width: 28,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  emailOuter: {
    width: 24,
    height: 17,
    borderWidth: 2,
    borderColor: "#6F6F6F",
    borderRadius: 3,
    position: "relative",
  },

  emailDiagonalLeft: {
    position: "absolute",
    width: 13,
    height: 2,
    backgroundColor: "#6F6F6F",
    left: 0,
    top: 4,
    transform: [{ rotate: "34deg" }],
  },

  emailDiagonalRight: {
    position: "absolute",
    width: 13,
    height: 2,
    backgroundColor: "#6F6F6F",
    right: 0,
    top: 4,
    transform: [{ rotate: "-34deg" }],
  },

  passwordHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 6,
  },

  forgotPassword: {
    color: "#777777",
    fontSize: 13.5,
    fontWeight: "500",
  },

  lockIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },

  lockShackle: {
    position: "absolute",
    top: 1,
    width: 14,
    height: 12,
    borderWidth: 2,
    borderColor: "#6F6F6F",
    borderBottomWidth: 0,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },

  lockBody: {
    width: 20,
    height: 16,
    borderWidth: 2,
    borderColor: "#6F6F6F",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  lockKeyhole: {
    width: 4,
    height: 6,
    borderRadius: 2,
    backgroundColor: "#6F6F6F",
  },

  eyeButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  eye: {
    width: 25,
    height: 15,
    borderWidth: 2,
    borderColor: "#666666",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#666666",
  },

  eyeSlash: {
    position: "absolute",
    width: 28,
    height: 2,
    backgroundColor: "#666666",
    transform: [{ rotate: "30deg" }],
  },

  signInButton: {
    width: "100%",
    backgroundColor: "#111111",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 18,
    zIndex: 20,
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 5,
    marginLeft: 5,
  },

  arrow: {
    position: "absolute",
    right: 20,
    width: 36,
    height: 30,
    justifyContent: "center",
  },

  arrowLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#FFFFFF",
  },

  arrowTop: {
    position: "absolute",
    right: 1,
    top: 5,
    width: 16,
    height: 2,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
  },

  arrowBottom: {
    position: "absolute",
    right: 1,
    bottom: 5,
    width: 16,
    height: 2,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "-45deg" }],
  },

  orContainer: {
    width: "100%",
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    marginBottom: 12,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDDDDD",
  },

  orText: {
    color: "#858585",
    fontSize: 12,
    letterSpacing: 3.5,
    marginHorizontal: 12,
  },

  socialButton: {
    width: "100%",
    borderWidth: 1.2,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 10,
  },

  socialPressed: {
    backgroundColor: "#F7F7F7",
    transform: [{ scale: 0.99 }],
  },

  socialText: {
    color: "#151515",
    fontSize: 14.5,
    fontWeight: "500",
  },

  appleLogo: {
    position: "absolute",
    left: 20,
    width: 22,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  appleBody: {
    width: 18,
    height: 19,
    backgroundColor: "#000000",
    borderRadius: 9,
  },

  appleLeaf: {
    position: "absolute",
    width: 6,
    height: 4,
    backgroundColor: "#000000",
    borderRadius: 4,
    top: 0,
    right: 2,
    transform: [{ rotate: "-35deg" }],
  },

  googleLogo: {
    position: "absolute",
    left: 20,
    color: "#4285F4",
    fontSize: 22,
    fontWeight: "800",
  },

  createAccount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    paddingBottom: 8,
  },

  noAccount: {
    color: "#777777",
    fontSize: 14,
    marginRight: 6,
  },

  createText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
});
