import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TextInputField from '../components/TextInputField';
import { supabase } from '../lib/supabase';
import { colors, sharedStyles } from '../theme';

export default function CreateTripScreen({ navigation }) {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [crewMembersCount, setCrewMembersCount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [itinerary, setItinerary] = useState('');
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

  async function saveTrip() {
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
    const { error } = await supabase.from('trips').insert({
      user_id: userData.user.id,
      trip_name: tripName,
      destination,
      budget: parseBudget(budget),
      crew_members_count: Number(crewMembersCount || 0),
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      activities: itinerary,
    });
    setSaving(false);

    if (error) {
      Alert.alert('Save error', error.message);
      return;
    }

    Alert.alert('Trip saved', 'Your trip is now available in My Trips.');
    navigation.navigate('MyTrips');
  }

  return (
    <ScrollView style={sharedStyles.screen} keyboardShouldPersistTaps="handled">
      <Text style={sharedStyles.title}>Create Trip</Text>

      <TextInputField label="Trip Name" value={tripName} onChangeText={setTripName} placeholder="summer vacations" />
      <TextInputField label="Destination" value={destination} onChangeText={setDestination} placeholder="nanga parbat base camp" />
      <TextInputField label="Budget (USD)" value={budget} onChangeText={setBudget} placeholder="$100.00" keyboardType="numeric" />
      <TextInputField label="Number of Crew Members" value={crewMembersCount} onChangeText={setCrewMembersCount} keyboardType="numeric" />
      <TextInputField label="Start Date" value={startDate} onChangeText={setStartDate} placeholder="06/06/2026" />
      <Text style={styles.dateHint}>Use MM/DD/YYYY format</Text>
      <TextInputField label="End Date" value={endDate} onChangeText={setEndDate} placeholder="06/07/2026" />
      <Text style={styles.dateHint}>Use MM/DD/YYYY format</Text>
      <TextInputField
        label="Itinerary"
        value={itinerary}
        onChangeText={setItinerary}
        placeholder="Day 1: Arrival and sightseeing"
        multiline
      />

      <PrimaryButton title={saving ? 'Saving...' : 'Save Trip'} onPress={saveTrip} />
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
