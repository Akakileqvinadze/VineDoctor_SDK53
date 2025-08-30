import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { fetchForecast, getCurrentPosition } from '../api/weather';
import WeatherCard from '../components/WeatherCard';
import { Forecast } from '../types';

export default function WeatherScreen() {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState<string>('41.72');
  const [lon, setLon] = useState<string>('44.78');

  async function loadByGPS() {
    setError(null); setLoading(true);
    try {
      const pos = await getCurrentPosition();
      if (!pos) { setError('გთხოვთ მისცეთ მდებარეობაზე წვდომა ან ჩაწერეთ კოორდინატები.'); setLoading(false); return; }
      const fc = await fetchForecast(pos.lat, pos.lon);
      setForecast(fc);
    } catch (e: any) {
      setError(e.message || 'შეცდომა');
    } finally { setLoading(false); }
  }

  async function loadManual() {
    setError(null); setLoading(true);
    try {
      const fc = await fetchForecast(Number(lat), Number(lon));
      setForecast(fc);
    } catch (e: any) {
      setError(e.message || 'შეცდომა');
    } finally { setLoading(false); }
  }

  useEffect(() => { loadManual(); }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>ამინდი</Text>
      <Text style={styles.sub}>ავტომატური ან ხელით მდებარეობა</Text>

      <View style={styles.row}>
        <Button title="GPS-ით" onPress={loadByGPS} />
      </View>

      <View style={[styles.row, { gap: 8 } ]}>
        <TextInput style={styles.input} value={lat} keyboardType="numeric" onChangeText={setLat} placeholder="განედი (lat)" />
        <TextInput style={styles.input} value={lon} keyboardType="numeric" onChangeText={setLon} placeholder="გრძედი (lon)" />
        <Button title="ჩატვირთვა" onPress={loadManual} />
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {forecast && (
        <View>
          <WeatherCard
            title="დღიური შეჯამება (შემდეგი 2 დღე)"
            subtitle={`ზონა: ${forecast.latitude.toFixed(2)}, ${forecast.longitude.toFixed(2)} | ${forecast.timezone}`}
            rows={forecast.daily.slice(0,2).map(d => ({
              label: `${d.date}`,
              value: `ტემპ: ${d.temperature_2m_min?.toFixed?.(0)}–${d.temperature_2m_max?.toFixed?.(0)}°C • წვიმის შანსი: ${d.precipitation_probability_mean ?? '—'}% • ქარი max: ${d.wind_speed_10m_max ?? '—'} m/s`
            }))}
          />

          <WeatherCard
            title="მომდევნო 12 საათი (საათობრივი)"
            rows={forecast.hourly.slice(0,12).map(h => ({
              label: new Date(h.time).toLocaleString(),
              value: `${h.temperature_2m?.toFixed?.(0)}°C • RH ${h.relative_humidity_2m ?? '—'}% • წვიმა ${h.precipitation_probability ?? '—'}% (${h.precipitation ?? 0}მმ) • ქარი ${h.wind_speed_10m ?? '—'} m/s`
            }))}
          />
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
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10 },
  error: { color: '#b00020', marginTop: 8 }
});
