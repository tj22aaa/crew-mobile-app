import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { supabase } from '../lib/supabase';
import { colors, sharedStyles } from '../theme';

export default function MyTripsScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  async function loadTrips() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setTrips(data || []);
    }
    setLoading(false);
  }

  async function deleteTrip(tripId) {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId)
      .eq('user_id', userData.user.id);

    if (!error) {
      setTrips((current) => current.filter((trip) => trip.id !== tripId));
    }
  }

  return (
    <View style={sharedStyles.screen}>
      <Text style={sharedStyles.title}>My Trips</Text>
      <Text style={sharedStyles.subtitle}>Tap a trip to view its details.</Text>

      {loading ? (
        <ActivityIndicator color={colors.orange} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No trips yet. Create your first trip from the dashboard.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable onPress={() => navigation.navigate('TripDetails', { trip: item })}>
                <Text style={styles.tripName}>{item.trip_name}</Text>
                <Text style={styles.meta}>{item.destination}</Text>
                <Text style={styles.meta}>{item.start_date || 'No start date'} to {item.end_date || 'No end date'}</Text>
              </Pressable>

              <View style={styles.actions}>
                <Pressable style={styles.actionButton} onPress={() => navigation.navigate('EditTrip', { trip: item })}>
                  <Text style={styles.actionText}>Edit</Text>
                </Pressable>
                <Pressable style={[styles.actionButton, styles.removeButton]} onPress={() => deleteTrip(item.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      <PrimaryButton title="Back" variant="secondary" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 18,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray300,
    marginBottom: 12,
  },
  tripName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.gray900,
  },
  meta: {
    color: colors.gray700,
    marginTop: 4,
  },
  empty: {
    color: colors.gray700,
    marginTop: 20,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    borderColor: colors.orange,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  removeButton: {
    borderColor: colors.danger,
  },
  actionText: {
    color: colors.orange,
    fontWeight: '800',
  },
  removeText: {
    color: colors.danger,
    fontWeight: '800',
  },
});
