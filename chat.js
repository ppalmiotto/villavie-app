// ══════════════════════════════════════════════
//  VILLA VIE — chat.js  (stable)
//  No load loops. Subscription appends only.
// ══════════════════════════════════════════════

var currentChannel = 'general';
var chatSubscription = null;
var chatInitialised = false;  // hard guard — init runs ONCE only
var chatUserEmail = '';
var chatIsAdmin = false;
var chatMembers = [];
var pendingImageDataURL = null;

const REACTIONS = ['👍','❤️','😂','😮','🙏','🎉'];

// ── INIT — runs once only ─────────────────────
async function initChat() {
  if (chatInitialised) return;  // never run twice

  // Wait for sbClient
  let attempts = 0;
  while ((!window.sbClient || typeof window.sbClient.from !== 'function') && attempts < 15) {
    await new Promise(r => setTimeout(r, 200));
    attempts++;
  }
  if (!window.sbClient || typeof window.sbClient.from !== 'function') {
    const el = document.getElementById('chatMessages');
    if (el) el.innerHTML = '<div class="chat-loading">Chat unavailable — please refresh.</div>';
    return;
  }

  chatUserEmail = (typeof currentUser !== 'undefined' && currentUser?.email) ? currentUser.email : '';
  chatIsAdmin = (typeof isAdmin !== 'undefined') ? isAdmin : false;

  // Only subscribe once
  subscribeToChatMessages();

  // Only load if chat tab is visible or when first opened
  const chatView = document.getElementById('view-chat');
  if (chatView && chatView.classList.contains('active')) {
    await loadMessages('general');
  }

  // Wire up input
  const input = document.getElementById('chatInput');
  if (input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
      if (e.key === 'Escape') closeMentionDropdown();
    });
    input.addEventListener('input', chatMentionHandler);
  }

  chatInitialised = true;
}

// ── OPEN CHAT TAB — load messages on demand ───
// Called from switchTab when chat is selected
function onChatTabOpen() {
  if (!chatInitialised) { initChat(); return; }
  // Reload messages fresh when tab is opened
  loadMessages(currentChannel);
}

// ── CHANNEL SWITCH ────────────────────────────
async function switchChannel(channel) {
  if (channel === currentChannel) return;
  currentChannel = channel;
  document.getElementById('channelBtnGeneral')?.classList.toggle('active', channel === 'general');
  document.getElementById('channelBtnSupport')?.classList.toggle('active', channel === 'support');
  const desc = document.getElementById('chatChannelDesc');
  if (desc) desc.textContent = channel === 'general'
    ? 'Open community chat for all residents'
    : 'Private channel — messages seen by crew team';
  if (channel === 'support') document.getElementById('chatBadge')?.classList.remove('show');
  await loadMessages(channel);
}

// ── LOAD MESSAGES — called once per channel switch ──
async function loadMessages(channel) {
  const el = document.getElementById('chatMessages');
  if (!el) return;
  el.innerHTML = '<div class="chat-loading">Loading messages…</div>';

  const { data, error } = await window.sbClient
    .from('chat_messages')
    .select('*')
    .eq('channel', channel)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) {
    el.innerHTML = '<div class="chat-loading">Could not load messages. Please try again.</div>';
    return;
  }
  renderMessages(data || []);
}

// ── RENDER ALL ────────────────────────────────
function renderMessages(messages) {
  const el = document.getElementById('chatMessages');
  if (!el) return;
  if (!messages.length) {
    el.innerHTML = '<div class="chat-empty">No messages yet — be the first to say hello! 👋</div>';
    return;
  }
  let html = '';
  let lastDate = '';
  messages.forEach(msg => {
    const time = new Date(msg.created_at);
    const dateLabel = time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    if (dateLabel !== lastDate) {
      html += `<div class="chat-date-sep"><span>${dateLabel}</span></div>`;
      lastDate = dateLabel;
    }
    html += buildMsgHTML(msg);
  });
  el.innerHTML = html;
  scrollChatToBottom();
}

