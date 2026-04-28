import { Image, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Image source={require('../../assets/crew-logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.tagline}>Roll with your crew.</Text>
      <Text style={styles.copy}>Plan simple trips, collaborate and create your own Crew!</Text>
      <PrimaryButton title="Get Started" onPress={() => navigation.navigate('Auth')} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.gray900,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 190,
    height: 190,
    marginBottom: 16,
  },
  tagline: {
    color: colors.orange,
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
  },
  copy: {
    color: colors.gray300,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 18,
    marginBottom: 18,
    textAlign: 'center',
  },
});
