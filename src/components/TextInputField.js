import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';

export default function TextInputField({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, multiline }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline]}
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: 7,
  },
  input: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.gray50,
    paddingHorizontal: 14,
    color: colors.gray900,
  },
  multiline: {
    minHeight: 92,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
});
