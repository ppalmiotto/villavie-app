// ══════════════════════════════════════════════
//  VILLA VIE RESIDENCES — app.js
// ══════════════════════════════════════════════

// ── ADMIN CREDENTIALS ────────────────────────
const ADMIN_CREDENTIALS = [
  { email: 'admin@villavie.com', password: 'VillaVie2025!' },
  { email: 'crew@villavie.com',  password: 'Crew2025!' },
];

// ── STATE ────────────────────────────────────
let isAdmin = false;
let currentDay = 0;
let pendingPhotoDataURL = null;

// ports[] is defined by ports.js which loads before this script runs
// segments and activeSegment are derived from ports on auth success
var segments = [];
var activeSegment = '';

function initSegments() {
  var segs = [];
  var seen = {};
  for (var i = 0; i < ports.length; i++) {
    var s = ports[i].segment;
    if (s && !seen[s]) { seen[s] = true; segs.push(s); }
  }
  segments = segs;
  activeSegment = ''; // Show all segments by default
}

// ── SEGMENTS ─────────────────────────────────
// segments and activeSegment are set by ports.js after lazy load

// ── SCHEDULE DATA ─────────────────────────────
const scheduleData = {
  0: [
    { time: '06:30 AM', title: 'Sunrise Yoga', location: 'Sun Deck, Level 11', category: 'wellness' },
    { time: '07:00 AM', title: 'Breakfast Service Opens', location: 'The Grand Dining Room', category: 'dining' },
    { time: '08:00 AM', title: 'Shore Excursions Depart', location: 'Gangway, Level 3', category: 'port' },
    { time: '10:00 AM', title: 'Watercolour Class', location: 'Arts Studio, Level 8', category: 'activity' },
    { time: '12:30 PM', title: 'Poolside Barbecue Lunch', location: 'Lido Pool Deck', category: 'dining' },
    { time: '03:00 PM', title: 'Afternoon Tea', location: 'The Drawing Room', category: 'dining' },
    { time: '06:00 PM', title: 'Cocktail Hour', location: 'Sky Bar, Level 12', category: 'entertainment' },
    { time: '07:30 PM', title: 'Gala Dinner — Formal Night', location: 'The Grand Dining Room', category: 'dining' },
    { time: '09:30 PM', title: 'Live Jazz Performance', location: 'Atrium Stage', category: 'entertainment' },
  ],
  1: [
    { time: '07:00 AM', title: 'Tai Chi on Deck', location: 'Sun Deck, Level 11', category: 'wellness' },
    { time: '07:30 AM', title: 'Breakfast Service Opens', location: 'The Grand Dining Room', category: 'dining' },
    { time: '09:30 AM', title: 'Cooking Demonstration', location: 'Culinary Studio', category: 'activity' },
    { time: '11:00 AM', title: 'Trivia Morning', location: 'The Drawing Room', category: 'entertainment' },
    { time: '01:00 PM', title: 'Lunch Buffet', location: 'Lido Restaurant', category: 'dining' },
    { time: '03:30 PM', title: 'Pilates Class', location: 'Fitness Centre', category: 'wellness' },
    { time: '07:00 PM', title: 'Dinner Service', location: 'The Grand Dining Room', category: 'dining' },
    { time: '09:00 PM', title: 'Cinema Night', location: 'Theatre, Level 6', category: 'entertainment' },
  ],
  2: [
    { time: '06:00 AM', title: 'Early Shore Call', location: 'Gangway, Level 3', category: 'port' },
    { time: '07:00 AM', title: 'Breakfast Service Opens', location: 'The Grand Dining Room', category: 'dining' },
    { time: '01:30 PM', title: 'Light Lunch — Open Seating', location: 'Lido Restaurant', category: 'dining' },
    { time: '07:30 PM', title: 'Gala Dinner', location: 'The Grand Dining Room', category: 'dining' },
    { time: '10:00 PM', title: 'DJ Set', location: 'Sky Bar, Level 12', category: 'entertainment' },
  ],
  3: [
    { time: '07:30 AM', title: 'Breakfast Service Opens', location: 'The Grand Dining Room', category: 'dining' },
    { time: '09:00 AM', title: 'Spa & Wellness Morning', location: 'The Spa, Level 5', category: 'wellness' },
    { time: '04:00 PM', title: 'Wine Tasting', location: 'Wine Cellar, Level 4', category: 'activity' },
    { time: '07:00 PM', title: 'Dinner Service', location: 'The Grand Dining Room', category: 'dining' },
    { time: '09:30 PM', title: 'Evening Entertainment', location: 'Theatre, Level 6', category: 'entertainment' },
  ],
  4: [
    { time: '05:30 AM', title: 'Early Shore Call', location: 'Gangway, Level 3', category: 'port' },
    { time: '07:00 AM', title: 'Breakfast Service Opens', location: 'The Grand Dining Room', category: 'dining' },
    { time: '07:30 PM', title: 'Dinner Service', location: 'The Grand Dining Room', category: 'dining' },
  ],
};

// ── UPDATES ───────────────────────────────────
const updates = [
  { category: 'announcement', time: '9:00 AM', title: 'Welcome aboard the World Odyssey', body: 'Your voyage management team wishes you a wonderful journey. Please review your daily schedule cards delivered each morning and contact Guest Services on extension 100 for any assistance.' },
  { category: 'dining', time: '10:30 AM', title: 'Gala dinner reservations now open', body: 'Formal gala dinners are scheduled for selected port evenings throughout the voyage. Reservations are open via the front desk or extension 201.' },
  { category: 'activities', time: '2:00 PM', title: 'Shore excursion booking reminder', body: 'Spaces on popular shore excursions fill quickly. Visit Guest Services to secure your preferred tours for upcoming ports.' },
];

