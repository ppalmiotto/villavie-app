// ══════════════════════════════════════════════
//  VILLA VIE RESIDENCES -- app.js
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
    { time: '24 hrs', title: 'Library Open -- Book & DVD Borrowing', location: 'Library, Deck 5 Mid', category: 'activity' },
    { time: '7:00 AM', title: 'Library Quiet Time', location: 'Library, Deck 5 Mid', category: 'activity' },
    { time: '8:00 AM', title: 'Introduction to Resistance Stretching with Sally', location: 'Fitness Center, Deck 7 Aft', category: 'wellness' },
    { time: '9:00 AM', title: 'Ring Toss & Ladderball Open Play', location: 'Morning Light, Deck 5 Mid', category: 'activity' },
    { time: '9:00 AM', title: 'Pickleball Open Play', location: 'Open Deck, Deck 8 Mid', category: 'activity' },
    { time: '9:00 AM', title: 'Table Tennis Open Play', location: 'Open Deck, Deck 8 Mid', category: 'activity' },
    { time: '9:00 AM', title: 'Bean Bag Toss Open Play', location: 'Open Deck, Deck 8 Mid', category: 'activity' },
    { time: '9:00 AM', title: 'Shuffleboard Open Play', location: 'Open Deck, Deck 5 Fwd', category: 'activity' },
    { time: '10:00 AM', title: 'Morning Trivia with Big Mac', location: 'Morning Light, Deck 5 Fwd', category: 'entertainment' },
    { time: '10:00 AM', title: 'Beginners Line Dance with Kathie', location: 'Neptune Lounge, Deck 5 Fwd', category: 'entertainment' },
    { time: '10:00 AM', title: 'Library Open for Games', location: 'Library, Deck 5 Mid', category: 'activity' },
    { time: '11:00 AM', title: 'Couch Talk with Big Mac', location: 'Morning Light, Deck 5 Fwd', category: 'activity' },
    { time: '11:15 AM', title: 'Bodygroove', location: 'Neptune Lounge, Deck 5 Fwd', category: 'wellness' },
    { time: '1:30 PM', title: 'Choir and Choral', location: 'Observatory, Deck 8 Fwd', category: 'entertainment' },
    { time: '2:00 PM', title: 'Experienced Line Dance with Kathie', location: 'Neptune Lounge, Deck 5 Fwd', category: 'entertainment' },
    { time: '2:00 PM', title: 'Werewolf Event (Max 35 players)', location: 'Library, Deck 5 Mid', category: 'entertainment' },
    { time: '4:00 PM', title: 'Goddess Dance Class with Amira Mor', location: 'Dance Studio, Deck 3 Mid', category: 'wellness' },
    { time: '5:00 PM', title: 'Afternoon Trivia with Big Mac', location: 'Morning Light, Deck 5 Fwd', category: 'entertainment' },
    { time: '8:30 PM', title: "Aliona's 17th Birthday Party -- Western Theme!", location: 'Neptune Lounge, Deck 5 Fwd', category: 'entertainment' },
    { time: '8:30 PM', title: "Speakers Corner: How the Odyssey Community Began", location: 'Coral Club, Deck 5 Aft', category: 'entertainment' },
  ],
  1: [
    { time: '24 hrs', title: 'Library Open -- Book & DVD Borrowing', location: 'Library, Deck 5 Mid', category: 'activity' },
    { time: '7:00 AM', title: 'Library Quiet Time', location: 'Library, Deck 5 Mid', category: 'activity' },
    { time: '8:00 AM', title: 'Introduction to Resistance Stretching with Sally', location: 'Fitness Center, Deck 7 Aft', category: 'wellness' },
    { time: '9:00 AM', title: 'Ring Toss & Ladderball Open Play', location: 'Morning Light, Deck 5 Mid', category: 'activity' },
    { time: '9:00 AM', title: 'Pickleball Open Play', location: 'Open Deck, Deck 8 Mid', category: 'activity' },
    { time: '9:00 AM', title: 'Table Tennis Open Play', location: 'Open Deck, Deck 8 Mid', category: 'activity' },
    { time: '9:00 AM', title: 'Bean Bag Toss Open Play', location: 'Open Deck, Deck 8 Mid', category: 'activity' },
    { time: '9:00 AM', title: 'Shuffleboard Open Play', location: 'Open Deck, Deck 5 Fwd', category: 'activity' },
    { time: '10:00 AM', title: 'Beginners Line Dance with Kathie', location: 'Neptune Lounge, Deck 5 Fwd', category: 'entertainment' },
    { time: '10:00 AM', title: 'Introduction to Bridge -- Learn by playing with Kevin!', location: 'Grampian, Deck 8 Aft', category: 'activity' },
    { time: '10:00 AM', title: 'Morning Trivia with Big Mac', location: 'Morning Light, Deck 5 Fwd', category: 'entertainment' },
    { time: '10:00 AM', title: 'Library Open for Games', location: 'Library, Deck 5 Mid', category: 'activity' },
    { time: '11:00 AM', title: 'Couch Talk with Big Mac', location: 'Morning Light, Deck 5 Fwd', category: 'activity' },
    { time: '11:15 AM', title: 'Bodygroove', location: 'Neptune Lounge, Deck 5 Fwd', category: 'wellness' },
    { time: '1:30 PM', title: 'Voices of Odyssey -- Choir Singing', location: 'Observatory, Deck 8 Fwd', category: 'entertainment' },
    { time: '2:00 PM', title: 'Experienced Line Dance with Kathie', location: 'Neptune Lounge, Deck 5 Fwd', category: 'entertainment' },
    { time: '2:00 PM', title: 'Werewolf Event (Max 35 players)', location: 'Library, Deck 5 Mid', category: 'entertainment' },
    { time: '3:00 PM', title: 'Matinee Movie: Kate & Leopold', location: 'Neptune Lounge, Deck 5 Fwd', category: 'entertainment' },
    { time: '4:00 PM', title: 'Goddess Dance Class with Amira Mor', location: 'Dance Studio, Deck 3 Mid', category: 'wellness' },
    { time: '5:00 PM', title: 'Afternoon Trivia with Big Mac', location: 'Morning Light, Deck 5 Fwd', category: 'entertainment' },
    { time: '8:30 PM', title: 'Voli 305 Vodka -- Rock & Roll Night', location: 'Coral Club, Deck 5 Aft', category: 'entertainment' },
  ],
  2: [
    { time: '06:00 AM', title: 'Early Shore Call', location: 'Gangway, Level 3', category: 'port' },
    { time: '07:00 AM', title: 'Breakfast Service Opens', location: 'The Grand Dining Room', category: 'dining' },
    { time: '01:30 PM', title: 'Light Lunch -- Open Seating', location: 'Lido Restaurant', category: 'dining' },
    { time: '07:30 PM', title: 'Gala Dinner', location: 'The Grand Dining Room', category: 'dining' },
    { time: '10:00 PM', title: 'DJ Set', location: 'Coral Club, Deck 5', category: 'entertainment' },
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
  { name: 'Shampoo & Style', category: 'salon', icon: '💇', duration: '--', price: '$40', desc: 'Professional shampoo and blow dry styling by our in-house hair team.' },
  { name: 'Cut', category: 'salon', icon: '✂️', duration: '--', price: '$32', desc: 'Precision haircut by our experienced stylists.' },
  { name: 'Color', category: 'salon', icon: '🎨', duration: '--', price: '$52', desc: 'Full hair colour service using professional products.' },
  { name: 'Gloss', category: 'salon', icon: '✨', duration: '--', price: '$39', desc: 'A glossing treatment to add shine and vibrancy to your hair.' },
  { name: 'Color & Lightning', category: 'salon', icon: '⚡', duration: '--', price: '$72', desc: 'Combined colour and lightening service for a multi-dimensional look.' },
  { name: 'Contrasts', category: 'salon', icon: '🖤', duration: '--', price: '$84', desc: 'Bold contrast colour techniques for a striking finish.' },
  { name: 'Highlight', category: 'salon', icon: '🌟', duration: '--', price: '$72', desc: 'Expert highlighting to add dimension and brightness.' },
  { name: 'Hairstyling', category: 'salon', icon: '💫', duration: '--', price: '$39', desc: 'Professional styling for any occasion -- from casual to formal.' },
  { name: 'Rituals Add-On (AVEDA)', category: 'salon', icon: '🌱', duration: '--', price: '$19', desc: 'AVEDA Shampoo, Mask and Texturizer/Thermique add-on.' },
  { name: 'AVEDA Shampoo', category: 'salon', icon: '🌱', duration: '--', price: '$7', desc: 'Premium AVEDA shampoo treatment.' },
  { name: 'AVEDA Mask', category: 'salon', icon: '🌱', duration: '--', price: '$7', desc: 'Nourishing AVEDA hair mask treatment.' },
  { name: 'Flat Iron Straightener', category: 'salon', icon: '💈', duration: '--', price: '$12', desc: 'Professional flat iron straightening service.' },
  { name: 'Extension Fee', category: 'salon', icon: '💇', duration: '--', price: '$13', desc: 'Additional fee applicable for hair extensions.' },

  // BEAUTY
  { name: 'Half / Full Legs Wax', category: 'beauty', icon: '🦵', duration: '--', price: '$45', desc: 'Professional waxing for half or full legs.' },
  { name: 'Underarms Wax', category: 'beauty', icon: '💪', duration: '--', price: '$20', desc: 'Underarm waxing for smooth, clean results.' },
  { name: 'Lower Arms Wax', category: 'beauty', icon: '🤲', duration: '--', price: '$25', desc: 'Professional lower arm waxing.' },
  { name: 'Full Arms Wax', category: 'beauty', icon: '🤲', duration: '--', price: '$40', desc: 'Full arm waxing for smooth results.' },
  { name: 'Lip / Chin or Eyebrows Wax', category: 'beauty', icon: '🧖', duration: '--', price: '$15', desc: 'Precise facial waxing for lip, chin or eyebrow shaping.' },
  { name: 'Bikini Line Wax', category: 'beauty', icon: '🌸', duration: '--', price: '$25', desc: 'Professional bikini line waxing.' },
  { name: 'Spa Manicure', category: 'beauty', icon: '💅', duration: '60 min', price: '$65', desc: 'A relaxing spa manicure with full nail care and polish.' },
  { name: 'Express Manicure', category: 'beauty', icon: '💅', duration: '25 min', price: '$30', desc: 'A quick yet thorough manicure for beautiful nails.' },
  { name: 'Spa Pedicure', category: 'beauty', icon: '🦶', duration: '60 min', price: '$85', desc: 'A luxurious spa pedicure with full foot care and polish.' },
  { name: 'Express Pedicure', category: 'beauty', icon: '🦶', duration: '30 min', price: '$40', desc: 'A quick yet thorough pedicure.' },
  { name: 'Nail Reconstruction', category: 'beauty', icon: '✨', duration: '--', price: '$115', desc: 'Full nail reconstruction service.' },
  { name: 'Reconstruction or Repair Single Nail', category: 'beauty', icon: '💅', duration: '--', price: '$18', desc: 'Single nail reconstruction or repair.' },
  { name: 'Gel Overlay on Natural Nails', category: 'beauty', icon: '💅', duration: '--', price: '$59', desc: 'Gel overlay applied over natural nails for a long-lasting finish.' },
  { name: 'Semi Permanent Nail Polish', category: 'beauty', icon: '💅', duration: '--', price: '$10', desc: 'Semi-permanent nail polish add-on.' },
  { name: 'French Nails', category: 'beauty', icon: '💅', duration: '--', price: '$15', desc: 'Classic French nail finish add-on.' },
  { name: 'Makeup', category: 'beauty', icon: '💄', duration: '--', price: 'from $39', desc: 'Professional makeup application for any occasion.' },
];