// ── BUILD ONE MESSAGE ─────────────────────────
function buildMsgHTML(msg) {
  const isOwn = msg.user_email === chatUserEmail;
  const isCrew = msg.is_crew;
  const time = new Date(msg.created_at);
  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const name = chatEscape(msg.display_name || msg.user_email?.split('@')[0] || 'Resident');

  let reactions = {};
  try { reactions = msg.reactions ? JSON.parse(msg.reactions) : {}; } catch(e) {}

  const formattedMsg = msg.message
    ? chatEscape(msg.message).replace(/@(\w+)/g, '<span class="chat-mention">@$1</span>')
    : '';

  const reactionBar = Object.keys(reactions).length
    ? `<div class="chat-reaction-bar">${Object.entries(reactions).map(([emoji, users]) =>
        `<button class="chat-reaction-pill ${Array.isArray(users) && users.includes(chatUserEmail) ? 'reacted' : ''}"
          onclick="toggleReaction('${msg.id}','${emoji}')">
          ${emoji} <span>${Array.isArray(users) ? users.length : 0}</span>
        </button>`).join('')}</div>` : '';

  return `<div class="chat-msg ${isOwn ? 'chat-msg-own' : ''} ${isCrew ? 'chat-msg-crew' : ''}" id="chat-msg-${msg.id}">
    ${!isOwn ? `<div class="chat-msg-avatar">${name.charAt(0).toUpperCase()}</div>` : ''}
    <div class="chat-msg-body">
      ${!isOwn ? `<div class="chat-msg-name">${name}${isCrew ? ' <span class="chat-crew-badge">Crew</span>' : ''}</div>` : ''}
      ${msg.image_data ? `<div class="chat-msg-image"><img src="${msg.image_data}" alt="image" onclick="openChatImage(this.src)"></div>` : ''}
      ${formattedMsg ? `<div class="chat-msg-bubble">${formattedMsg}</div>` : ''}
      ${reactionBar}
      <div class="chat-msg-footer">
        <span class="chat-msg-time">${timeStr}</span>
        <div class="chat-msg-actions">
          <button class="chat-react-btn" onclick="showReactionPicker('${msg.id}',this)">😊</button>
        </div>
      </div>
    </div>
  </div>`;
}

// ── SEND ──────────────────────────────────────
async function sendChatMessage() {
  if (!window.sbClient) return;
  const input = document.getElementById('chatInput');
  const message = input?.value.trim();
  if (!message && !pendingImageDataURL) return;

  const sendBtn = document.getElementById('chatSendBtn');
  if (sendBtn) sendBtn.disabled = true;
  const msgText = message;
  if (input) input.value = '';
  const imgData = pendingImageDataURL;
  clearImagePreview();
  closeMentionDropdown();

  chatIsAdmin = (typeof isAdmin !== 'undefined') ? isAdmin : false;
  const displayName = chatUserEmail.split('@')[0] || 'Resident';

  const { error } = await window.sbClient.from('chat_messages').insert([{
    channel: currentChannel,
    message: msgText || '',
    user_email: chatUserEmail,
    display_name: displayName,
    is_crew: chatIsAdmin,
    reactions: '{}',
    image_data: imgData || null
  }]);

  if (sendBtn) sendBtn.disabled = false;
  if (error) {
    console.error('Send error:', error);
    if (typeof showToast === 'function') showToast('Failed to send — please try again');
    if (input) input.value = msgText;
  }
}

// ── SUBSCRIBE — INSERT only, append only ──────
function subscribeToChatMessages() {
  if (!window.sbClient) return;

  // Kill any existing subscription first
  if (chatSubscription) {
    try { window.sbClient.removeChannel(chatSubscription); } catch(e) {}
    chatSubscription = null;
  }

  chatSubscription = window.sbClient
    .channel('vv_chat_v2')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages'
    }, payload => {
      const msg = payload.new;
      if (!msg) return;
      if (msg.channel === currentChannel) {
        // Only append if not already in the DOM — no reload
        if (!document.getElementById('chat-msg-' + msg.id)) {
          appendMessage(msg);
        }
      } else {
        // Badge for other channel
        document.getElementById('chatBadge')?.classList.add('show');
      }
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'chat_messages'
    }, payload => {
      const msg = payload.new;
      if (!msg) return;
      // Only update the specific message element — no reload
      const el = document.getElementById('chat-msg-' + msg.id);
      if (el) {
        const tmp = document.createElement('div');
        tmp.innerHTML = buildMsgHTML(msg);
        el.replaceWith(tmp.firstElementChild);
      }
    })
    .subscribe();
}

// ── APPEND ONE NEW MESSAGE ─────────────────────
function appendMessage(msg) {
  const el = document.getElementById('chatMessages');
  if (!el) return;
  const placeholder = el.querySelector('.chat-empty, .chat-loading');
  if (placeholder) placeholder.remove();
  const tmp = document.createElement('div');
  tmp.innerHTML = buildMsgHTML(msg);
  const node = tmp.firstElementChild;
  if (node) el.appendChild(node);
  scrollChatToBottom();
}