// ── SPA DATA ──────────────────────────────────
const spaMenu = [
  // MASSAGE
  { name: 'Mediterranean Citrus', category: 'massage', icon: '🍋', duration: '60 min', price: '$149', desc: 'A signature citrus-infused massage drawing inspiration from the Mediterranean coast.' },
  { name: 'Balinese', category: 'massage', icon: '🌺', duration: '30, 60, 90 min', price: '$65 | $99 | $175', desc: 'Traditional Balinese techniques combining acupressure, skin rolling and aromatherapy.' },
  { name: 'Balinese Four Hand', category: 'massage', icon: '🙌', duration: '60, 90 min', price: '$289 | $395', desc: 'A synchronised massage performed by two therapists simultaneously for total relaxation.' },
  { name: 'Deep Tissue', category: 'massage', icon: '💪', duration: '60, 90 min', price: '$129 | $175', desc: 'Targets deeper layers of muscle and connective tissue to relieve chronic pain and tension.' },
  { name: 'Holistic', category: 'massage', icon: '🌿', duration: '60, 90 min', price: '$129 | $175', desc: 'A full-body holistic treatment addressing physical and emotional wellbeing.' },
  { name: 'Hot Stone', category: 'massage', icon: '🪨', duration: '60, 90 min', price: '$129 | $175', desc: 'Warm volcanic stones melt away tension while the therapist works with flowing strokes.' },
  { name: 'Seashells', category: 'massage', icon: '🐚', duration: '60, 90 min', price: '$135 | $180', desc: 'Smooth heated seashells glide over the body delivering warmth and deep muscle relief.' },
  { name: 'Warming Candle', category: 'massage', icon: '🕯️', duration: '60, 90 min', price: '$135 | $180', desc: 'Warm massage candle oil is drizzled directly on the skin for a deeply nourishing experience.' },
  { name: 'Bamboo', category: 'massage', icon: '🎋', duration: '60, 90 min', price: '$135 | $180', desc: 'Warm bamboo canes are used to knead and stretch the muscles for deep tissue relief.' },
  { name: 'Himalayan Dream', category: 'massage', icon: '🏔️', duration: '60, 90 min', price: '$135 | $180', desc: 'Warmed Himalayan salt stones combined with essential oils for a deeply grounding treatment.' },

  // FACIALS
  { name: 'Age-Defying Facial', category: 'facial', icon: '✨', duration: '60 min', price: '$145', desc: 'Fight the first signs of ageing with the Sangiovese Age-Defying Facial.' },
  { name: 'Firming Facial', category: 'facial', icon: '🌸', duration: '60 min', price: '$145', desc: 'Pamper a more mature complexion with this soothing firming facial treatment.' },
  { name: 'Brightening Facial', category: 'facial', icon: '☀️', duration: '60 min', price: '$145', desc: 'Delivering a brightening effect without compromising your tan.' },
  { name: 'Men\'s Luxury Facial', category: 'facial', icon: '💆', duration: '60 min', price: '$145', desc: 'The Morellino Men\'s Facial is perfectly formulated for men\'s skin.' },

  // RITUALS
  { name: 'Body Velvet', category: 'ritual', icon: '🫧', duration: '90 min', price: '$185', desc: 'A luxurious body ritual leaving skin velvety smooth and deeply nourished.' },
  { name: 'Body Stimulating', category: 'ritual', icon: '⚡', duration: '90 min', price: '$185', desc: 'An invigorating ritual designed to stimulate circulation and energise the body.' },
  { name: 'Body Scrub', category: 'ritual', icon: '🧂', duration: '30 min', price: '$55', desc: 'A full-body exfoliation to buff away dead skin cells and reveal a radiant glow.' },
  { name: 'Balinese Thalassa', category: 'ritual', icon: '🌊', duration: '60 min', price: '$139', desc: 'A sea-inspired ritual combining Balinese techniques with marine-rich products.' },
  { name: 'Relax and Sleep', category: 'ritual', icon: '😴', duration: '90 min', price: '$185', desc: 'A deeply restorative ritual using calming aromatherapy to prepare body and mind for sleep.' },
  { name: 'Ultimate Hydration', category: 'ritual', icon: '💧', duration: '60 min', price: '$139', desc: 'Intensive hydration treatment that replenishes moisture from head to toe.' },
  { name: 'Bespoke Body Therapies', category: 'ritual', icon: '⭐', duration: '60, 90, 120 min', price: '$139 | $185 | $230', desc: 'A fully personalised body treatment tailored to your individual needs and preferences.' },

  // ENHANCEMENT
  { name: 'Reflexology', category: 'enhancement', icon: '🦶', duration: '20 min', price: '$39', desc: 'Relieves stress and tension from the body through foot massage of reflex zones.' },
  { name: 'Scalp Massage', category: 'enhancement', icon: '💆', duration: '20 min', price: '$39', desc: 'Designed to relax the mind and encourage circulation.' },
  { name: 'Hand or Foot Treatment', category: 'enhancement', icon: '🤲', duration: '35 min', price: '$39', desc: 'Experience a luxurious hand or foot treatment.' },

  // HAIR SALON
  { name: 'Shampoo & Style', category: 'salon', icon: '💇', duration: '—', price: '$40', desc: 'Professional shampoo and blow dry styling by our in-house hair team.' },
  { name: 'Cut', category: 'salon', icon: '✂️', duration: '—', price: '$32', desc: 'Precision haircut by our experienced stylists.' },
  { name: 'Color', category: 'salon', icon: '🎨', duration: '—', price: '$52', desc: 'Full hair colour service using professional products.' },
  { name: 'Gloss', category: 'salon', icon: '✨', duration: '—', price: '$39', desc: 'A glossing treatment to add shine and vibrancy to your hair.' },
  { name: 'Color & Lightning', category: 'salon', icon: '⚡', duration: '—', price: '$72', desc: 'Combined colour and lightening service for a multi-dimensional look.' },
  { name: 'Contrasts', category: 'salon', icon: '🖤', duration: '—', price: '$84', desc: 'Bold contrast colour techniques for a striking finish.' },
  { name: 'Highlight', category: 'salon', icon: '🌟', duration: '—', price: '$72', desc: 'Expert highlighting to add dimension and brightness.' },
  { name: 'Hairstyling', category: 'salon', icon: '💫', duration: '—', price: '$39', desc: 'Professional styling for any occasion — from casual to formal.' },
  { name: 'Rituals Add-On (AVEDA)', category: 'salon', icon: '🌱', duration: '—', price: '$19', desc: 'AVEDA Shampoo, Mask and Texturizer/Thermique add-on.' },
  { name: 'AVEDA Shampoo', category: 'salon', icon: '🌱', duration: '—', price: '$7', desc: 'Premium AVEDA shampoo treatment.' },
  { name: 'AVEDA Mask', category: 'salon', icon: '🌱', duration: '—', price: '$7', desc: 'Nourishing AVEDA hair mask treatment.' },
  { name: 'Flat Iron Straightener', category: 'salon', icon: '💈', duration: '—', price: '$12', desc: 'Professional flat iron straightening service.' },
  { name: 'Extension Fee', category: 'salon', icon: '💇', duration: '—', price: '$13', desc: 'Additional fee applicable for hair extensions.' },

  // BEAUTY
  { name: 'Half / Full Legs Wax', category: 'beauty', icon: '🦵', duration: '—', price: '$45', desc: 'Professional waxing for half or full legs.' },
  { name: 'Underarms Wax', category: 'beauty', icon: '💪', duration: '—', price: '$20', desc: 'Underarm waxing for smooth, clean results.' },
  { name: 'Lower Arms Wax', category: 'beauty', icon: '🤲', duration: '—', price: '$25', desc: 'Professional lower arm waxing.' },
  { name: 'Full Arms Wax', category: 'beauty', icon: '🤲', duration: '—', price: '$40', desc: 'Full arm waxing for smooth results.' },
  { name: 'Lip / Chin or Eyebrows Wax', category: 'beauty', icon: '🧖', duration: '—', price: '$15', desc: 'Precise facial waxing for lip, chin or eyebrow shaping.' },
  { name: 'Bikini Line Wax', category: 'beauty', icon: '🌸', duration: '—', price: '$25', desc: 'Professional bikini line waxing.' },
  { name: 'Spa Manicure', category: 'beauty', icon: '💅', duration: '60 min', price: '$65', desc: 'A relaxing spa manicure with full nail care and polish.' },
  { name: 'Express Manicure', category: 'beauty', icon: '💅', duration: '25 min', price: '$30', desc: 'A quick yet thorough manicure for beautiful nails.' },
  { name: 'Spa Pedicure', category: 'beauty', icon: '🦶', duration: '60 min', price: '$85', desc: 'A luxurious spa pedicure with full foot care and polish.' },
  { name: 'Express Pedicure', category: 'beauty', icon: '🦶', duration: '30 min', price: '$40', desc: 'A quick yet thorough pedicure.' },
  { name: 'Nail Reconstruction', category: 'beauty', icon: '✨', duration: '—', price: '$115', desc: 'Full nail reconstruction service.' },
  { name: 'Reconstruction or Repair Single Nail', category: 'beauty', icon: '💅', duration: '—', price: '$18', desc: 'Single nail reconstruction or repair.' },
  { name: 'Gel Overlay on Natural Nails', category: 'beauty', icon: '💅', duration: '—', price: '$59', desc: 'Gel overlay applied over natural nails for a long-lasting finish.' },
  { name: 'Semi Permanent Nail Polish', category: 'beauty', icon: '💅', duration: '—', price: '$10', desc: 'Semi-permanent nail polish add-on.' },
  { name: 'French Nails', category: 'beauty', icon: '💅', duration: '—', price: '$15', desc: 'Classic French nail finish add-on.' },
  { name: 'Makeup', category: 'beauty', icon: '💄', duration: '—', price: 'from $39', desc: 'Professional makeup application for any occasion.' },
];

