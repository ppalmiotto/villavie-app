// ══════════════════════════════════════════════
//  VILLA VIE — auth.js
//  Resident login via Supabase Auth
//  Admin creates accounts in Supabase dashboard
// ══════════════════════════════════════════════

var currentUser = null;

// ── INIT AUTH ─────────────────────────────────
// Called from app.js init() after initSupabase()
async function initAuth() {
  // Re-initialise if client not ready (timing safety net)
  if (!sbClient || typeof sbClient.auth === 'undefined') {
    initSupabase(); const ok = !!sbClient;
    if (!ok) {
      console.error('Supabase failed to initialise');
      showLoginScreen();
      const errEl = document.getElementById('loginError');
      if (errEl) { errEl.textContent = 'Connection error. Please refresh and try again.'; errEl.style.display = 'block'; }
      return;
    }
  }

  // Wire enter key on password field
  const pw = document.getElementById('loginPassword');
  if (pw) pw.addEventListener('keydown', e => { if (e.key === 'Enter') residentLogin(); });

  // Check for existing session
  const { data: { session } } = await sbClient.auth.getSession();
  if (session) {
    currentUser = session.user;
    onAuthSuccess(session.user);
  } else {
    showLoginScreen();
  }

  // Listen for auth state changes (login/logout)
  sbClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      onAuthSuccess(session.user);
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      showLoginScreen();
    } else if (event === 'PASSWORD_RECOVERY') {
      showPasswordResetForm();
    }
  });
}

// ── LOGIN ─────────────────────────────────────
async function residentLogin() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  const btnEl = document.getElementById('loginBtn');

  if (!email || !password) {
    errorEl.textContent = 'Please enter your email and password.';
    errorEl.style.display = 'block';
    return;
  }

  // Ensure Supabase client is ready
  if (!sbClient || typeof sbClient.auth === 'undefined') {
    initSupabase();
  }
  if (!sbClient || typeof sbClient.auth === 'undefined') {
    errorEl.textContent = 'Connection error. Please refresh the page and try again.';
    errorEl.style.display = 'block';
    return;
  }

  btnEl.textContent = 'Signing in…';
  btnEl.disabled = true;
  errorEl.style.display = 'none';

  const { data, error } = await sbClient.auth.signInWithPassword({ email, password });

  btnEl.textContent = 'Sign In';
  btnEl.disabled = false;

  if (error) {
    errorEl.textContent = error.message === 'Invalid login credentials'
      ? 'Incorrect email or password. Please try again.'
      : error.message;
    errorEl.style.display = 'block';
    return;
  }

  // onAuthStateChange will handle the rest
}

// ── LOGOUT ────────────────────────────────────
async function residentLogout() {
  await sbClient.auth.signOut();
  // onAuthStateChange handles UI reset
}

// ── PASSWORD RESET REQUEST ────────────────────
async function requestPasswordReset() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  if (!email) {
    document.getElementById('loginError').textContent = 'Enter your email address first.';
    document.getElementById('loginError').style.display = 'block';
    return;
  }
  const { error } = await sbClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname,
  });
  if (error) {
    document.getElementById('loginError').textContent = error.message;
    document.getElementById('loginError').style.display = 'block';
  } else {
    document.getElementById('loginError').style.display = 'none';
    showToast('Password reset email sent ✓');
  }
}

// ── PASSWORD RESET FORM (after clicking email link) ──
async function submitNewPassword() {
  const pw = document.getElementById('newPassword').value;
  const pw2 = document.getElementById('newPassword2').value;
  const errorEl = document.getElementById('resetError');
  if (!pw || pw.length < 6) { errorEl.textContent = 'Password must be at least 6 characters.'; errorEl.style.display = 'block'; return; }
  if (pw !== pw2) { errorEl.textContent = 'Passwords do not match.'; errorEl.style.display = 'block'; return; }
  const { error } = await sbClient.auth.updateUser({ password: pw });
  if (error) { errorEl.textContent = error.message; errorEl.style.display = 'block'; return; }
  showToast('Password updated — please sign in ✓');
  hidePasswordResetForm();
}

// ── UI TRANSITIONS ────────────────────────────
function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('passwordResetScreen').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.getElementById('app').classList.remove('visible');
  document.getElementById('splash').classList.add('hidden');
}

function onAuthSuccess(user) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('passwordResetScreen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  document.getElementById('app').classList.add('visible');
  document.getElementById('splash').classList.add('hidden');

  // Show user email in header
  const emailEl = document.getElementById('residentEmail');
  if (emailEl) emailEl.textContent = user.email;

  // Load app data
  // Initialise segments from port data then render everything
  if (typeof initSegments === 'function') initSegments();
  if (typeof renderSegmentFilter === 'function') renderSegmentFilter();
  if (typeof renderPorts === 'function') renderPorts();
  if (typeof renderSchedule === 'function') renderSchedule(0);
  if (typeof renderUpdates === 'function') renderUpdates();
  if (typeof renderSafety === 'function') renderSafety();
  if (typeof renderSpaMenu === 'function') renderSpaMenu();
  if (typeof renderEmergencyMessages === 'function') renderEmergencyMessages();
  if (typeof initDatabase === 'function') initDatabase();
  if (typeof loadPolls === 'function') loadPolls();
  // Chat initialises lazily when the tab is first opened
}

function showPasswordResetForm() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('passwordResetScreen').style.display = 'flex';
}

function hidePasswordResetForm() {
  document.getElementById('passwordResetScreen').style.display = 'none';
  showLoginScreen();
}

// ── ENTER KEY SUPPORT ─────────────────────────
// Enter key wired in initAuth()

// ── EXPOSE GLOBALS ─────────────────────────────
window.initAuth = initAuth;
window.residentLogin = residentLogin;
window.residentLogout = residentLogout;
window.requestPasswordReset = requestPasswordReset;
window.submitNewPassword = submitNewPassword;
window.showLoginScreen = showLoginScreen;
window.onAuthSuccess = onAuthSuccess;
window.showPasswordResetForm = showPasswordResetForm;
window.hidePasswordResetForm = hidePasswordResetForm;
