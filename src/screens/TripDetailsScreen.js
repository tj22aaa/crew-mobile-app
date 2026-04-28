import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { colors, sharedStyles } from '../theme';

export default function TripDetailsScreen({ route, navigation }) {
  const trip = route.params.trip;

  return (
    <ScrollView style={sharedStyles.screen}>
      <Text style={sharedStyles.title}>{trip.trip_name}</Text>
      <Text style={sharedStyles.subtitle}>{trip.destination}</Text>

      <View style={styles.card}>
        <Detail label="Crew Members" value={trip.crew_members_count} />
        <Detail label="Budget" value={`$${Number(trip.budget || 0).toFixed(2)}`} />
        <Detail label="Start Date" value={trip.start_date || 'Not set'} />
        <Detail label="End Date" value={trip.end_date || 'Not set'} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Itinerary</Text>
        <Text style={styles.value}>{trip.activities || 'No itinerary added.'}</Text>
      </View>

      <PrimaryButton title="Back to Trips" variant="secondary" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

function Detail({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 18,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  detailRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  label: {
    color: colors.gray700,
    fontWeight: '700',
  },
  value: {
    color: colors.gray900,
    fontSize: 16,
    marginTop: 3,
  },
});