const catIcons = { massage: '💆', facial: '✨', ritual: '🌿', enhancement: '⭐', salon: '💇', beauty: '💅' };
const catLabels = { massage: 'Massage', facial: 'Facials', ritual: 'Rituals', enhancement: 'Enhancements', salon: 'Hair Salon', beauty: 'Beauty' };

function renderSpaMenu() {
  const el = document.getElementById('spaMenuList');
  if (!el) return;

  // Group by category
  const grouped = {};
  spaMenu.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  let html = '';
  Object.keys(grouped).forEach(cat => {
    html += `<div class="spa-category-label">${catLabels[cat] || cat}</div>`;
    grouped[cat].forEach(t => {
      html += `
        <div class="spa-treatment-card">
          <div class="spa-treatment-icon">${t.icon}</div>
          <div class="spa-treatment-body">
            <div class="spa-treatment-name">${t.name}</div>
            <div class="spa-treatment-desc">${t.desc}</div>
            <div class="spa-treatment-meta">
              <span class="spa-tag">⏱ ${t.duration}</span>
              <span class="spa-tag spa-tag-price">${t.price}</span>
            </div>
          </div>
        </div>`;
    });
  });
  el.innerHTML = html;

  // Populate treatment dropdown
  const sel = document.getElementById('apptTreatment');
  if (sel) {
    sel.innerHTML = '<option value="">Select a treatment...</option>' +
      spaMenu.map(t => `<option value="${t.name}">${t.name} (${t.duration} · ${t.price})</option>`).join('');
  }
}

function addTreatment() {
  const name = document.getElementById('txName').value.trim();
  const cat = document.getElementById('txCat').value;
  const duration = document.getElementById('txDuration').value.trim();
  const price = document.getElementById('txPrice').value.trim();
  const desc = document.getElementById('txDesc').value.trim();
  if (!name || !duration || !price) { showToast('Please fill required fields'); return; }
  spaMenu.push({ name, category: cat, icon: catIcons[cat] || '🌿', duration, price, desc });
  renderSpaMenu();
  hideForm('addTreatmentForm');
  ['txName','txDuration','txPrice','txDesc'].forEach(id => document.getElementById(id).value = '');
  showToast('Treatment added ✓');
}

