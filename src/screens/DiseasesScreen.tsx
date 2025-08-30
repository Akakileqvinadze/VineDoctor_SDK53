import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { diseases } from '../data/diseases';

export default function DiseasesScreen() {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return diseases;
    return diseases.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.latin.toLowerCase().includes(q) ||
      d.symptoms.some(s => s.toLowerCase().includes(q))
    );
  }, [query]);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled) setPicked(res.assets[0].uri);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ვენახის დაავადებები</Text>
      <Text style={styles.sub}>იპოვე სიმპტომებით ან სახელით. შეგიძლია შენი ფოტოც ატვირთო შედარებისთვის.</Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder="ძებნა: 'ნაცარი', 'ლაქები', 'ბოტრიტისი'..." />
        <TouchableOpacity style={styles.button} onPress={pickImage}><Text style={styles.btnText}>ჩემი ფოტო</Text></TouchableOpacity>
      </View>

      {picked && (
        <View style={styles.preview}>
          <Image source={{ uri: picked }} style={styles.previewImg} />
          <Text style={{ color: '#666', marginTop: 6 }}>ატვირთე მაღალი ხარისხის ახლო ხედიც უკეთესი შედარებისთვის.</Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Image source={item.image} style={styles.dimg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.dim}>{item.latin}</Text>
                <Text style={styles.section}>სიმპტომები:</Text>
                {item.symptoms.map((s, i) => <Text key={i}>• {s}</Text>)}
                <Text style={styles.section}>რისკ-ფაქტორები:</Text>
                {item.riskFactors.map((s, i) => <Text key={i}>• {s}</Text>)}
                <Text style={styles.section}>კულტურული რჩევები:</Text>
                {item.tips.map((s, i) => <Text key={i}>• {s}</Text>)}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  header: { fontSize: 22, fontWeight: '800' },
  sub: { color: '#666', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10 },
  button: { backgroundColor: '#2e7d32', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  preview: { alignItems: 'center', marginBottom: 12 },
  previewImg: { width: '100%', height: 180, borderRadius: 12, resizeMode: 'cover' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  dimg: { width: 96, height: 96, borderRadius: 12, resizeMode: 'cover' },
  title: { fontSize: 18, fontWeight: '700' },
  dim: { color: '#666', marginBottom: 6 },
  section: { marginTop: 6, fontWeight: '700' }
});
