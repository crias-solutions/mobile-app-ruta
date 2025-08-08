
/**
 * Lightweight Supabase REST helper without adding new dependencies.
 * Uses PostgREST directly via fetch, authenticated with the anon key.
 *
 * IMPORTANT: The anon key is safe to use on clients. RLS protects your data.
 */
const SUPABASE_URL = 'https://joecpiedxtxajuvoqmgs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWNwaWVkeHR4YWp1dm9xbWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODI4NDgsImV4cCI6MjA3MDI1ODg0OH0.PQXUUtmqW350Voc9XHu0gU5In4_69bb9haZV5880JYk';

type RideUploadRow = {
  ride_id: string;
  vehicle?: string | null;
  platform?: string | null;
  started_at?: string | null; // ISO string
  sensors_count?: number | null;
  gps_count?: number | null;
  metadata?: Record<string, any> | null;
  sensor_csv?: string | null;
  gps_csv?: string | null;
};

async function postJson<T = any>(path: string, body: unknown): Promise<T> {
  const url = `${SUPABASE_URL}${path}`;
  console.log('supabaseRest POST', url);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    // non-JSON response
    console.log('supabaseRest non-JSON response', text);
  }

  if (!res.ok) {
    const message = (json && (json.message || json.error || json.hint)) || `HTTP ${res.status}`;
    console.log('supabaseRest error', { status: res.status, message, body: json || text });
    throw new Error(`Supabase request failed: ${message}`);
  }

  return json as T;
}

/**
 * Inserts a ride_uploads row using REST.
 * RLS policy allows anonymous inserts.
 */
export async function insertRideUpload(row: RideUploadRow) {
  const payload = [row]; // PostgREST expects an array for bulk insert
  const inserted = await postJson<RideUploadRow[]>('/rest/v1/ride_uploads', payload);
  return inserted?.[0] || null;
}
