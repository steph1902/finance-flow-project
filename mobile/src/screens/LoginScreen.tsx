/**
 * Login Screen
 * Full authentication form with validation and error handling
 */

import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { Button, Input } from "@/components/ui";
import { getErrorMessage } from "@/utils/errorHandler";
import type { LoginScreenProps } from "@/types/navigation";

export default function LoginScreen({
  navigation,
}: LoginScreenProps): React.JSX.Element {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (): Promise<void> => {
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await login({ email: email.trim(), password });
      // Navigation happens automatically via AuthContext
    } catch (error) {
      const message = getErrorMessage(error);
      setSubmitError(message);
      Alert.alert("Login Failed", message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-6 py-8">
              {/* Header */}
              <View className="items-center mb-10">
                <Text className="text-4xl mb-2">💰</Text>
                <Text className="text-3xl font-bold text-gray-900">
                  FinanceFlow
                </Text>
                <Text className="text-gray-500 mt-2 text-center">
                  Your personal finance companion
                </Text>
              </View>

              {/* Form */}
              <View className="mb-6">
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  editable={!isLoading}
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  error={errors.password}
                  secureTextEntry
                  showPasswordToggle
                  autoComplete="password"
                  editable={!isLoading}
                />
              </View>

              {/* Submit Error */}
              {submitError && (
                <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <Text className="text-red-700 text-center">
                    {submitError}
                  </Text>
                </View>
              )}

              {/* Login Button */}
              <Button
                title={isLoading ? "Signing in..." : "Sign In"}
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                fullWidth
                size="lg"
              />

              {/* Demo Hint */}
              <View className="mt-8 p-4 bg-blue-50 rounded-xl">
                <Text className="text-blue-800 text-center text-sm">
                  💡 Demo Mode: Use any email and password (6+ chars) to sign in
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