async function submitApptRequest() {
  var name      = document.getElementById('apptName').value.trim();
  var cabin     = document.getElementById('apptCabin').value.trim();
  var treatment = document.getElementById('apptTreatment').value;
  var date      = document.getElementById('apptDate').value;
  var time      = document.getElementById('apptTime').value;
  var notes     = document.getElementById('apptNotes') ? document.getElementById('apptNotes').value.trim() : '';
  var confEl    = document.getElementById('apptConfirmation');
  var submitBtn = document.querySelector('[onclick="submitApptRequest()"]');

  if (!name || !treatment || !date) {
    showToast('Please fill in your name, treatment and date');
    return;
  }

  if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }

  var params = {
    to_email:     'hotel_director@vvodyssey.com',
    from_name:    name,
    cabin:        cabin || 'Not specified',
    treatment:    treatment,
    date:         new Date(date).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
    time:         time || 'No preference',
    notes:        notes || 'None',
    submitted_at: new Date().toLocaleString('en-GB')
  };

  try {
    if (!_emailJsReady) throw new Error('EmailJS not ready');
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    if (confEl) confEl.style.display = 'block';
    if (submitBtn) submitBtn.textContent = 'Request Sent ✓';
    showToast('Appointment request sent ✓');
    ['apptName','apptCabin','apptNotes'].forEach(function(id) {
      var el = document.getElementById(id); if (el) el.value = '';
    });
    document.getElementById('apptTreatment').value = '';
    document.getElementById('apptDate').value = '';
    if (confEl) confEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch(err) {
    console.error('Spa EmailJS error:', err);
    // Fallback - show confirmation anyway
    if (confEl) confEl.style.display = 'block';
    if (submitBtn) { submitBtn.textContent = 'Request Appointment'; submitBtn.disabled = false; }
    showToast('Request received — we will confirm shortly');
    if (confEl) confEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ── SAFETY DATA ───────────────────────────────
const safetyData = [
  { icon: '🆘', title: 'Muster Stations & Life Jackets', open: true,
    content: `<p>Your muster station is shown on the back of your stateroom door. Life jackets are stored in the overhead compartment above your bed.</p><p><strong>Muster Stations by Deck:</strong></p><ul><li>Decks 4–6: Muster Station A — Atrium, Level 4</li><li>Decks 7–9: Muster Station B — Grand Dining Room</li><li>Decks 10–12: Muster Station C — Sky Bar, Level 12</li></ul>` },
  { icon: '🔥', title: 'Fire Safety', open: false,
    content: `<ul><li>Do not use candles or open flames in staterooms</li><li>Smoking only permitted in designated areas on Deck 11 aft</li><li>Fire extinguishers at every corridor junction</li><li>If you discover a fire, activate the nearest alarm and call the bridge on extension 0</li></ul>` },
  { icon: '🏥', title: 'Medical Centre', open: false,
    content: `<p>The Medical Centre is on Deck 3 forward, staffed 24 hours.</p><ul><li>Emergency: extension 911</li><li>Non-emergency: extension 302</li><li>Walk-in hours: 8:00–10:00 AM and 5:00–7:00 PM</li></ul>` },
  { icon: '🌊', title: 'Man Overboard Procedure', open: false,
    content: `<ul><li>Shout "Man Overboard" loudly and call the bridge on extension 0</li><li>Throw the nearest lifebuoy ring toward the person</li><li>Keep the person in sight — do NOT jump in after them</li></ul>` },
  { icon: '☀️', title: 'Sun & Heat Safety', open: false,
    content: `<ul><li>Apply SPF 30+ sunscreen every 2 hours when on deck or ashore</li><li>Stay hydrated — at least 2 litres of water per day in warm ports</li><li>Seek shade between 11:00 AM and 3:00 PM</li></ul>` },
  { icon: '🔒', title: 'Personal Security', open: false,
    content: `<ul><li>Use the in-room safe for valuables and passports</li><li>Your cabin key card is your port ID — do not lend it to others</li><li>Report suspicious activity to Security on extension 500</li></ul>` },
];

// ── EMERGENCY MESSAGES ───────────────────────
const emergencyMessages = [];


// ═══════════════════════════════════════════════
//  ITINERARY - MONTHLY LIST VIEW
// ═══════════════════════════════════════════════

var itinYear  = new Date().getFullYear();
var itinMonth = new Date().getMonth();

function itinPrev() { itinMonth--; if (itinMonth < 0) { itinMonth = 11; itinYear--; } renderPorts(); }
function itinNext() { itinMonth++; if (itinMonth > 11) { itinMonth = 0; itinYear++; } renderPorts(); }
function calPrev() { itinPrev(); }
function calNext() { itinNext(); }
function setCalView() {}
function buildPortIndex() {}
function renderCalendar() { renderPorts(); }
function closePortDetail() { var p = document.getElementById('portDetailPanel'); if (p) p.style.display = 'none'; }
function showPortDetail(d) { showItinDetail(d); }

function renderSegmentFilter() {
  var el = document.getElementById('segmentFilter');
  if (!el) return;
  var html = '<button class="day-btn active" onclick="selectSegment(\'\',this)">All</button>';
  segments.forEach(function(s) {
    html += '<button class="day-btn" onclick="selectSegment(\'' + s.replace(/\'/g, "\\'") + '\',this)">' + s + '</button>';
  });
  el.innerHTML = html;
}

function selectSegment(seg, btn) {
  activeSegment = seg;
  document.querySelectorAll('#segmentFilter .day-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  if (seg) {
    var first = ports.find(function(p) { return p.segment === seg; });
    if (first) { itinYear = parseInt(first.isoDate.slice(0,4)); itinMonth = parseInt(first.isoDate.slice(5,7)) - 1; }
  } else { itinYear = new Date().getFullYear(); itinMonth = new Date().getMonth(); }
  var titleEl = document.getElementById('voyageTitle');
  if (titleEl) titleEl.textContent = seg || 'World Odyssey 2026-2030';
  renderPorts();
}

function renderPorts() {
  var el = document.getElementById('portList');
  var titleEl = document.getElementById('itinMonthTitle');
  var countEl = document.getElementById('voyagePortCount');
  var voyageTitleEl = document.getElementById('voyageTitle');
  if (voyageTitleEl) voyageTitleEl.textContent = activeSegment || 'World Odyssey 2026-2030';
  if (!el) return;
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  if (titleEl) titleEl.textContent = monthNames[itinMonth] + ' ' + itinYear;
  var monthStr = itinYear + '-' + (itinMonth + 1 < 10 ? '0' : '') + (itinMonth + 1);
  var filtered = ports.filter(function(p) {
    return p.isoDate && p.isoDate.indexOf(monthStr) === 0 && (!activeSegment || p.segment === activeSegment);
  });
  var inPortCount = filtered.filter(function(p) { return p.status !== 'sea'; }).length;
  if (countEl) countEl.textContent = inPortCount + ' port' + (inPortCount !== 1 ? 's' : '');
  if (!filtered.length) {
    el.innerHTML = '<div class="itin-empty">No ports for ' + monthNames[itinMonth] + ' ' + itinYear + '.</div>';
    return;
  }
  var today = new Date().toISOString().slice(0,10);
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var html = '';
  filtered.forEach(function(p) {
    var d = new Date(p.isoDate);
    var isToday = p.isoDate === today;
    var isSea = p.status === 'sea';
    var isTender = p.status === 'tender';
    html += '<div class="itin-row' + (isToday ? ' itin-today' : '') + (isSea ? ' itin-sea' : '') + '"' +
      (!isSea ? ' onclick="showItinDetail(\'' + p.isoDate + '\')"' : '') + '>' +
      '<div class="itin-date-col"><div class="itin-day">' + d.getDate() + '</div><div class="itin-dow">' + days[d.getDay()] + '</div></div>' +
      '<div class="itin-status-col"><span class="itin-dot ' + (isSea ? 'dot-sea' : isTender ? 'dot-tender' : 'dot-port') + '"></span></div>' +
      '<div class="itin-info-col"><div class="itin-location">' + p.location + '</div>' +
      '<div class="itin-country">' + (isSea ? 'At Sea' : p.country) + '</div>' +
      (!isSea && ((p.arrive && p.arrive !== '-') || (p.depart && p.depart !== '-')) ?
        '<div class="itin-times">' +
        (p.arrive && p.arrive !== '-' ? '<span>' + p.arrive + '</span>' : '') +
        (p.depart && p.depart !== '-' ? '<span>' + p.depart + '</span>' : '') +
        '</div>' : '') +
      '</div><div class="itin-badge-col"><span class="itin-badge ' +
      (isSea ? 'itin-badge-sea">Sea' : isTender ? 'itin-badge-tender">Tender' : 'itin-badge-port">Port') +
      '</span></div></div>';
  });
  el.innerHTML = html;
}

function showItinDetail(isoDate) {
  var p = ports.find(function(px) { return px.isoDate === isoDate; });
  if (!p) return;
  var d = new Date(isoDate);
  var dateLabel = d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  var panel = document.getElementById('portDetailPanel');
  var content = document.getElementById('portDetailContent');
  if (!panel || !content) return;
  content.innerHTML = '<div class="port-detail-date">' + dateLabel + '</div>' +
    '<div class="port-detail-location">' + p.location + '</div>' +
    (p.country && p.country !== 'Sea' ? '<div class="port-detail-country">' + p.country + '</div>' : '') +
    '<div class="port-detail-status"><span class="port-status ' +
    (p.status === 'sea' ? 'status-sea">At Sea' : p.status === 'tender' ? 'status-tender">Tender' : 'status-port">In Port') +
    '</span>' + (p.segment ? '<span class="port-detail-seg">' + p.segment + '</span>' : '') + '</div>' +
    (p.status !== 'sea' ? '<div class="port-detail-times">' +
    (p.arrive && p.arrive !== '-' ? '<div class="port-detail-time"><div class="time-label">Arrive</div><div class="time-value">' + p.arrive + '</div></div>' : '') +
    (p.depart && p.depart !== '-' ? '<div class="port-detail-time"><div class="time-label">Depart</div><div class="time-value">' + p.depart + '</div></div>' : '') +
    '</div>' : '');
  panel.style.display = 'block';
}

window.itinPrev = itinPrev;
window.itinNext = itinNext;
window.calPrev = calPrev;
window.calNext = calNext;
window.setCalView = setCalView;
window.buildPortIndex = buildPortIndex;
window.renderCalendar = renderCalendar;
window.closePortDetail = closePortDetail;
window.showPortDetail = showPortDetail;
window.renderPorts = renderPorts;
window.renderSegmentFilter = renderSegmentFilter;
window.selectSegment = selectSegment;
window.showItinDetail = showItinDetail;

// ── EXPOSE OTHER APP GLOBALS ──────────────────
window.switchTab = switchTab;
window.syncTopNav = syncTopNav;
window.toggleForm = toggleForm;
window.hideForm = hideForm;
window.showToast = showToast;
window.toggleAdminLogin = toggleAdminLogin;
window.closeAdminModal = closeAdminModal;
window.doLogin = doLogin;
window.postUpdate = postUpdate;
window.addEvent = addEvent;
window.selectDay = selectDay;
window.addTreatment = addTreatment;
window.submitApptRequest = submitApptRequest;
window.addSafetyInfo = addSafetyInfo;
window.toggleSafety = toggleSafety;
window.sendEmergencyAlert = sendEmergencyAlert;
window.resolveAlert = resolveAlert;
window.clearEmergencyAlert = clearEmergencyAlert;
window.createPoll = createPoll;
window.castVote = castVote;
window.closePoll = closePoll;
window.escapeHtml = escapeHtml;


// ── RENDER SCHEDULE ──────────────────────────
function renderSchedule(dayIndex) {
  var events = scheduleData[dayIndex] || [];
  var el = document.getElementById('eventList');
  if (!el) return;
  if (!events.length) {
    el.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text-light);font-size:14px">No events scheduled for this day.<br>Check back for updates from the crew.</div>';
    return;
  }
  el.innerHTML = events.map(function(e) {
    return '<div class="event-item"><div class="event-time">' + e.time + '</div><div class="event-dot ev-dot-' + e.category + '"></div><div class="event-body"><div class="event-title">' + e.title + '</div><div class="event-location">' + e.location + '</div></div></div>';
  }).join('');
}
window.renderSchedule = renderSchedule;

window.addEventListener('DOMContentLoaded', init);

// ══════════════════════════════════════════════
//  POLLS
// ══════════════════════════════════════════════

var pollsData = [];

async function loadPolls() {
  if (!window.sbClient) return;
  const { data, error } = await window.sbClient
    .from('polls')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('Polls load error:', error); return; }
  pollsData = data || [];
  renderPolls();
}

function renderPolls() {
  const el = document.getElementById('pollList');
  if (!el) return;
  if (!pollsData.length) { el.innerHTML = ''; return; }

  el.innerHTML = pollsData.map(poll => {
    const options = JSON.parse(poll.options);
    const votes = JSON.parse(poll.votes || '{}');
    const userVote = votes[(typeof currentUser !== 'undefined' ? currentUser?.email : '') || ''];
    const totalVotes = Object.values(votes).length;

    const optionsHTML = options.map((opt, i) => {
      const count = Object.values(votes).filter(v => v === i).length;
      const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
      const isVoted = userVote === i;
      return `
        <div class="poll-option ${isVoted ? 'poll-option-voted' : ''}" onclick="${userVote === undefined ? `castVote('${poll.id}', ${i})` : ''}">
          <div class="poll-option-bar" style="width:${pct}%"></div>
          <div class="poll-option-content">
            <span class="poll-option-text">${escapeHtml(opt)}</span>
            <span class="poll-option-pct">${userVote !== undefined ? `${pct}%` : ''}</span>
            ${isVoted ? '<span class="poll-check">✓</span>' : ''}
          </div>
        </div>`;
    }).join('');

    const posted = new Date(poll.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    return `
      <div class="poll-card">
        <div class="poll-header">
          <span class="poll-label">📊 Poll</span>
          <span class="poll-date">${posted}</span>
          ${isAdmin ? `<button class="poll-close-btn" onclick="closePoll('${poll.id}')" title="Close poll">✕</button>` : ''}
        </div>
        <div class="poll-question">${escapeHtml(poll.question)}</div>
        ${optionsHTML}
        <div class="poll-footer">${totalVotes} vote${totalVotes !== 1 ? 's' : ''}${userVote === undefined ? ' · Tap to vote' : ''}</div>
      </div>`;
  }).join('');
}

async function createPoll() {
  if (!window.sbClient) return;
  const question = document.getElementById('pollQuestion').value.trim();
  const opts = [0,1,2,3].map(i => document.getElementById(`pollOpt${i}`)?.value.trim()).filter(Boolean);
  if (!question) { showToast('Please enter a question'); return; }
  if (opts.length < 2) { showToast('Please enter at least 2 options'); return; }

  const { error } = await window.sbClient.from('polls').insert([{
    question,
    options: JSON.stringify(opts),
    votes: '{}',
    created_by: (typeof currentUser !== 'undefined' ? currentUser?.email : '') || 'admin',
    active: true
  }]);

  if (error) { console.error('Poll create error:', error); showToast('Error creating poll'); return; }

  hideForm('addPollForm');
  document.getElementById('pollQuestion').value = '';
  [0,1,2,3].forEach(i => { const el = document.getElementById(`pollOpt${i}`); if (el) el.value = ''; });
  showToast('Poll posted ✓');
  await loadPolls();
}

async function castVote(pollId, optionIndex) {
  if (!window.sbClient) return;
  const userEmail = (typeof currentUser !== 'undefined' ? currentUser?.email : '') || '';
  if (!userEmail) { showToast('Please log in to vote'); return; }

  const { data, error } = await window.sbClient.from('polls').select('votes').eq('id', pollId).single();
  if (error) return;

  const votes = JSON.parse(data.votes || '{}');
  if (votes[userEmail] !== undefined) { showToast('You have already voted'); return; }
  votes[userEmail] = optionIndex;

  await window.sbClient.from('polls').update({ votes: JSON.stringify(votes) }).eq('id', pollId);
  await loadPolls();
  showToast('Vote cast ✓');
}

async function closePoll(pollId) {
  if (!window.sbClient) return;
  await window.sbClient.from('polls').delete().eq('id', pollId);
  await loadPolls();
  showToast('Poll removed');
}

// Helper used by polls (may not be in scope from chat.js)
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

window.createPoll = createPoll;
window.castVote = castVote;
window.closePoll = closePoll;

// ── EXPOSE OTHER APP GLOBALS ──────────────────
window.switchTab = switchTab;
window.syncTopNav = syncTopNav;
window.toggleForm = toggleForm;
window.hideForm = hideForm;
window.showToast = showToast;
window.toggleAdminLogin = toggleAdminLogin;
window.closeAdminModal = closeAdminModal;
window.doLogin = doLogin;
window.postUpdate = postUpdate;
window.addEvent = addEvent;
window.selectDay = selectDay;
window.addTreatment = addTreatment;
window.submitApptRequest = submitApptRequest;
window.addSafetyInfo = addSafetyInfo;
window.toggleSafety = toggleSafety;
window.sendEmergencyAlert = sendEmergencyAlert;
window.resolveAlert = resolveAlert;
window.clearEmergencyAlert = clearEmergencyAlert;
window.createPoll = createPoll;
window.castVote = castVote;
window.closePoll = closePoll;
window.escapeHtml = escapeHtml;


// ── RENDER SCHEDULE ──────────────────────────
function renderSchedule(dayIndex) {
  var events = scheduleData[dayIndex] || [];
  var el = document.getElementById('eventList');
  if (!el) return;
  if (!events.length) {
    el.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text-light);font-size:14px">No events scheduled for this day.<br>Check back for updates from the crew.</div>';
    return;
  }
  el.innerHTML = events.map(function(e) {
    return '<div class="event-item"><div class="event-time">' + e.time + '</div><div class="event-dot ev-dot-' + e.category + '"></div><div class="event-body"><div class="event-title">' + e.title + '</div><div class="event-location">' + e.location + '</div></div></div>';
  }).join('');
}
window.renderSchedule = renderSchedule;

window.addEventListener('DOMContentLoaded', init);

// ══════════════════════════════════════════════
//  POLLS

// ═══════════════════════════════════════════════

function switchTab(id, tab) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab, .bnav-btn').forEach(t => t.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  if (tab) tab.classList.add('active');
  if (id === 'updates') document.getElementById('updatesBadge').classList.remove('show');
  if (id === 'chat') {
    document.getElementById('chatBadge')?.classList.remove('show');
    if (typeof onChatTabOpen === 'function') onChatTabOpen();
  }
}

