import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WeatherCard({ title, subtitle, rows }: { title: string; subtitle?: string; rows: { label: string | number; value: string | number | undefined }[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {rows.map((r, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.label}>{r.label}</Text>
          <Text style={styles.value}>{r.value ?? '—'}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#666', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { color: '#444' },
  value: { fontWeight: '600' }
});