// ── IMAGE UPLOAD ──────────────────────────────
function handleChatImageSelect(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  if (file.size > 10 * 1024 * 1024) { if (typeof showToast === 'function') showToast('Image must be under 10MB'); return; }

  const reader = new FileReader();
  reader.onload = e => {
    // Compress image to max 800px and quality 0.7 before storing
    const img = new Image();
    img.onload = () => {
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      pendingImageDataURL = canvas.toDataURL('image/jpeg', 0.7);
      const preview = document.getElementById('chatImagePreview');
      if (preview) {
        preview.innerHTML = `<div class="chat-img-preview-wrap"><img src="${pendingImageDataURL}" alt="preview"><button class="chat-img-remove" onclick="clearImagePreview()">✕</button></div>`;
        preview.style.display = 'block';
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  input.value = '';
}

function clearImagePreview() {
  pendingImageDataURL = null;
  const preview = document.getElementById('chatImagePreview');
  if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }
}

function openChatImage(src) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer';
  overlay.innerHTML = `<img src="${src}" style="max-width:95vw;max-height:95vh;border-radius:8px;object-fit:contain">`;
  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}

// ── @MENTION ──────────────────────────────────
function chatMentionHandler(e) {
  const val = e.target.value;
  const cursor = e.target.selectionStart;
  const match = val.slice(0, cursor).match(/@(\w*)$/);
  if (match) {
    const query = match[1].toLowerCase();
    const matches = chatMembers.filter(m => m.name.toLowerCase().startsWith(query));
    if (matches.length) { showMentionDropdown(matches, match[1]); return; }
  }
  closeMentionDropdown();
}

function showMentionDropdown(matches, query) {
  let dd = document.getElementById('mentionDropdown');
  if (!dd) { dd = document.createElement('div'); dd.id = 'mentionDropdown'; dd.className = 'mention-dropdown'; document.getElementById('chatComposer')?.appendChild(dd); }
  dd.innerHTML = matches.slice(0,5).map(m =>
    `<div class="mention-item" onmousedown="insertMention('${m.name}','${query}')">
      <span class="mention-avatar">${m.name.charAt(0).toUpperCase()}</span>@${m.name}
    </div>`).join('');
  dd.style.display = 'block';
}

function insertMention(name, query) {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const cursor = input.selectionStart;
  const before = input.value.slice(0, cursor).replace(new RegExp('@' + query + '$'), '@' + name + ' ');
  const after = input.value.slice(cursor);
  input.value = before + after;
  input.focus();
  input.selectionStart = input.selectionEnd = before.length;
  closeMentionDropdown();
}

function closeMentionDropdown() {
  const dd = document.getElementById('mentionDropdown');
  if (dd) dd.style.display = 'none';
}

// ── REACTIONS ─────────────────────────────────
function showReactionPicker(msgId, btn) {
  document.querySelectorAll('.reaction-picker').forEach(p => p.remove());
  const picker = document.createElement('div');
  picker.className = 'reaction-picker';
  picker.innerHTML = REACTIONS.map(e =>
    `<button onclick="toggleReaction('${msgId}','${e}');this.closest('.reaction-picker').remove()">${e}</button>`
  ).join('');
  btn.parentElement.style.position = 'relative';
  btn.parentElement.appendChild(picker);
  setTimeout(() => {
    document.addEventListener('click', function h(e) {
      if (!picker.contains(e.target) && e.target !== btn) { picker.remove(); document.removeEventListener('click', h); }
    });
  }, 100);
}

async function toggleReaction(msgId, emoji) {
  if (!window.sbClient) return;
  const { data, error } = await window.sbClient.from('chat_messages').select('reactions').eq('id', msgId).single();
  if (error) return;
  let reactions = {};
  try { reactions = data.reactions ? JSON.parse(data.reactions) : {}; } catch(e) {}
  if (!reactions[emoji]) reactions[emoji] = [];
  const idx = reactions[emoji].indexOf(chatUserEmail);
  if (idx > -1) { reactions[emoji].splice(idx, 1); if (!reactions[emoji].length) delete reactions[emoji]; }
  else reactions[emoji].push(chatUserEmail);
  await window.sbClient.from('chat_messages').update({ reactions: JSON.stringify(reactions) }).eq('id', msgId);
}

// ── HELPERS ───────────────────────────────────
function scrollChatToBottom() {
  const el = document.getElementById('chatMessages');
  if (el) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
}

function chatEscape(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// ── GLOBALS ───────────────────────────────────
window.initChat = initChat;
window.onChatTabOpen = onChatTabOpen;
window.switchChannel = switchChannel;
window.sendChatMessage = sendChatMessage;
window.handleChatImageSelect = handleChatImageSelect;
window.clearImagePreview = clearImagePreview;
window.openChatImage = openChatImage;
window.toggleReaction = toggleReaction;
window.showReactionPicker = showReactionPicker;
window.insertMention = insertMention;
