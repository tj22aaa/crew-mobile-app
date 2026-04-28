import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TextInputField from '../components/TextInputField';
import { supabase } from '../lib/supabase';
import { colors, sharedStyles } from '../theme';

function toInputDate(value) {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.split('-');
  return `${month}/${day}/${year}`;
}

export default function EditTripScreen({ route, navigation }) {
  const trip = route.params.trip;
  const [tripName, setTripName] = useState(trip.trip_name || '');
  const [destination, setDestination] = useState(trip.destination || '');
  const [budget, setBudget] = useState(String(trip.budget || ''));
  const [crewMembersCount, setCrewMembersCount] = useState(String(trip.crew_members_count || ''));
  const [startDate, setStartDate] = useState(toInputDate(trip.start_date));
  const [endDate, setEndDate] = useState(toInputDate(trip.end_date));
  const [itinerary, setItinerary] = useState(trip.activities || '');
  const [saving, setSaving] = useState(false);

  function parseDate(value) {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
      return null;
    }

    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function parseBudget(value) {
    return Number(value.replace(/[^0-9.]/g, '') || 0);
  }

  async function updateTrip() {
    if (!tripName || !destination) {
      Alert.alert('Missing details', 'Trip name and destination are required.');
      return;
    }

    const formattedStartDate = parseDate(startDate);
    const formattedEndDate = parseDate(endDate);

    if (!formattedStartDate || !formattedEndDate) {
      Alert.alert('Invalid date format', 'Please enter start date and end date in MM/DD/YYYY format.');
      return;
    }

    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('trips')
      .update({
        trip_name: tripName,
        destination,
        budget: parseBudget(budget),
        crew_members_count: Number(crewMembersCount || 0),
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        activities: itinerary,
      })
      .eq('id', trip.id)
      .eq('user_id', userData.user.id);
    setSaving(false);

    if (error) {
      Alert.alert('Update error', error.message);
      return;
    }

    navigation.navigate('MyTrips');
  }

  return (
    <ScrollView style={sharedStyles.screen} keyboardShouldPersistTaps="handled">
      <Text style={sharedStyles.title}>Edit Trip</Text>

      <TextInputField label="Trip Name" value={tripName} onChangeText={setTripName} />
      <TextInputField label="Destination" value={destination} onChangeText={setDestination} />
      <TextInputField label="Budget (USD)" value={budget} onChangeText={setBudget} keyboardType="numeric" />
      <TextInputField label="Number of Crew Members" value={crewMembersCount} onChangeText={setCrewMembersCount} keyboardType="numeric" />
      <TextInputField label="Start Date" value={startDate} onChangeText={setStartDate} />
      <Text style={styles.dateHint}>Use MM/DD/YYYY format</Text>
      <TextInputField label="End Date" value={endDate} onChangeText={setEndDate} />
      <Text style={styles.dateHint}>Use MM/DD/YYYY format</Text>
      <TextInputField label="Itinerary" value={itinerary} onChangeText={setItinerary} multiline />

      <PrimaryButton title={saving ? 'Saving...' : 'Save Update'} onPress={updateTrip} />
      <PrimaryButton title="Back" variant="secondary" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateHint: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
});