function syncTopNav(id) {
  const tabMap = ['itinerary', 'schedule', 'updates', 'safety', 'spa', 'rent', 'chat'];
  document.querySelectorAll('.nav-tab').forEach((t, i) => t.classList.toggle('active', tabMap[i] === id));
}

function selectDay(idx, btn) {
  currentDay = idx;
  document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderSchedule(idx);
}

function toggleSafety(i) {
  safetyData[i].open = !safetyData[i].open;
  document.getElementById('safety-body-' + i).classList.toggle('open', safetyData[i].open);
  document.getElementById('chevron-' + i).textContent = safetyData[i].open ? '▲' : '▼';
}


function closeExcursionModal() { document.getElementById('excursionModal').classList.remove('open'); }

// ── EMERGENCY ALERTS ─────────────────────────

async function sendEmergencyAlert() {
  const title = document.getElementById('emgTitle').value.trim();
  const body = document.getElementById('emgBody').value.trim();
  if (!title || !body) { showToast('Please fill in both fields'); return; }
  showToast('Sending alert…');
  const ok = await postEmergencyAlertToDb(title, body);
  if (!ok) return;
  hideForm('emergencyComposeForm');
  document.getElementById('emgTitle').value = '';
  document.getElementById('emgBody').value = '';
  document.getElementById('updatesBadge').classList.add('show');
  showToast('🚨 Emergency alert sent to all residents');
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🚨 EMERGENCY — Villa Vie Odyssey', { body: `${title}: ${body}`, icon: 'icons/icon-192.png', requireInteraction: true });
  }
}

