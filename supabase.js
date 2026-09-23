// ══════════════════════════════════════════════
//  VILLA VIE — Supabase Integration
//  Replace the two values below with your own
//  from Supabase → Settings → API
// ══════════════════════════════════════════════

const SUPABASE_URL = 'https://xqpvqztphkenokkjrzef.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcHZxenRwaGtlbm9ra2pyemVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE4MDgsImV4cCI6MjA5NjEzNzgwOH0.apt_Cue9zVOXHPfNLVUbIY7LTK4hUmCEQ2oI8b_vIaM';

// ── Load Supabase client from CDN ─────────────
// (loaded via <script> tag in index.html)
var sbClient = null;

function initSupabase() {
  // Guard: never create more than one client
  if (sbClient && typeof sbClient.from === 'function') return true;
  // Supabase v2 CDN exposes createClient at window.supabase.createClient
  const factory = window.supabase?.createClient || window.supabaseJs?.createClient;
  if (!factory) {
    console.warn('Supabase client library not loaded yet');
    return false;
  }
  sbClient = factory(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.sbClient = sbClient;
  return true;
}

// ══════════════════════════════════════════════
//  EMERGENCY ALERTS — real-time
// ══════════════════════════════════════════════

// Fetch all alerts from DB and render
async function loadEmergencyAlerts() {
  if (!sbClient) return;
  const { data, error } = await sbClient
    .from('emergency_alerts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('Error loading alerts:', error); return; }
  // Sync into in-memory array
  emergencyMessages.length = 0;
  (data || []).forEach(row => {
    emergencyMessages.push({
      id: row.id,
      title: row.title,
      body: row.body,
      time: new Date(row.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) +
            ' · ' + new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      active: row.active
    });
  });
  renderEmergencyMessages();
  // Show banner if any active alert exists
  const active = emergencyMessages.find(m => m.active);
  if (active) showEmergencyBanner(active.title, active.body, active.time);
  else dismissEmergencyBanner();
}

// Subscribe to real-time changes on emergency_alerts table
function subscribeToEmergencyAlerts() {
  if (!sbClient) return;
  sbClient
    .channel('emergency_alerts_channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'emergency_alerts' }, payload => {
      console.log('Emergency alert change received:', payload);
      loadEmergencyAlerts(); // Reload all alerts on any change
    })
    .subscribe();
}

// Post a new alert to Supabase
async function postEmergencyAlertToDb(title, body) {
  if (!sbClient) { showToast('Database not connected'); return false; }
  const { error } = await sbClient
    .from('emergency_alerts')
    .insert([{ title, body, active: true }]);
  if (error) { console.error('Error posting alert:', error); showToast('Error sending alert'); return false; }
  return true;
}

// Mark an alert resolved in Supabase
async function resolveAlertInDb(id) {
  if (!sbClient) return false;
  const { error } = await sbClient
    .from('emergency_alerts')
    .update({ active: false })
    .eq('id', id);
  if (error) { console.error('Error resolving alert:', error); return false; }
  return true;
}

// Clear all active alerts in Supabase
async function clearAllAlertsInDb() {
  if (!sbClient) return false;
  const { error } = await sbClient
    .from('emergency_alerts')
    .update({ active: false })
    .eq('active', true);
  if (error) { console.error('Error clearing alerts:', error); return false; }
  return true;
}

// ══════════════════════════════════════════════
//  UPDATES — real-time
// ══════════════════════════════════════════════

async function loadUpdates() {
  if (!sbClient) return;
  const { data, error } = await sbClient
    .from('updates')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('Error loading updates:', error); return; }
  updates.length = 0;
  (data || []).forEach(row => {
    updates.push({
      id: row.id,
      category: row.category,
      title: row.title,
      body: row.body,
      time: new Date(row.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    });
  });
  renderUpdates();
}

function subscribeToUpdates() {
  if (!sbClient) return;
  sbClient
    .channel('updates_channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'updates' }, payload => {
      console.log('Update change received:', payload);
      loadUpdates();
      document.getElementById('updatesBadge').classList.add('show');
    })
    .subscribe();
}

async function postUpdateToDb(title, body, category) {
  if (!sbClient) { showToast('Database not connected'); return false; }
  const { error } = await sbClient
    .from('updates')
    .insert([{ title, body, category }]);
  if (error) { console.error('Error posting update:', error); showToast('Error posting update'); return false; }
  return true;
}

// ══════════════════════════════════════════════
//  INIT — called from app.js init()
// ══════════════════════════════════════════════

async function initDatabase() {
  const ready = initSupabase();
  if (!ready) {
    console.warn('Supabase not ready — falling back to local data');
    return;
  }
  // Load initial data
  await loadEmergencyAlerts();
  await loadUpdates();
  // Subscribe to real-time changes
  subscribeToEmergencyAlerts();
  subscribeToUpdates();
  console.log('Supabase connected and subscribed');
}

// ── EXPOSE GLOBALS ─────────────────────────────
window.sbClient = null;
window.initSupabase = initSupabase;
window.loadEmergencyAlerts = loadEmergencyAlerts;
window.subscribeToEmergencyAlerts = subscribeToEmergencyAlerts;
window.postEmergencyAlertToDb = postEmergencyAlertToDb;
window.resolveAlertInDb = resolveAlertInDb;
window.clearAllAlertsInDb = clearAllAlertsInDb;
window.loadUpdates = loadUpdates;
window.subscribeToUpdates = subscribeToUpdates;
window.postUpdateToDb = postUpdateToDb;
window.initDatabase = initDatabase;
