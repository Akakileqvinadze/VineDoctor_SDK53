import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, ActivityIndicator } from 'react-native';
import { fetchForecast, getCurrentPosition } from '../api/weather';
import { Forecast } from '../types';
import { computeSprayAdvice, SprayAdvice } from '../utils/advisor';

export default function AdvisorScreen() {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [advice, setAdvice] = useState<SprayAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null); setLoading(true);
    try {
      let pos = await getCurrentPosition();
      if (!pos) pos = { lat: 41.72, lon: 44.78 }; // fallback
      const fc = await fetchForecast(pos.lat, pos.lon);
      setForecast(fc);
      setAdvice(computeSprayAdvice(fc));
    } catch (e: any) {
      setError(e.message || 'შეცდომა');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>შეწამვლის მრჩეველი</Text>
      <Text style={styles.sub}>*(საინფორმაციო ხასიათისაა, არ ცვლის სპეციალისტის რჩევას)*</Text>
      <Button title="განახლება" onPress={load} />

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {forecast && advice && (
        <View style={{ marginTop: 12 }}>
          <View style={styles.card}>
            <Text style={styles.title}>რისკის ინდექსი: {advice.riskIndex}/100</Text>
            <Text style={styles.note}>მიზეზები:</Text>
            {advice.riskReason.map((r, i) => (
              <Text key={i}>• {r}</Text>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>რეკომენდებული ფანჯრები (შემდეგი 48სთ)</Text>
            {advice.recommendedWindows.length === 0 && <Text>ახლა სტაბილური მშრალი მონაკვეთი ვერ მოიძებნა.</Text>}
            {advice.recommendedWindows.map((w, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text>• {new Date(w.start).toLocaleString()} → {new Date(w.end).toLocaleString()}</Text>
                <Text style={styles.dim}>რატომ: {w.why.join(', ')}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>სასურველია გადადება</Text>
            {advice.avoidWindows.length === 0 && <Text>ახლა მძიმე მონაკვეთი არ ფიქსირდება ≥3სთ უწყვეტად.</Text>}
            {advice.avoidWindows.map((w, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text>• {new Date(w.start).toLocaleString()} → {new Date(w.end).toLocaleString()}</Text>
                <Text style={styles.dim}>მიზეზი: {w.why.join(', ')}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>შენიშვნები</Text>
            {advice.notes.map((n, i) => (<Text key={i}>• {n}</Text>))}
          </View>
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: '800' },
  sub: { color: '#666', marginBottom: 12 },
  error: { color: '#b00020', marginTop: 8 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 16, marginTop: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  dim: { color: '#666' },
  note: { marginTop: 6, marginBottom: 6, color: '#333' }
});
