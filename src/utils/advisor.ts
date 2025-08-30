import { Forecast } from '../types';

export type SprayAdvice = {
  riskIndex: number; // 0-100
  riskReason: string[];
  recommendedWindows: { start: string; end: string; why: string[] }[]; // ISO strings
  avoidWindows: { start: string; end: string; why: string[] }[];
  notes: string[];
};

/**
 * მარტივი, კონსერვატიული ჰეურისტიკა ვაზის დაავადებების რისკისთვის.
 * ეს **არ** ცვლის აგრონომის რეკომენდაციას და ქიმიკატების ეტიკეტს.
 */
export function computeSprayAdvice(fc: Forecast): SprayAdvice {
  const now = new Date();
  const next48h = fc.hourly.filter(h => new Date(h.time) > now && new Date(h.time) < new Date(now.getTime() + 48*3600*1000));

  let risk = 0;
  const reasons: string[] = [];

  const highHumidHours = next48h.filter(h => (h.relative_humidity_2m ?? 0) >= 85).length;
  const warmHumidHours = next48h.filter(h => (h.relative_humidity_2m ?? 0) >= 80 && (h.temperature_2m ?? 0) >= 18 && (h.temperature_2m ?? 0) <= 28).length;
  const rainyHours = next48h.filter(h => (h.precipitation_probability ?? 0) >= 60 || (h.precipitation ?? 0) >= 2).length;

  if (highHumidHours >= 6) { risk += 25; reasons.push('მაღალი ტენიანობა (≥85%) რამდენიმე საათი'); }
  if (warmHumidHours >= 6) { risk += 35; reasons.push('თბილი და ნოტიო პერიოდი (18–28°C, RH≥80%)'); }
  if (rainyHours >= 3)      { risk += 20; reasons.push('წვიმის მაღალი შანსი/ოდენობა'); }

  // ქარის ფაქტორი (დღიური max, მომდევნო 2 დღე)
  const windy = fc.daily.slice(0,2).some(d => (d.wind_speed_10m_max ?? 0) > 8); // m/s
  if (windy) { risk += 10; reasons.push('ქარის გამაძლიერებელი გავლენა სპორების გავრცელებაზე'); }

  risk = Math.min(100, Math.round(risk));

  // რეკომენდებული ფანჯრები: ვეძებთ 6–12 საათიან მონაკვეთს, სადაც: წვიმის შანსი < 20%, ქარი < 7 m/s
  const recs: SprayAdvice['recommendedWindows'] = [];
  const avoids: SprayAdvice['avoidWindows'] = [];

  // აგროვებს უწყვეტ მონაკვეთებს
  const blockHours = 8; // მიზანი: ~8 სთ მშრალი ფანჯარა
  let startIdx = -1;
  for (let i=0;i<next48h.length;i++) {
    const h = next48h[i];
    const ok = (h.precipitation_probability ?? 0) < 20 && (h.precipitation ?? 0) < 0.2 && (h.wind_speed_10m ?? 0) < 7;
    if (ok && startIdx === -1) startIdx = i;
    if ((!ok || i === next48h.length-1) && startIdx !== -1) {
      const end = ok ? i : i-1;
      const hours = end - startIdx + 1;
      if (hours >= blockHours) {
        recs.push({
          start: next48h[startIdx].time,
          end: next48h[end].time,
          why: ['მცირე ნალექის შანსი (<20%)', 'ძლიერი ქარი არა (<7 m/s)']
        });
      }
      startIdx = -1;
    }
  }

  // თავიდან ასაცილებელი ფანჯრები
  let aStart = -1;
  for (let i=0;i<next48h.length;i++) {
    const h = next48h[i];
    const bad = (h.precipitation_probability ?? 0) >= 60 || (h.precipitation ?? 0) >= 2;
    if (bad && aStart === -1) aStart = i;
    if ((!bad || i === next48h.length-1) && aStart !== -1) {
      const end = bad ? i : i-1;
      const hours = end - aStart + 1;
      if (hours >= 3) {
        avoids.push({
          start: next48h[aStart].time,
          end: next48h[end].time,
          why: ['მაღალი წვიმის რისკი/ოდენობა']
        });
      }
      aStart = -1;
    }
  }

  const notes = [
    'აპლიკაცია საინფორმაციო ხასიათისაა – დამიწოდებული რჩევები არ ცვლის აგრონომის რეკომენდაციას.',
    'ქიმიკატის ეტიკეტი/ინსტრუქცია ყოველთვის სჯობია – დაიცავთ დოზას, ინტერვალს და უსაფრთხოებას.',
    'თუ მოსალოდნელია ძლიერი წვიმა, უმჯობესია დამუშავება გადაავადოთ, რათა არ ჩამოირეცხოს.',
    'სარწყავი ან ნამი ზრდის ფოთლის სველ პერიოდს – გაითვალისწინეთ.'
  ];

  return { riskIndex: risk, riskReason: reasons, recommendedWindows: recs, avoidWindows: avoids, notes };
}