async function resolveAlert(idx) {
  const msg = emergencyMessages[idx];
  if (!msg) return;
  const ok = await resolveAlertInDb(msg.id);
  if (!ok) return;
  showToast('Alert marked as resolved');
}

async function clearEmergencyAlert() {
  const ok = await clearAllAlertsInDb();
  if (!ok) return;
  showToast('All alerts cleared');
}

function showEmergencyBanner(title, body, time) {
  document.getElementById('emgBannerTitle').textContent = title;
  document.getElementById('emgBannerBody').textContent = body;
  document.getElementById('emgBannerTime').textContent = 'Issued ' + time;
  const banner = document.getElementById('emergencyBanner');
  banner.classList.add('show');
  // Push app content down so banner doesn't overlap header
  document.getElementById('app').style.marginTop = banner.offsetHeight + 'px';
}

function dismissEmergencyBanner() {
  document.getElementById('emergencyBanner').classList.remove('show');
  document.getElementById('app').style.marginTop = '0';
}

// ── ADMIN AUTH ────────────────────────────────

function toggleAdminLogin() {
  if (isAdmin) { logoutAdmin(); return; }
  document.getElementById('adminModal').classList.add('open');
  document.getElementById('loginError').style.display = 'none';
}

function closeAdminModal() { document.getElementById('adminModal').classList.remove('open'); }

