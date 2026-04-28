import { Alert, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { supabase } from '../lib/supabase';
import { colors, sharedStyles } from '../theme';

export default function DashboardScreen({ navigation }) {
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout error', error.message);
    }
  }

  return (
    <View style={sharedStyles.screen}>
      <View>
        <View style={styles.header}>
          <Text style={styles.dashboardLabel}>Main Dashboard</Text>
          <Text style={[sharedStyles.title, styles.centerText]}>Crew</Text>
          <Text style={[sharedStyles.subtitle, styles.centerText, styles.tagline]}>Roll with your crew.</Text>
          <View style={styles.accent} />
        </View>

        <View style={styles.menu}>
          <PrimaryButton title="Create New Trip" onPress={() => navigation.navigate('CreateTrip')} />
          <PrimaryButton title="Create Crew" onPress={() => navigation.navigate('CreateCrew')} />
          <PrimaryButton title="My Trips" onPress={() => navigation.navigate('MyTrips')} />
        </View>
      </View>

      <View style={styles.logoutWrap}>
        <PrimaryButton title="Log Out" variant="secondary" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 42,
    paddingBottom: 18,
    alignItems: 'center',
  },
  menu: {
    marginTop: 28,
  },
  logoutWrap: {
    marginTop: 'auto',
    paddingBottom: 8,
  },
  centerText: {
    textAlign: 'center',
  },
  tagline: {
    fontStyle: 'italic',
  },
  dashboardLabel: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  accent: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orange,
    marginTop: 16,
  },
});
