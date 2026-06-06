
interface GpsPoint {
  t: number;
  latitude: number;
  longitude: number;
  speed: number | null;
}

export interface TripSummary {
  distance: number;
  duration: number;
  averageSpeed: number;
  maxSpeed: number;
  maxAcceleration: number;
  stops: number;
  stoppedTime: number;
  stoppedTimePercent: number;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function parseGpsCsv(csv: string): GpsPoint[] {
  const lines = csv.trim().split('\n');
  const points: GpsPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',');
    if (parts.length < 6) continue;

    const t = Number(parts[0]);
    const latitude = Number(parts[1]);
    const longitude = Number(parts[2]);
    const speed = parts[5] ? Number(parts[5]) : null;

    if (isNaN(t) || isNaN(latitude) || isNaN(longitude)) continue;

    points.push({ t, latitude, longitude, speed: isNaN(speed as number) ? null : speed });
  }

  return points;
}

export function computeTripSummary(gpsPoints: GpsPoint[]): TripSummary {
  const STOP_SPEED_M_PER_S = 0.1;
  const points = gpsPoints
    .filter(p => p.t > 0)
    .sort((a, b) => a.t - b.t);

  if (points.length === 0) {
    return {
      distance: 0,
      duration: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      maxAcceleration: 0,
      stops: 0,
      stoppedTime: 0,
      stoppedTimePercent: 0,
    };
  }

  let distance = 0;
  let maxSpeedMs = 0;
  let maxAcceleration = 0;
  let stoppedTime = 0;
  let wasMoving = false;
  let stops = 0;

  let prevSpeedMs = 0;
  let prevTime = points[0].t;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    distance += haversineDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);

    const timeDiff = (curr.t - prev.t) / 1000;
    if (timeDiff > 0 && curr.speed !== null) {
      const speedMs = curr.speed;
      if (speedMs > maxSpeedMs) {
        maxSpeedMs = speedMs;
      }

      const acceleration = (speedMs - prevSpeedMs) / timeDiff;
      if (acceleration > maxAcceleration) {
        maxAcceleration = acceleration;
      }

      if (speedMs < STOP_SPEED_M_PER_S) {
        stoppedTime += timeDiff;
        if (wasMoving) {
          stops++;
          wasMoving = false;
        }
      } else {
        wasMoving = true;
      }

      prevSpeedMs = speedMs;
    }

    prevTime = curr.t;
  }

  const firstTime = points[0].t;
  const lastTime = points[points.length - 1].t;
  const duration = (lastTime - firstTime) / 1000;

  const distanceKm = distance;
  const durationHours = duration / 3600;
  const averageSpeedKmh = durationHours > 0 ? distanceKm / durationHours : 0;
  const maxSpeedKmh = maxSpeedMs * 3.6;
  const stoppedTimePercent = duration > 0 ? (stoppedTime / duration) * 100 : 0;

  return {
    distance: distanceKm,
    duration,
    averageSpeed: averageSpeedKmh,
    maxSpeed: maxSpeedKmh,
    maxAcceleration,
    stops,
    stoppedTime,
    stoppedTimePercent,
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) {
    return `${secs} sec`;
  }
  return `${mins} min ${secs} sec`;
}
