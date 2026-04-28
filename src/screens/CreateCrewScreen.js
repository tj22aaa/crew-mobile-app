import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TextInputField from '../components/TextInputField';
import { supabase } from '../lib/supabase';
import { colors, sharedStyles } from '../theme';

export default function CreateCrewScreen({ navigation }) {
  const [crewName, setCrewName] = useState('');
  const [memberNames, setMemberNames] = useState('');
  const [crews, setCrews] = useState([]);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCrews();
    }, [])
  );

  const members = memberNames
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  async function loadCrews() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return;
    }

    const { data, error } = await supabase
      .from('crews')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setCrews(data || []);
    }
  }

  async function saveCrew() {
    if (!crewName || members.length === 0) {
      Alert.alert('Missing details', 'Enter a crew name and at least one member name.');
      return;
    }

    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from('crews').insert({
      user_id: userData.user.id,
      name: crewName,
      member_names: members,
      member_count: members.length,
    });
    setSaving(false);

    if (error) {
      Alert.alert('Save error', error.message);
      return;
    }

    Alert.alert('Crew saved', `${crewName} has ${members.length} member(s).`);
    setCrewName('');
    setMemberNames('');
    loadCrews();
  }

  async function deleteCrew(crewId) {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('crews')
      .delete()
      .eq('id', crewId)
      .eq('user_id', userData.user.id);

    if (!error) {
      setCrews((current) => current.filter((crew) => crew.id !== crewId));
    }
  }

  return (
    <ScrollView style={sharedStyles.screen} keyboardShouldPersistTaps="handled">
      <Text style={sharedStyles.title}>Create Crew</Text>
      <Text style={sharedStyles.subtitle}>Add members to your Crew!</Text>

      <TextInputField label="Crew Name" value={crewName} onChangeText={setCrewName} placeholder="Weekend Squad" />
      <TextInputField
        label="Crew Members"
        value={memberNames}
        onChangeText={setMemberNames}
        placeholder="Tayyab, Stilianos, Mike, etc."
        multiline
      />

      <View style={styles.countBox}>
        <Text style={styles.countLabel}>Number of crew members</Text>
        <Text style={styles.countValue}>{members.length}</Text>
      </View>

      <PrimaryButton title={saving ? 'Saving...' : 'Save Crew'} onPress={saveCrew} />

      <View style={styles.crewsSection}>
        <Text style={styles.tabLabel}>My Crews</Text>
        {crews.length === 0 ? (
          <Text style={styles.emptyText}>No crews created yet.</Text>
        ) : (
          crews.map((crew) => (
            <View key={crew.id} style={styles.crewCard}>
              <View style={styles.crewHeader}>
                <Text style={styles.crewTitle}>{crew.name}</Text>
                <Text style={styles.removeCrew} onPress={() => deleteCrew(crew.id)}>x</Text>
              </View>
              <Text style={styles.crewMeta}>{crew.member_count} member(s)</Text>
              <Text style={styles.crewNames}>{crew.member_names.join(', ')}</Text>
            </View>
          ))
        )}
      </View>

      <PrimaryButton title="Back" variant="secondary" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  countBox: {
    marginTop: 18,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: colors.orange,
  },
  countLabel: {
    color: colors.gray700,
    fontWeight: '700',
  },
  countValue: {
    color: colors.gray900,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 4,
  },
  crewsSection: {
    marginTop: 26,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
  },
  tabLabel: {
    alignSelf: 'flex-start',
    backgroundColor: colors.orange,
    borderRadius: 8,
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  crewCard: {
    backgroundColor: colors.card,
    borderColor: colors.gray300,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
  },
  crewTitle: {
    color: colors.gray900,
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
  },
  crewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  removeCrew: {
    color: colors.danger,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 28,
    paddingHorizontal: 6,
  },
  crewMeta: {
    color: colors.orange,
    fontWeight: '700',
    marginTop: 4,
  },
  crewNames: {
    color: colors.gray700,
    marginTop: 6,
  },
  emptyText: {
    color: colors.gray700,
    lineHeight: 22,
  },
});