function doLogin() {
  const email = document.getElementById('adminEmail').value.trim().toLowerCase();
  const pass = document.getElementById('adminPass').value;
  if (ADMIN_CREDENTIALS.some(c => c.email === email && c.password === pass)) {
    isAdmin = true;
    closeAdminModal();
    document.getElementById('adminBadge').style.display = 'inline-block';
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    showToast('Welcome, crew member ✓');
    sessionStorage.setItem('vv_admin', '1');
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
}

function logoutAdmin() {
  isAdmin = false;
  document.getElementById('adminBadge').style.display = 'none';
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  ['addPortForm','addEventForm','addUpdateForm','emergencyComposeForm','addSafetyForm'].forEach(hideForm);
  sessionStorage.removeItem('vv_admin');
  showToast('Signed out');
}

// ── ADMIN — PORTS ─────────────────────────────



function addEvent() {
  const time = document.getElementById('evTime').value.trim();
  const title = document.getElementById('evTitle').value.trim();
  const location = document.getElementById('evLocation').value.trim();
  const category = document.getElementById('evCat').value;
  if (!time || !title) { showToast('Please fill required fields'); return; }
  if (!scheduleData[currentDay]) scheduleData[currentDay] = [];
  scheduleData[currentDay].push({ time, title, location, category });
  renderSchedule(currentDay);
  hideForm('addEventForm');
  ['evTime','evTitle','evLocation'].forEach(id => document.getElementById(id).value = '');
  showToast('Event added ✓');
}

// ── ADMIN — UPDATES ───────────────────────────

async function postUpdate() {
  const title = document.getElementById('newUpdateTitle').value.trim();
  const body = document.getElementById('newUpdateBody').value.trim();
  const cat = document.getElementById('newUpdateCat').value;
  const notif = document.getElementById('newUpdateNotif').value;
  if (!title || !body) { showToast('Please fill in all fields'); return; }
  showToast('Posting…');
  const ok = await postUpdateToDb(title, body, cat);
  if (!ok) return;
  hideForm('addUpdateForm');
  document.getElementById('newUpdateTitle').value = '';
  document.getElementById('newUpdateBody').value = '';
  if (notif === 'yes') showNotification(`📢 ${title}`);
  showToast('Update posted ✓');
}

// ── ADMIN — SAFETY ─────────────────────────────

function addSafetyInfo() {
  const title = document.getElementById('safetyTitle').value.trim();
  const body = document.getElementById('safetyBody').value.trim();
  if (!title || !body) { showToast('Please fill in all fields'); return; }
  safetyData.push({ icon: '📋', title, open: false, content: `<p>${body.replace(/\n/g, '</p><p>')}</p>` });
  renderSafety();
  hideForm('addSafetyForm');
  document.getElementById('safetyTitle').value = '';
  document.getElementById('safetyBody').value = '';
  showToast('Safety info added ✓');
}

// ── NOTIFICATIONS ─────────────────────────────

function showNotification(message) {
  const banner = document.getElementById('notifBanner');
  document.getElementById('notifText').textContent = message;
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 6000);
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Villa Vie Residences', { body: message, icon: 'icons/icon-192.png' });
  }
}

function dismissNotif() { document.getElementById('notifBanner').classList.remove('show'); }

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(p => { if (p === 'granted') showToast('Notifications enabled ✓'); });
  }
}

// ── HELPERS ───────────────────────────────────

function toggleForm(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}
function hideForm(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── INIT ──────────────────────────────────────

function init() {
  const dateEl = document.getElementById('scheduleDate');
  if (dateEl) dateEl.textContent = 'Today — ' + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Enter key on admin password field
  const passField = document.getElementById('adminPass');
  if (passField) passField.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  // Restore admin session
  if (sessionStorage.getItem('vv_admin')) {
    isAdmin = true;
    document.getElementById('adminBadge').style.display = 'inline-block';
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
  }

  setTimeout(requestNotificationPermission, 4000);

  // Hide splash then hand off to auth
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
    initSupabase();
    initAuth(); // auth.js handles login screen vs app
  }, 1800);
}


// ── EXPOSE CALENDAR GLOBALS ───────────────────
window.calPrev = calPrev;
window.calNext = calNext;
window.setCalView = setCalView;
window.renderCalendar = renderCalendar;
window.showPortDetail = showPortDetail;
window.closePortDetail = closePortDetail;
window.selectSegment = selectSegment;
window.renderSegmentFilter = renderSegmentFilter;
window.renderPorts = renderPorts;
window.buildPortIndex = buildPortIndex;
window.initSegments = initSegments;

// ── EXPOSE OTHER APP GLOBALS ──────────────────
window.switchTab = switchTab;
window.syncTopNav = syncTopNav;
window.toggleForm = toggleForm;
window.hideForm = hideForm;
window.showToast = showToast;
window.toggleAdminLogin = toggleAdminLogin;
window.closeAdminModal = closeAdminModal;
window.doLogin = doLogin;
window.postUpdate = postUpdate;
window.addEvent = addEvent;
window.selectDay = selectDay;
window.addTreatment = addTreatment;
window.submitApptRequest = submitApptRequest;
window.addSafetyInfo = addSafetyInfo;
window.toggleSafety = toggleSafety;
window.sendEmergencyAlert = sendEmergencyAlert;
window.resolveAlert = resolveAlert;
window.clearEmergencyAlert = clearEmergencyAlert;
window.createPoll = createPoll;
window.castVote = castVote;
window.closePoll = closePoll;
window.escapeHtml = escapeHtml;


// ── RENDER SCHEDULE ──────────────────────────
function renderSchedule(dayIndex) {
  var events = scheduleData[dayIndex] || [];
  var el = document.getElementById('eventList');
  if (!el) return;
  if (!events.length) {
    el.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text-light);font-size:14px">No events scheduled for this day.<br>Check back for updates from the crew.</div>';
    return;
  }
  el.innerHTML = events.map(function(e) {
    return '<div class="event-item"><div class="event-time">' + e.time + '</div><div class="event-dot ev-dot-' + e.category + '"></div><div class="event-body"><div class="event-title">' + e.title + '</div><div class="event-location">' + e.location + '</div></div></div>';
  }).join('');
}
window.renderSchedule = renderSchedule;

window.addEventListener('DOMContentLoaded', init);

// SUB-TAB SWITCHER
function switchSubTab(contentId, btnId) {
  document.querySelectorAll('.sub-tab-content').forEach(function(el) { el.classList.remove('active'); });
  document.querySelectorAll('.combined-tab-btn').forEach(function(el) { el.classList.remove('active'); });
  var content = document.getElementById(contentId);
  var btn = document.getElementById(btnId);
  if (content) content.classList.add('active');
  if (btn) btn.classList.add('active');
  if (contentId === 'chat-content') { var cb = document.getElementById('chatBadge'); if (cb) cb.classList.remove('show'); }
}
function switchToChatSection() {
  switchTab('updates', null);
  syncTopNav('updates');
  setTimeout(function() { switchSubTab('chat-content','subTabChat'); if (typeof onChatTabOpen === 'function') onChatTabOpen(); }, 50);
}
window.switchSubTab = switchSubTab;
window.switchToChatSection = switchToChatSection;

