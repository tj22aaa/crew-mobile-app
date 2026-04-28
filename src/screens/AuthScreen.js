import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TextInputField from '../components/TextInputField';
import { supabase } from '../lib/supabase';
import { colors, sharedStyles } from '../theme';

export default function AuthScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const response = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (response.error) {
      Alert.alert('Authentication error', response.error.message);
      return;
    }

    if (isSignup && !response.data.session) {
      Alert.alert('Account created', 'Check your email if confirmation is enabled in Supabase.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={sharedStyles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={sharedStyles.title}>{isSignup ? 'Create account' : 'Welcome back'}</Text>
        <Text style={sharedStyles.subtitle}>Use email and password to continue to Crew.</Text>

        <TextInputField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <TextInputField label="Password" value={password} onChangeText={setPassword} placeholder="At least 6 characters" secureTextEntry />

        <PrimaryButton title={loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'} onPress={handleAuth} />
        <PrimaryButton
          title={isSignup ? 'Already have an account? Log in' : 'Need an account? Sign up'}
          variant="secondary"
          onPress={() => setIsSignup(!isSignup)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 80,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
});