const catIcons = { massage: '💆', facial: '✨', ritual: '🌿', enhancement: '⭐', salon: '💇', beauty: '💅' };
const catLabels = { massage: 'Massage', facial: 'Facials', ritual: 'Rituals', enhancement: 'Enhancements', salon: 'Hair Salon', beauty: 'Beauty' };

function renderSpaMenu() {
  var el = document.getElementById('spaMenuList');
  if (!el) return;

  // Group by category
  var grouped = {};
  spaMenu.forEach(function(t) {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  var html = '';
  Object.keys(grouped).forEach(function(cat) {
    html += '<div class="spa-category-label">' + (catLabels[cat] || cat) + '</div>';
    grouped[cat].forEach(function(t) {
      var safeName = t.name.replace(/'/g, "\\'");
      html += '<div class="spa-treatment-card">' +
        '<div class="spa-treatment-icon">' + t.icon + '</div>' +
        '<div class="spa-treatment-body">' +
          '<div class="spa-treatment-name">' + t.name + '</div>' +
          '<div class="spa-treatment-desc">' + t.desc + '</div>' +
          '<div class="spa-treatment-meta">' +
            '<span class="spa-tag">⏱ ' + t.duration + '</span>' +
            '<span class="spa-tag spa-tag-price">' + t.price + '</span>' +
          '</div>' +
        '</div>' +
        '<button class="spa-add-btn" data-name="' + t.name + '" data-duration="' + t.duration + '" data-price="' + t.price + '" onclick="handleSpaAdd(this)">+ Add</button>' +
      '</div>';
    });
  });
  el.innerHTML = html;
  updateSpaCartUI();
}

// ── SPA CART ─────────────────────────────────
var spaCart = [];

function handleSpaAdd(btn) {
  var name = btn.getAttribute('data-name');
  var duration = btn.getAttribute('data-duration');
  var price = btn.getAttribute('data-price');
  var existing = spaCart.findIndex(function(i) { return i.name === name; });
  if (existing >= 0) {
    showToast(name + ' already in your selection');
    return;
  }
  spaCart.push({ name: name, duration: duration, price: price });
  btn.textContent = 'Added';
  btn.disabled = true;
  btn.style.opacity = '0.5';
  updateSpaCartUI();
  showToast(name + ' added to selection');
}

function updateSpaCartUI() {
  var countEl = document.getElementById('spaCartCount');
  var cartEl = document.getElementById('spaCart');
  var itemsEl = document.getElementById('spaCartItems');
  var apptList = document.getElementById('apptTreatmentList');

  var count = spaCart.length;
  if (countEl) countEl.textContent = count;
  if (cartEl) cartEl.style.display = count > 0 ? 'flex' : 'none';

  if (itemsEl) {
    if (count === 0) {
      itemsEl.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-light)">No treatments selected yet</div>';
    } else {
      itemsEl.innerHTML = spaCart.map(function(item, idx) {
        return '<div class="spa-cart-item" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">' +
          '<div><div style="font-weight:600">' + item.name + '</div>' +
          '<div style="font-size:12px;color:var(--text-light)">' + item.duration + ' &bull; ' + item.price + '</div></div>' +
          '<button onclick="spaRemoveClick(' + idx + ')" style="background:none;border:none;color:var(--text-light);font-size:18px;cursor:pointer;padding:4px 8px">&times;</button>' +
          '</div>';
      }).join('');
    }
  }

  if (apptList) {
    if (count === 0) {
      apptList.innerHTML = '<div style="color:var(--text-light);font-size:13px">No treatments selected</div>';
    } else {
      apptList.innerHTML = spaCart.map(function(item) {
        return '<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:14px">' + item.name + ' &mdash; ' + item.duration + '</div>';
      }).join('');
    }
  }
}

function spaRemoveClick(idx) {
  var removed = spaCart.splice(idx, 1)[0];
  // Re-enable the Add button for this treatment
  document.querySelectorAll('.spa-add-btn').forEach(function(btn) {
    if (btn.getAttribute('data-name') === removed.name) {
      btn.textContent = '+ Add';
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  });
  updateSpaCartUI();
  if (spaCart.length === 0) closeSpaCart();
}

function openSpaCart() {
  var panel = document.getElementById('spaCartPanel');
  if (panel) panel.style.display = 'block';
  updateSpaCartUI();
}

function closeSpaCart() {
  var panel = document.getElementById('spaCartPanel');
  if (panel) panel.style.display = 'none';
}

function proceedToBook() {
  closeSpaCart();
  var apptSection = document.getElementById('spaApptSection');
  if (apptSection) apptSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateSpaCartUI();
}

window.handleSpaAdd = handleSpaAdd;
window.updateSpaCartUI = updateSpaCartUI;
window.spaRemoveClick = spaRemoveClick;
window.openSpaCart = openSpaCart;
window.closeSpaCart = closeSpaCart;
window.proceedToBook = proceedToBook;

// ─────────────────────────────────────────────

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

function submitApptRequest() {
  const name = document.getElementById('apptName').value.trim();
  const cabin = document.getElementById('apptCabin').value.trim();
  const treatment = document.getElementById('apptTreatment').value;
  const date = document.getElementById('apptDate').value;
  const time = document.getElementById('apptTime').value;
  if (!name || !treatment || !date) { showToast('Please fill in your name, treatment and date'); return; }
  // Show confirmation
  document.getElementById('apptConfirmation').style.display = 'block';
  // Clear form
  ['apptName','apptCabin','apptNotes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('apptTreatment').value = '';
  document.getElementById('apptDate').value = '';
  showToast('Appointment request sent ✓');
  // Scroll to confirmation
  document.getElementById('apptConfirmation').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── SAFETY DATA ───────────────────────────────
const safetyData = [
  { icon: '🔥', title: 'Fire Safety', open: false,
    content: `<ul><li>Do not use candles or open flames in staterooms</li><li>Smoking only permitted in designated areas on Deck 11 aft</li><li>Fire extinguishers at every corridor junction</li><li>If you discover a fire, activate the nearest alarm and call the bridge on extension 0</li></ul>` },
  { icon: '🏥', title: 'Medical Centre', open: false,
    content: `<p>The Medical Centre is on Deck 3 forward, staffed 24 hours.</p><ul><li>Emergency: extension 911</li><li>Non-emergency: extension 302</li><li>Walk-in hours: 8:00-10:00 AM and 5:00-7:00 PM</li></ul>` },
  { icon: '🌊', title: 'Man Overboard Procedure', open: false,
    content: `<ul><li>Shout "Man Overboard" loudly and call the bridge on extension 0</li><li>Throw the nearest lifebuoy ring toward the person</li><li>Keep the person in sight -- do NOT jump in after them</li></ul>` },
  { icon: '☀️', title: 'Sun & Heat Safety', open: false,
    content: `<ul><li>Apply SPF 30+ sunscreen every 2 hours when on deck or ashore</li><li>Stay hydrated -- at least 2 litres of water per day in warm ports</li><li>Seek shade between 11:00 AM and 3:00 PM</li></ul>` },
  { icon: '🔒', title: 'Personal Security', open: false,
    content: `<ul><li>Use the in-room safe for valuables and passports</li><li>Your cabin key card is your port ID -- do not lend it to others</li><li>Report suspicious activity to Security on extension 500</li></ul>` },
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
        <div class="poll-footer">${totalVotes} vote${totalVotes !== 1 ? 's' : ''}${userVote === undefined ? ' . Tap to vote' : ''}</div>
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


// ══════════════════════════════════════════════
//  POLLS

// ═══════════════════════════════════════════════

function switchTab(id, tab) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab, .bnav-btn').forEach(t => t.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  if (tab) tab.classList.add('active');
  if (id === 'updates') document.getElementById('updatesBadge').classList.remove('show');
  if (id === 'groups') { if (typeof loadGroups === 'function') loadGroups(); }
  if (id === 'chat') {
    document.getElementById('chatBadge')?.classList.remove('show');
    if (typeof onChatTabOpen === 'function') onChatTabOpen();
  }
}

function syncTopNav(id) {
  const tabMap = ['itinerary', 'schedule', 'updates', 'safety', 'spa', 'groups', 'chat'];
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
  showToast('Sending alert...');
  const ok = await postEmergencyAlertToDb(title, body);
  if (!ok) return;
  hideForm('emergencyComposeForm');
  document.getElementById('emgTitle').value = '';
  document.getElementById('emgBody').value = '';
  document.getElementById('updatesBadge').classList.add('show');
  showToast('🚨 Emergency alert sent to all residents');
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🚨 EMERGENCY -- Villa Vie Odyssey', { body: `${title}: ${body}`, icon: 'icons/icon-192.png', requireInteraction: true });
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

// ── ADMIN -- PORTS ─────────────────────────────



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

// ── ADMIN -- UPDATES ───────────────────────────

async function postUpdate() {
  const title = document.getElementById('newUpdateTitle').value.trim();
  const body = document.getElementById('newUpdateBody').value.trim();
  const cat = document.getElementById('newUpdateCat').value;
  const notif = document.getElementById('newUpdateNotif').value;
  if (!title || !body) { showToast('Please fill in all fields'); return; }
  showToast('Posting...');
  let pdfUrl = null, pdfName = null;
  if (_selectedPdfFile) {
    showToast('Uploading PDF...');
    const result = await uploadPdfToSupabase(_selectedPdfFile);
    if (!result) { showToast('PDF upload failed — posting without attachment'); }
    else { pdfUrl = result.url; pdfName = result.name; }
  }
  const ok = await postUpdateToDb(title, body, cat, pdfUrl, pdfName);
  if (!ok) return;
  clearPdfUpload();
  hideForm('addUpdateForm');
  document.getElementById('newUpdateTitle').value = '';
  document.getElementById('newUpdateBody').value = '';
  if (notif === 'yes') showNotification(`📢 ${title}`);
  showToast('Update posted ✓');
}

// ── ADMIN -- SAFETY ─────────────────────────────

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
  if (dateEl) dateEl.textContent = 'Today -- ' + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

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

// ══════════════════════════════════════════════
//  COMMUNITY GROUPS
// ══════════════════════════════════════════════

var accessLevelOrder = { 'renter': 0, 'resident': 1, 'founder': 2, 'team': 3 };
var groupsData = [];
var groupMemberships = [];

async function loadGroups() {
  if (!sbClient) return;
  var userLevel = window.accessLevel || 'resident';
  var userRank = accessLevelOrder[userLevel] || 0;

  try {
    var { data: groups, error } = await sbClient
      .from('groups')
      .select('*, group_members(user_email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    groupsData = groups || [];

    // Get current user memberships
    var userEmail = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.email : '';
    var { data: memberships } = await sbClient
      .from('group_members')
      .select('group_id')
      .eq('user_email', userEmail);
    groupMemberships = (memberships || []).map(function(m) { return m.group_id; });

    renderGroups(userRank, userEmail);
  } catch(e) {
    console.error('loadGroups error:', e);
    var el = document.getElementById('groupsList');
    if (el) el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light)">Could not load groups.</div>';
  }
}

function renderGroups(userRank, userEmail) {
  var el = document.getElementById('groupsList');
  var subtitle = document.getElementById('groupsSubtitle');
  if (!el) return;

  // Filter groups by access level
  var visible = groupsData.filter(function(g) {
    var groupRank = accessLevelOrder[g.min_access_level] || 0;
    return userRank >= groupRank;
  });

  if (subtitle) subtitle.textContent = visible.length + ' group' + (visible.length !== 1 ? 's' : '') + ' available to you';

  if (!visible.length) {
    el.innerHTML = '<div class="groups-empty"><div style="font-size:40px;margin-bottom:12px">&#128101;</div><div style="font-size:16px;font-weight:500;color:var(--navy)">No groups yet</div><div style="font-size:13px;color:var(--text-light);margin-top:6px">Be the first to create a community group</div></div>';
    return;
  }

  var levelLabels = { renter: 'Everyone', resident: 'Residents & Founders', founder: 'Founders only', team: 'Team only' };

  el.innerHTML = visible.map(function(g) {
    var memberCount = (g.group_members || []).length;
    var isMember = groupMemberships.indexOf(g.group_id || g.id) > -1 || 
                   (g.group_members || []).some(function(m) { return m.user_email === userEmail; });
    var isOwner = g.created_by === userEmail;
    var isAdmin = typeof window.isAdmin !== 'undefined' && window.isAdmin;
    var levelLabel = levelLabels[g.min_access_level] || g.min_access_level;

    return '<div class="group-card">' +
      '<div class="group-card-body">' +
        '<div class="group-card-header">' +
          '<div class="group-name">' + escapeHtml(g.name) + '</div>' +
          (g.min_access_level !== 'renter' ?
            '<span class="group-level-badge">' + levelLabel + '</span>' : '') +
        '</div>' +
        '<div class="group-desc">' + escapeHtml(g.description || '') + '</div>' +
        '<div class="group-meta">' +
          '<span class="group-member-count">&#128101; ' + memberCount + ' member' + (memberCount !== 1 ? 's' : '') + '</span>' +
          '<span class="group-creator">Created by ' + escapeHtml(g.created_by_name || g.created_by || 'resident') + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="group-card-actions">' +
        (isMember ?
          '<button class="btn-outline btn-sm group-joined-btn" onclick="leaveGroup(\"' + g.id + '\")">&#10003; Joined</button>' :
          '<button class="btn-gold btn-sm" onclick="joinGroup(\"' + g.id + '\")">Join</button>') +
        ((isOwner || isAdmin) ?
          '<button class="btn-sm group-delete-btn" onclick="deleteGroup(\"' + g.id + '\")">&#128465;</button>' : '') +
      '</div>' +
    '</div>';
  }).join('');
}

async function createGroup() {
  var name = document.getElementById('groupName').value.trim();
  var desc = document.getElementById('groupDesc').value.trim();
  var level = document.getElementById('groupLevel').value;
  var userEmail = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.email : '';
  var userName = (typeof currentUser !== 'undefined' && currentUser && currentUser.user_metadata) ?
    currentUser.user_metadata.full_name || userEmail : userEmail;

  if (!name || !desc) { showToast('Please fill in name and description'); return; }
  if (!sbClient) { showToast('Not connected'); return; }

  try {
    var { error } = await sbClient.from('groups').insert({
      name: name, description: desc,
      min_access_level: level,
      created_by: userEmail,
      created_by_name: userName
    });
    if (error) throw error;
    hideForm('createGroupForm');
    document.getElementById('groupName').value = '';
    document.getElementById('groupDesc').value = '';
    showToast('Group created ✓');
    loadGroups();
  } catch(e) {
    console.error('createGroup error:', e);
    showToast('Error creating group');
  }
}

async function joinGroup(groupId) {
  var userEmail = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.email : '';
  var userName = (typeof currentUser !== 'undefined' && currentUser && currentUser.user_metadata) ?
    currentUser.user_metadata.full_name || userEmail : userEmail;
  if (!userEmail) { showToast('Please log in to join groups'); return; }
  try {
    var { error } = await sbClient.from('group_members').insert({
      group_id: groupId, user_email: userEmail, user_name: userName
    });
    if (error && error.code !== '23505') throw error;
    showToast('Joined group ✓');
    loadGroups();
  } catch(e) { showToast('Error joining group'); }
}

async function leaveGroup(groupId) {
  var userEmail = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.email : '';
  try {
    await sbClient.from('group_members').delete()
      .eq('group_id', groupId).eq('user_email', userEmail);
    showToast('Left group');
    loadGroups();
  } catch(e) { showToast('Error leaving group'); }
}

async function deleteGroup(groupId) {
  if (!confirm('Delete this group? This cannot be undone.')) return;
  try {
    await sbClient.from('groups').delete().eq('id', groupId);
    showToast('Group deleted');
    loadGroups();
  } catch(e) { showToast('Error deleting group'); }
}

window.loadGroups = loadGroups;
window.createGroup = createGroup;
window.joinGroup = joinGroup;
window.leaveGroup = leaveGroup;
window.deleteGroup = deleteGroup;

// ── DYNAMIC DAY NAV ──────────────────────────

// ── INFO BANNER ──────────────────────────────
function sendInfoAlert() {
  var title = document.getElementById('infoAlertTitle').value.trim();
  var body = document.getElementById('infoAlertBody').value.trim();
  if (!title || !body) { showToast('Please fill in title and message'); return; }
  showInfoBanner(title, body);
  hideForm('infoComposeForm');
  document.getElementById('infoAlertTitle').value = '';
  document.getElementById('infoAlertBody').value = '';
  show


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
        <div class="poll-footer">${totalVotes} vote${totalVotes !== 1 ? 's' : ''}${userVote === undefined ? ' - Tap to vote' : ''}</div>
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


// ══════════════════════════════════════════════
//  POLLS

// ═══════════════════════════════════════════════

function switchTab(id, tab) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab, .bnav-btn').forEach(t => t.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  if (tab) tab.classList.add('active');
  if (id === 'updates') document.getElementById('updatesBadge').classList.remove('show');
  if (id === 'groups') { if (typeof loadGroups === 'function') loadGroups(); }
  if (id === 'chat') {
    document.getElementById('chatBadge')?.classList.remove('show');
    if (typeof onChatTabOpen === 'function') onChatTabOpen();
  }
}

function syncTopNav(id) {
  const tabMap = ['itinerary', 'schedule', 'updates', 'safety', 'spa', 'groups', 'chat'];
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
  showToast('Sending alert...');
  const ok = await postEmergencyAlertToDb(title, body);
  if (!ok) return;
  hideForm('emergencyComposeForm');
  document.getElementById('emgTitle').value = '';
  document.getElementById('emgBody').value = '';
  document.getElementById('updatesBadge').classList.add('show');
  showToast('🚨 Emergency alert sent to all residents');
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🚨 EMERGENCY -- Villa Vie Odyssey', { body: `${title}: ${body}`, icon: 'icons/icon-192.png', requireInteraction: true });
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

// ── ADMIN -- PORTS ─────────────────────────────



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

// ── ADMIN -- UPDATES ───────────────────────────

async function postUpdate() {
  const title = document.getElementById('newUpdateTitle').value.trim();
  const body = document.getElementById('newUpdateBody').value.trim();
  const cat = document.getElementById('newUpdateCat').value;
  const notif = document.getElementById('newUpdateNotif').value;
  if (!title || !body) { showToast('Please fill in all fields'); return; }
  showToast('Posting...');
  let pdfUrl = null, pdfName = null;
  if (_selectedPdfFile) {
    showToast('Uploading PDF...');
    const result = await uploadPdfToSupabase(_selectedPdfFile);
    if (!result) { showToast('PDF upload failed — posting without attachment'); }
    else { pdfUrl = result.url; pdfName = result.name; }
  }
  const ok = await postUpdateToDb(title, body, cat, pdfUrl, pdfName);
  if (!ok) return;
  clearPdfUpload();
  hideForm('addUpdateForm');
  document.getElementById('newUpdateTitle').value = '';
  document.getElementById('newUpdateBody').value = '';
  if (notif === 'yes') showNotification(`📢 ${title}`);
  showToast('Update posted ✓');
}

// ── ADMIN -- SAFETY ─────────────────────────────

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
  if (dateEl) dateEl.textContent = 'Today -- ' + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

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
  var name    = document.getElementById('venName').value.trim();
  var cabin   = document.getElementById('venCabin').value.trim();
  var venue   = document.getElementById('venVenue').value;
  var date    = document.getElementById('venDate').value;
  var time    = document.getElementById('venTime') ? document.getElementById('venTime').value : '';
  var notes   = document.getElementById('venNotes') ? document.getElementById('venNotes').value.trim() : '';
  var errEl   = document.getElementById('venError');
  var confEl  = document.getElementById('venConfirmation');
  var btn     = document.getElementById('venSubmitBtn');

  if (!name || !cabin || !venue || !date) {
    if (errEl) { errEl.textContent = 'Please fill in all required fields.'; errEl.style.display = 'block'; }
    return;
  }
  if (errEl) errEl.style.display = 'none';
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

  var equipment = _venueEquipment.length ? _venueEquipment.join(', ') : '';

  try {
    // Save to Supabase
    if (sbClient) {
      var { error } = await sbClient.from('venue_bookings').insert({
        venue: venue, resident_name: name, cabin: cabin,
        date: date, time_slot: time, equipment: equipment,
        notes: notes, status: 'pending'
      });
      if (error) throw error;
    }

    // Also send email notification
    if (_emailJsReady) {
      var params = {
        to_email: 'hotel_director@vvodyssey.com', from_name: name, cabin: cabin,
        venue: venue, date: new Date(date).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
        time: time || 'Not specified', equipment: equipment || 'None', notes: notes || 'None',
        submitted_at: new Date().toLocaleString('en-GB')
      };
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    }

    if (confEl) confEl.style.display = 'block';
    if (btn) btn.textContent = 'Request Sent ✓';
    showToast('Venue request submitted ✓');
    ['venName','venCabin','venTime','venNotes'].forEach(function(id) { var e = document.getElementById(id); if (e) e.value = ''; });
    document.getElementById('venVenue').value = '';
    document.getElementById('venDate').value = '';
    document.querySelectorAll('.equipment-item input').forEach(function(cb) { cb.checked = false; });
    _venueEquipment = [];
  } catch(err) {
    console.error('Venue submit error:', err);
    if (confEl) { confEl.textContent = 'Request received. Please also contact the hotel team at extension 100.'; confEl.style.display = 'block'; }
    if (btn) { btn.textContent = 'Send Request'; btn.disabled = false; }
  }
}
// SKIP OLD FUNCTION
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


// ── DYNAMIC DAY NAV ──────────────────────────
function initDayNav() {
  var container = document.getElementById('dayNavContainer');
  if (!container) return;

  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var today = new Date();
  var html = '';

  for (var i = 0; i < 5; i++) {
    var d = new Date(today);
    d.setDate(today.getDate() + i);
    var label = i === 0 ? 'Today' : days[d.getDay()] + ' ' + d.getDate();
    var activeClass = i === 0 ? ' active' : '';
    html += '<button class="day-btn' + activeClass + '" id="dayBtn' + i + '" onclick="selectDay(' + i + ',this)">' + label + '</button>';
  }
  container.innerHTML = html;

  // Also update scheduleDate
  var dateEl = document.getElementById('scheduleDate');
  if (dateEl) {
    dateEl.textContent = 'Today -- ' + today.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  }
}
window.initDayNav = initDayNav;

// ── INFO BANNER ──────────────────────────────
function sendInfoAlert() {
  var title = document.getElementById('infoAlertTitle').value.trim();
  var body = document.getElementById('infoAlertBody').value.trim();
  if (!title || !body) { showToast('Please fill in title and message'); return; }
  showInfoBanner(title, body);
  hideForm('infoComposeForm');
  document.getElementById('infoAlertTitle').value = '';
  document.getElementById('infoAlertBody').value = '';
  showToast('Ship notice posted ✓');
}

function showInfoBanner(title, body) {
  var banner = document.getElementById('infoBanner');
  var t = document.getElementById('infoBannerTitle');
  var b = document.getElementById('infoBannerBody');
  var time = document.getElementById('infoBannerTime');
  if (!banner) return;
  if (t) t.textContent = title;
  if (b) b.textContent = body;
  if (time) time.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  banner.classList.add('show');
  banner.style.display = 'block';
}

function dismissInfoBanner() {
  var banner = document.getElementById('infoBanner');
  if (banner) { banner.classList.remove('show'); banner.style.display = 'none'; }
}

window.sendInfoAlert = sendInfoAlert;
window.showInfoBanner = showInfoBanner;
window.dismissInfoBanner = dismissInfoBanner;

// ── PDF UPLOADS IN UPDATES ────────────────────
var _selectedPdfFile = null;
var SUPABASE_URL_BASE = 'https://xqpvqztphkenokkjrzef.supabase.co';

function handlePdfSelect(input) {
  var file = input.files[0];
  if (!file) return;
  _selectedPdfFile = file;
  var label = document.getElementById('pdfUploadLabel');
  var area = document.getElementById('pdfUploadArea');
  if (label) label.textContent = '📄 ' + file.name + ' (' + Math.round(file.size/1024) + 'KB)';
  if (area) area.classList.add('pdf-selected');
}

function clearPdfUpload() {
  _selectedPdfFile = null;
  var input = document.getElementById('pdfFileInput');
  if (input) input.value = '';
  var label = document.getElementById('pdfUploadLabel');
  var area = document.getElementById('pdfUploadArea');
  if (label) label.textContent = 'Tap to attach a PDF';
  if (area) area.classList.remove('pdf-selected');
}

async function uploadPdfToSupabase(file) {
  if (!sbClient) return null;
  var fileName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  try {
    var { data, error } = await sbClient.storage
      .from('update-pdfs')
      .upload(fileName, file, { contentType: 'application/pdf', upsert: false });
    if (error) throw error;
    var { data: urlData } = sbClient.storage
      .from('update-pdfs')
      .getPublicUrl(fileName);
    return { url: urlData.publicUrl, name: file.name };
  } catch(e) {
    console.error('PDF upload error:', e);
    return null;
  }
}

window.handlePdfSelect = handlePdfSelect;
window.clearPdfUpload = clearPdfUpload;

}

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
  var name    = document.getElementById('venName').value.trim();
  var cabin   = document.getElementById('venCabin').value.trim();
  var venue   = document.getElementById('venVenue').value;
  var date    = document.getElementById('venDate').value;
  var time    = document.getElementById('venTime') ? document.getElementById('venTime').value : '';
  var notes   = document.getElementById('venNotes') ? document.getElementById('venNotes').value.trim() : '';
  var errEl   = document.getElementById('venError');
  var confEl  = document.getElementById('venConfirmation');
  var btn     = document.getElementById('venSubmitBtn');

  if (!name || !cabin || !venue || !date) {
    if (errEl) { errEl.textContent = 'Please fill in all required fields.'; errEl.style.display = 'block'; }
    return;
  }
  if (errEl) errEl.style.display = 'none';
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

  var equipment = _venueEquipment.length ? _venueEquipment.join(', ') : '';

  try {
    // Save to Supabase
    if (sbClient) {
      var { error } = await sbClient.from('venue_bookings').insert({
        venue: venue, resident_name: name, cabin: cabin,
        date: date, time_slot: time, equipment: equipment,
        notes: notes, status: 'pending'
      });
      if (error) throw error;
    }

    // Also send email notification
    if (_emailJsReady) {
      var params = {
        to_email: 'hotel_director@vvodyssey.com', from_name: name, cabin: cabin,
        venue: venue, date: new Date(date).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
        time: time || 'Not specified', equipment: equipment || 'None', notes: notes || 'None',
        submitted_at: new Date().toLocaleString('en-GB')
      };
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    }

    if (confEl) confEl.style.display = 'block';
    if (btn) btn.textContent = 'Request Sent ✓';
    showToast('Venue request submitted ✓');
    ['venName','venCabin','venTime','venNotes'].forEach(function(id) { var e = document.getElementById(id); if (e) e.value = ''; });
    document.getElementById('venVenue').value = '';
    document.getElementById('venDate').value = '';
    document.querySelectorAll('.equipment-item input').forEach(function(cb) { cb.checked = false; });
    _venueEquipment = [];
  } catch(err) {
    console.error('Venue submit error:', err);
    if (confEl) { confEl.textContent = 'Request received. Please also contact the hotel team at extension 100.'; confEl.style.display = 'block'; }
    if (btn) { btn.textContent = 'Send Request'; btn.disabled = false; }
  }
}
// SKIP OLD FUNCTION
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

// Keep-alive ping every 4 minutes -- only fires when tab is visible
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
  dinner: ['Amuse-Bouche from the Chef', 'Seared Scallops with Cauliflower Puree', 'Lobster Bisque', 'Prime Beef Tenderloin . Pan-seared Sea Bass', 'Souffle du Jour . Cheese Selection']
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
      return '<div class="menu-item">' + item.trim().replace(/^[.•-]\s*/, '') + '</div>';
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

function renderUpdates() {
  const el = document.getElementById('updateList');
  if (!el) return;
  const catClass = { announcement: 'cat-announcement', dining: 'cat-dining', activities: 'cat-activities', general: 'cat-general' };
  el.innerHTML = updates.map(u => `
    <div class="update-card">
      <div class="update-meta">
        <span class="update-category ${catClass[u.category]}">${u.category}</span>
        <span class="update-time">${u.time}</span>
      </div>
      <div class="update-title">${u.title}</div>
      <div class="update-body">${u.body}</div>
      ${u.pdf_url ? `<a class="update-pdf-link" href="${u.pdf_url}" target="_blank" rel="noopener">📄 ${u.pdf_name || 'View PDF'}</a>` : ''}
    </div>
  `).join('');
}

window.renderUpdates = renderUpdates;

function renderSafety() {
  const el = document.getElementById('safetyList');
  if (!el) return;
  el.innerHTML = safetyData.map((s, i) => `
    <div class="safety-card">
      <div class="safety-card-header" onclick="toggleSafety(${i})">
        <span class="safety-card-icon">${s.icon}</span>
        <span class="safety-card-title">${s.title}</span>
        <span class="safety-card-chevron" id="chevron-${i}">${s.open ? '▲' : '▼'}</span>
      </div>
      <div class="safety-card-body ${s.open ? 'open' : ''}" id="safety-body-${i}">${s.content}</div>
    </div>
  `).join('');
}

window.renderSafety = renderSafety;

function renderEmergencyMessages() {
  const el = document.getElementById('emergencyMessageList');
  const divider = document.getElementById('updatesDivider');
  if (!el) return;

  const active = emergencyMessages.filter(m => m.active);
  const resolved = emergencyMessages.filter(m => !m.active);

  // Show divider only when there are emergency messages
  if (divider) divider.style.display = emergencyMessages.length > 0 ? 'flex' : 'none';

  if (emergencyMessages.length === 0) {
    el.innerHTML = '';
    return;
  }

  let html = '';
  if (active.length > 0) {
    html += `<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#b91c1c;margin-bottom:10px">🚨 Active Emergency Alerts</div>`;
    active.forEach(m => {
      const idx = emergencyMessages.indexOf(m);
      html += `
        <div class="emg-message-card">
          <div class="emg-message-header">
            <span class="emg-message-icon">🚨</span>
            <span class="emg-message-title">${m.title}</span>
          </div>
          <div class="emg-message-body">${m.body}</div>
          <div class="emg-message-meta">
            <span>Issued ${m.time}</span>
            ${isAdmin ? `<button onclick="resolveAlert(${idx})" style="margin-left:auto;background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:5px 12px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;">✓ Mark Resolved</button>` : ''}
          </div>
        </div>`;
    });
  }

  if (resolved.length > 0) {
    html += `<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-light);margin:16px 0 10px">Past Alerts</div>`;
    resolved.forEach(m => {
      html += `
        <div class="emg-message-card resolved">
          <div class="emg-message-header">
            <span class="emg-message-icon">📋</span>
            <span class="emg-message-title resolved">${m.title}</span>
            <span class="emg-resolved-badge">Resolved</span>
          </div>
          <div class="emg-message-body resolved">${m.body}</div>
          <div class="emg-message-meta resolved"><span>Issued ${m.time}</span></div>
        </div>`;
    });
  }

  el.innerHTML = html;
}

// ═══════════════════════════════════════════════
//  INTERACTIONS
// ═══════════════════════════════════════════════

window.renderEmergencyMessages = renderEmergencyMessages;

// ══════════════════════════════════════════════
//  VENUE BOOKING CALENDAR
// ══════════════════════════════════════════════

var venCalYear  = new Date().getFullYear();
var venCalMonth = new Date().getMonth();
var venBookings = [];

function venCalPrev() {
  venCalMonth--;
  if (venCalMonth < 0) { venCalMonth = 11; venCalYear--; }
  renderVenueCalendar();
}
function venCalNext() {
  venCalMonth++;
  if (venCalMonth > 11) { venCalMonth = 0; venCalYear++; }
  renderVenueCalendar();
}
window.venCalPrev = venCalPrev;
window.venCalNext = venCalNext;

async function loadVenueCalendar() {
  if (!sbClient) return;
  try {
    var { data, error } = await sbClient
      .from('venue_bookings')
      .select('venue, date, time_slot, status')
      .eq('status', 'approved')
      .order('date');
    if (!error && data) {
      venBookings = data;
      renderVenueCalendar();
    }
  } catch(e) { console.error('loadVenueCalendar:', e); }
}

function renderVenueCalendar() {
  var el = document.getElementById('venCalGrid');
  var titleEl = document.getElementById('venCalMonth');
  if (!el) return;

  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  if (titleEl) titleEl.textContent = monthNames[venCalMonth] + ' ' + venCalYear;

  // Get bookings for this month
  var monthStr = venCalYear + '-' + String(venCalMonth+1).padStart(2,'0');
  var monthBookings = venBookings.filter(function(b) {
    return b.date && b.date.startsWith(monthStr);
  });

  // Build calendar grid
  var firstDay = new Date(venCalYear, venCalMonth, 1).getDay();
  var daysInMonth = new Date(venCalYear, venCalMonth+1, 0).getDate();
  var today = new Date().toISOString().slice(0,10);

  var html = '<div class="vcal-weekdays">';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function(d) {
    html += '<div class="vcal-wd">' + d + '</div>';
  });
  html += '</div><div class="vcal-days">';

  // Empty cells before first day
  for (var i = 0; i < firstDay; i++) {
    html += '<div class="vcal-day vcal-day-empty"></div>';
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = venCalYear + '-' + String(venCalMonth+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    var dayBookings = monthBookings.filter(function(b) { return b.date === dateStr; });
    var isToday = dateStr === today;
    var isPast = dateStr < today;

    html += '<div class="vcal-day' + (isToday ? ' vcal-today' : '') + (isPast ? ' vcal-past' : '') + '">';
    html += '<div class="vcal-day-num">' + d + '</div>';

    if (dayBookings.length > 0) {
      dayBookings.forEach(function(b) {
        html += '<div class="vcal-booking" title="' + b.venue + (b.time_slot ? ' . ' + b.time_slot : '') + '">' +
          b.venue.split(' ')[0] + (b.venue.split(' ')[1] ? ' ' + b.venue.split(' ')[1] : '') +
          '</div>';
      });
    }
    html += '</div>';
  }
  html += '</div>';
  el.innerHTML = html;
}

// ── ADMIN: LOAD AND MANAGE REQUESTS ──────────
async function loadVenueRequests() {
  if (!sbClient || !isAdmin) return;
  var el = document.getElementById('venueRequestsList');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-light)">Loading...</div>';

  try {
    var { data, error } = await sbClient
      .from('venue_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || !data.length) {
      el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light)">No requests yet.</div>';
      return;
    }

    var pending = data.filter(function(b) { return b.status === 'pending'; });
    var others  = data.filter(function(b) { return b.status !== 'pending'; });

    var html = '';
    if (pending.length) {
      html += '<div class="section-title" style="padding:16px 0 8px">Pending (' + pending.length + ')</div>';
      pending.forEach(function(b) { html += venueRequestCard(b); });
    }
    if (others.length) {
      html += '<div class="section-title" style="padding:16px 0 8px;margin-top:8px">Previous</div>';
      others.forEach(function(b) { html += venueRequestCard(b); });
    }
    el.innerHTML = html;
  } catch(e) {
    el.innerHTML = '<div style="color:var(--danger);padding:20px">Error loading requests.</div>';
  }
}

function venueRequestCard(b) {
  var date = new Date(b.date).toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
  var statusColor = b.status === 'approved' ? 'var(--success)' : b.status === 'declined' ? 'var(--danger)' : 'var(--gold)';
  return '<div class="venue-req-card">' +
    '<div class="venue-req-header">' +
      '<div>' +
        '<div class="venue-req-venue">' + b.venue + '</div>' +
        '<div class="venue-req-meta">' + b.resident_name + (b.cabin ? ' . ' + b.cabin : '') + '</div>' +
      '</div>' +
      '<span class="venue-req-status" style="color:' + statusColor + '">' + b.status.toUpperCase() + '</span>' +
    '</div>' +
    '<div class="venue-req-detail">📅 ' + date + (b.time_slot ? ' . ' + b.time_slot : '') + '</div>' +
    (b.equipment ? '<div class="venue-req-detail">🔧 ' + b.equipment + '</div>' : '') +
    (b.notes ? '<div class="venue-req-detail">📝 ' + b.notes + '</div>' : '') +
    (b.status === 'pending' ?
      '<div class="venue-req-actions">' +
        '<button class="btn-gold btn-sm" onclick="approveVenue(\"' + b.id + '\")">✓ Approve</button>' +
        '<button class="btn-outline btn-sm" onclick="declineVenue(\"' + b.id + '\")">✕ Decline</button>' +
      '</div>' : '') +
    '</div>';
}

async function approveVenue(id) {
  await updateVenueStatus(id, 'approved');
}
async function declineVenue(id) {
  await updateVenueStatus(id, 'declined');
}
async function updateVenueStatus(id, status) {
  try {
    var { error } = await sbClient
      .from('venue_bookings')
      .update({ status: status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      showToast('Booking ' + status);
      loadVenueRequests();
    }
  } catch(e) { showToast('Error updating booking'); }
}

window.loadVenueCalendar = loadVenueCalendar;
window.loadVenueRequests = loadVenueRequests;
window.approveVenue = approveVenue;
window.declineVenue = declineVenue;
window.renderVenueCalendar = renderVenueCalendar;

// ══════════════════════════════════════════════
//  COMMUNITY GROUPS
// ══════════════════════════════════════════════

var accessLevelOrder = { 'renter': 0, 'resident': 1, 'founder': 2, 'team': 3 };
var groupsData = [];
var groupMemberships = [];

async function loadGroups() {
  if (!sbClient) return;
  var userLevel = window.accessLevel || 'resident';
  var userRank = accessLevelOrder[userLevel] || 0;

  try {
    var { data: groups, error } = await sbClient
      .from('groups')
      .select('*, group_members(user_email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    groupsData = groups || [];

    // Get current user memberships
    var userEmail = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.email : '';
    var { data: memberships } = await sbClient
      .from('group_members')
      .select('group_id')
      .eq('user_email', userEmail);
    groupMemberships = (memberships || []).map(function(m) { return m.group_id; });

    renderGroups(userRank, userEmail);
  } catch(e) {
    console.error('loadGroups error:', e);
    var el = document.getElementById('groupsList');
    if (el) el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light)">Could not load groups.</div>';
  }
}

function renderGroups(userRank, userEmail) {
  var el = document.getElementById('groupsList');
  var subtitle = document.getElementById('groupsSubtitle');
  if (!el) return;

  // Filter groups by access level
  var visible = groupsData.filter(function(g) {
    var groupRank = accessLevelOrder[g.min_access_level] || 0;
    return userRank >= groupRank;
  });

  if (subtitle) subtitle.textContent = visible.length + ' group' + (visible.length !== 1 ? 's' : '') + ' available to you';

  if (!visible.length) {
    el.innerHTML = '<div class="groups-empty"><div style="font-size:40px;margin-bottom:12px">&#128101;</div><div style="font-size:16px;font-weight:500;color:var(--navy)">No groups yet</div><div style="font-size:13px;color:var(--text-light);margin-top:6px">Be the first to create a community group</div></div>';
    return;
  }

  var levelLabels = { renter: 'Everyone', resident: 'Residents & Founders', founder: 'Founders only', team: 'Team only' };

  el.innerHTML = visible.map(function(g) {
    var memberCount = (g.group_members || []).length;
    var isMember = groupMemberships.indexOf(g.group_id || g.id) > -1 || 
                   (g.group_members || []).some(function(m) { return m.user_email === userEmail; });
    var isOwner = g.created_by === userEmail;
    var isAdmin = typeof window.isAdmin !== 'undefined' && window.isAdmin;
    var levelLabel = levelLabels[g.min_access_level] || g.min_access_level;

    return '<div class="group-card">' +
      '<div class="group-card-body">' +
        '<div class="group-card-header">' +
          '<div class="group-name">' + escapeHtml(g.name) + '</div>' +
          (g.min_access_level !== 'renter' ?
            '<span class="group-level-badge">' + levelLabel + '</span>' : '') +
        '</div>' +
        '<div class="group-desc">' + escapeHtml(g.description || '') + '</div>' +
        '<div class="group-meta">' +
          '<span class="group-member-count">&#128101; ' + memberCount + ' member' + (memberCount !== 1 ? 's' : '') + '</span>' +
          '<span class="group-creator">Created by ' + escapeHtml(g.created_by_name || g.created_by || 'resident') + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="group-card-actions">' +
        (isMember ?
          '<button class="btn-outline btn-sm group-joined-btn" onclick="leaveGroup(\"' + g.id + '\")">&#10003; Joined</button>' :
          '<button class="btn-gold btn-sm" onclick="joinGroup(\"' + g.id + '\")">Join</button>') +
        ((isOwner || isAdmin) ?
          '<button class="btn-sm group-delete-btn" onclick="deleteGroup(\"' + g.id + '\")">&#128465;</button>' : '') +
      '</div>' +
    '</div>';
  }).join('');
}

async function createGroup() {
  var name = document.getElementById('groupName').value.trim();
  var desc = document.getElementById('groupDesc').value.trim();
  var level = document.getElementById('groupLevel').value;
  var userEmail = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.email : '';
  var userName = (typeof currentUser !== 'undefined' && currentUser && currentUser.user_metadata) ?
    currentUser.user_metadata.full_name || userEmail : userEmail;

  if (!name || !desc) { showToast('Please fill in name and description'); return; }
  if (!sbClient) { showToast('Not connected'); return; }

  try {
    var { error } = await sbClient.from('groups').insert({
      name: name, description: desc,
      min_access_level: level,
      created_by: userEmail,
      created_by_name: userName
    });
    if (error) throw error;
    hideForm('createGroupForm');
    document.getElementById('groupName').value = '';
    document.getElementById('groupDesc').value = '';
    showToast('Group created ✓');
    loadGroups();
  } catch(e) {
    console.error('createGroup error:', e);
    showToast('Error creating group');
  }
}

async function joinGroup(groupId) {
  var userEmail = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.email : '';
  var userName = (typeof currentUser !== 'undefined' && currentUser && currentUser.user_metadata) ?
    currentUser.user_metadata.full_name || userEmail : userEmail;
  if (!userEmail) { showToast('Please log in to join groups'); return; }
  try {
    var { error } = await sbClient.from('group_members').insert({
      group_id: groupId, user_email: userEmail, user_name: userName
    });
    if (error && error.code !== '23505') throw error;
    showToast('Joined group ✓');
    loadGroups();
  } catch(e) { showToast('Error joining group'); }
}

async function leaveGroup(groupId) {
  var userEmail = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.email : '';
  try {
    await sbClient.from('group_members').delete()
      .eq('group_id', groupId).eq('user_email', userEmail);
    showToast('Left group');
    loadGroups();
  } catch(e) { showToast('Error leaving group'); }
}

async function deleteGroup(groupId) {
  if (!confirm('Delete this group? This cannot be undone.')) return;
  try {
    await sbClient.from('groups').delete().eq('id', groupId);
    showToast('Group deleted');
    loadGroups();
  } catch(e) { showToast('Error deleting group'); }
}

window.loadGroups = loadGroups;
window.createGroup = createGroup;
window.joinGroup = joinGroup;
window.leaveGroup = leaveGroup;
window.deleteGroup = deleteGroup;