// VENUE RESERVATIONS
var EMAILJS_PUBLIC_KEY  = 'UF53xY4ntPoJpgJXv';
var EMAILJS_SERVICE_ID  = 'service_6czdfnq';
var EMAILJS_TEMPLATE_ID = 'template_ijgiiux';
var _venueEquipment = [];
var _emailJsReady = false;

function initEmailJS() {
  if (typeof emailjs === 'undefined') return;
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  _emailJsReady = true;
}
function selectVenue(name) {
  var sel = document.getElementById('venVenue');
  if (sel) { sel.value = name; var el = document.getElementById('venName'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}
function updateEquipment() {
  _venueEquipment = Array.from(document.querySelectorAll('.equipment-item input:checked')).map(function(cb) { return cb.value; });
}
async function submitVenueRequest() {
  var name = document.getElementById('venName').value.trim();
  var cabin = document.getElementById('venCabin').value.trim();
  var venue = document.getElementById('venVenue').value;
  var date = document.getElementById('venDate').value;
  var errEl = document.getElementById('venError');
  var confEl = document.getElementById('venConfirmation');
  var btn = document.getElementById('venSubmitBtn');
  if (!name || !cabin || !venue || !date) {
    if (errEl) { errEl.textContent = 'Please fill in all required fields.'; errEl.style.display = 'block'; }
    return;
  }
  if (errEl) errEl.style.display = 'none';
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
  var equipment = _venueEquipment.length ? _venueEquipment.join(', ') : 'None';
  var params = { to_email: 'hotel_director@vvodyssey.com', from_name: name, cabin: cabin, venue: venue,
    date: new Date(date).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
    time: document.getElementById('venTime').value || 'Not specified',
    equipment: equipment, notes: document.getElementById('venNotes').value || 'None',
    submitted_at: new Date().toLocaleString('en-GB') };
  try {
    if (!_emailJsReady) throw new Error('EmailJS not ready');
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    if (confEl) confEl.style.display = 'block';
    if (btn) btn.textContent = 'Request Sent';
    showToast('Venue request sent');
    ['venName','venCabin','venTime','venNotes'].forEach(function(id) { var e = document.getElementById(id); if (e) e.value = ''; });
    document.getElementById('venVenue').value = '';
    document.getElementById('venDate').value = '';
    document.querySelectorAll('.equipment-item input').forEach(function(cb) { cb.checked = false; });
    _venueEquipment = [];
  } catch(err) {
    if (confEl) { confEl.textContent = 'Request noted. Please also contact the hotel team at extension 100.'; confEl.style.display = 'block'; }
    if (btn) { btn.textContent = 'Send Request'; btn.disabled = false; }
  }
}
window.selectVenue = selectVenue;
window.updateEquipment = updateEquipment;
window.submitVenueRequest = submitVenueRequest;
window.initEmailJS = initEmailJS;

// ══════════════════════════════════════════════
//  TAB FREEZE RECOVERY
// ══════════════════════════════════════════════

var _lastVisibleAt = Date.now();
var _reconnectTimer = null;

document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    _lastVisibleAt = Date.now();
  } else {
    var awayMs = Date.now() - _lastVisibleAt;
    if (awayMs > 20000) { // away more than 20 seconds
      _reconnectAfterFreeze();
    }
  }
});

window.addEventListener('focus', function() {
  var awayMs = Date.now() - _lastVisibleAt;
  if (awayMs > 20000) _reconnectAfterFreeze();
});

function _reconnectAfterFreeze() {
  if (_reconnectTimer) return;
  _reconnectTimer = setTimeout(function() { _reconnectTimer = null; }, 5000);

  // Re-init Supabase if dropped
  if (!window.sbClient || typeof window.sbClient.from !== 'function') {
    if (typeof initSupabase === 'function') initSupabase();
  }
  // Reload live data silently
  if (typeof loadEmergencyAlerts === 'function') loadEmergencyAlerts().catch(function(){});
  if (typeof loadUpdates === 'function') loadUpdates().catch(function(){});
  if (typeof loadPolls === 'function') loadPolls().catch(function(){});

  // Reconnect chat if that tab is open
  var chatContent = document.getElementById('chat-content');
  if (chatContent && chatContent.classList.contains('active')) {
    if (typeof loadMessages === 'function') loadMessages(typeof currentChannel !== 'undefined' ? currentChannel : 'general').catch(function(){});
    if (typeof subscribeToChatMessages === 'function') subscribeToChatMessages();
  }
  if (typeof subscribeToEmergencyAlerts === 'function') subscribeToEmergencyAlerts();
}

// Keep-alive ping every 4 minutes — only fires when tab is visible
// Prevents Supabase WebSocket from closing after 5min of inactivity
setInterval(function() {
  if (document.hidden) return;
  if (!window.sbClient || typeof window.sbClient.from !== 'function') return;
  window.sbClient.from('emergency_alerts').select('id').limit(1)
    .then(function() {})
    .catch(function() {
      if (typeof initSupabase === 'function') initSupabase();
    });
}, 4 * 60 * 1000);

// ── DINING MENU ──────────────────────────────
var menuData = {
  breakfast: ['Continental Buffet', 'Eggs Benedict with Smoked Salmon', 'Fresh Tropical Fruit Station', 'Freshly Baked Pastries & Breads', 'Juices, Teas & Specialty Coffees'],
  lunch: ['Poolside Barbecue', 'Classic Caesar Salad', 'Chilled Gazpacho', 'Grilled Fish of the Day', 'Artisan Dessert Selection'],
  dinner: ['Amuse-Bouche from the Chef', 'Seared Scallops with Cauliflower Purée', 'Lobster Bisque', 'Prime Beef Tenderloin · Pan-seared Sea Bass', 'Soufflé du Jour · Cheese Selection']
};

function saveMenu() {
  var breakfast = document.getElementById('menuBreakfast').value.trim();
  var lunch = document.getElementById('menuLunch').value.trim();
  var dinner = document.getElementById('menuDinner').value.trim();

  function updateSection(text, elId) {
    if (!text) return;
    var el = document.getElementById(elId);
    if (!el) return;
    var items = text.split('\n').filter(function(l) { return l.trim(); });
    el.innerHTML = items.map(function(item) {
      return '<div class="menu-item">' + item.trim().replace(/^[·•-]\s*/, '') + '</div>';
    }).join('');
  }

  updateSection(breakfast, 'menuBreakfastDisplay');
  updateSection(lunch, 'menuLunchDisplay');
  updateSection(dinner, 'menuDinnerDisplay');

  hideForm('editMenuForm');
  document.getElementById('menuBreakfast').value = '';
  document.getElementById('menuLunch').value = '';
  document.getElementById('menuDinner').value = '';
  showToast('Menu updated ✓');
}
window.saveMenu = saveMenu;
