// app.js — EVE-styled login + password enforced + fleets (localStorage)
// Important: saved character DOES NOT auto-login. Password required.

const charIdInput = document.getElementById("charIdInput");
const charNameInput = document.getElementById("charNameInput");
const charPasswordInput = document.getElementById("charPasswordInput");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");

const charSection = document.getElementById("charSection");
const charInfo = document.getElementById("charInfo");
const preview = document.getElementById("charPreview");
const previewImg = document.getElementById("previewImg");
const previewName = document.getElementById("previewName");
const previewId = document.getElementById("previewId");

const createFleetBtn = document.getElementById("createFleet");
const fleetNameInput = document.getElementById("fleetNameInput");
const fleetList = document.getElementById("fleetList");

let currentChar = null;

// --- Utility funcs
function showPreview(character){
  if(!character) { preview.style.display='none'; return; }
  const portrait = `https://images.evetech.net/characters/${character.id}/portrait?size=128`;
  previewImg.src = portrait;
  previewImg.onerror = () => { previewImg.src = 'https://via.placeholder.com/128?text=No+Image'; };
  previewName.textContent = character.name;
  previewId.textContent = `ID: ${character.id}`;
  preview.style.display = 'flex';
}

function saveCurrentChar(){
  if(currentChar) localStorage.setItem('currentChar', JSON.stringify(currentChar));
  else localStorage.removeItem('currentChar');
}

// --- Login flow
loginBtn.addEventListener('click', () => {
  const id = charIdInput.value.trim();
  const name = charNameInput.value.trim();
  const pw = charPasswordInput.value.trim();

  if(!id || !name || !pw){
    return alert('Lütfen ID, isim ve şifre girin.');
  }
  if(!/^\d+$/.test(id)) return alert('ID sadece rakamlardan oluşmalıdır.');

  // check stored password for this ID
  const storedPw = localStorage.getItem(`pw_${id}`);
  if(storedPw){
    if(storedPw !== pw) {
      return alert('Şifre hatalı!');
    }
    // password ok -> login
  } else {
    // first time for this ID: ask confirm to save password
    // store password (simple demo)
    localStorage.setItem(`pw_${id}`, pw);
  }

  // set currentChar
  currentChar = { id, name };
  saveCurrentChar();

  // update UI
  charIdInput.value = id;
  charNameInput.value = name;
  charPasswordInput.value = '';
  loginBtn.style.display = 'none';
  logoutBtn.style.display = 'inline-block';

  // show preview + charSection
  showPreview(currentChar);
  charSection.style.display = 'block';
  renderFleets();
});

// logout
logoutBtn.addEventListener('click', () => {
  currentChar = null;
  saveCurrentChar();
  preview.style.display = 'none';
  charSection.style.display = 'none';
  loginBtn.style.display = 'inline-block';
  logoutBtn.style.display = 'none';
  charPasswordInput.value = '';
  // clear fields? keep id/name for convenience:
  // charIdInput.value = '';
  // charNameInput.value = '';
});

// create fleet
createFleetBtn.addEventListener('click', () => {
  const name = (fleetNameInput.value || '').trim();
  if(!currentChar) return alert('Önce giriş yapın.');
  if(!name) return alert('Fleet adı girin.');

  const fleets = JSON.parse(localStorage.getItem('fleets') || '[]');
  const newFleet = {
    id: Date.now().toString(),
    owner: currentChar.name,
    ownerId: currentChar.id,
    title: name,
    created: new Date().toLocaleString()
  };
  fleets.unshift(newFleet); // newest first
  localStorage.setItem('fleets', JSON.stringify(fleets));
  fleetNameInput.value = '';
  renderFleets();
});

// render fleets with delete button only for owner (requires currentChar)
function renderFleets(){
  const fleets = JSON.parse(localStorage.getItem('fleets') || '[]');
  fleetList.innerHTML = fleets.map(f => {
    const portrait = `https://images.evetech.net/characters/${f.ownerId}/portrait?size=32`;
    const canDelete = currentChar && String(currentChar.id) === String(f.ownerId);
    return `
      <li data-id="${f.id}">
        <img src="${portrait}" onerror="this.src='https://via.placeholder.com/32?text=No';" />
        <div>
          <div><b>${escapeHtml(f.title)}</b></div>
          <div class="meta">${escapeHtml(f.owner)} • ${f.created}</div>
        </div>
        ${canDelete ? `<button class="deleteBtn" data-id="${f.id}">Sil</button>` : ''}
      </li>
    `;
  }).join('');

  // attach delete handlers
  document.querySelectorAll('.deleteBtn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      const fleets = JSON.parse(localStorage.getItem('fleets') || '[]');
      const found = fleets.find(x=>x.id === id);
      if(!found) return;
      // double-check owner matches currentChar
      if(!currentChar || String(currentChar.id) !== String(found.ownerId)){
        return alert('Sadece oluşturucu silebilir.');
      }
      if(!confirm(`"${found.title}" silinsin mi?`)) return;
      const nf = fleets.filter(x=>x.id !== id);
      localStorage.setItem('fleets', JSON.stringify(nf));
      renderFleets();
    });
  });
}

// small escape helper
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

// --- on load: if saved currentChar exists, prefill id and name BUT DO NOT auto-login
window.addEventListener('load', ()=>{
  const saved = localStorage.getItem('currentChar');
  if(saved){
    try{
      const parsed = JSON.parse(saved);
      charIdInput.value = parsed.id || '';
      charNameInput.value = parsed.name || '';
      // show a preview hint (but hidden until login confirmed)
      // do a gentle preview (no login)
      previewImg.src = `https://images.evetech.net/characters/${parsed.id}/portrait?size=128`;
      previewImg.onerror = ()=>{ previewImg.src='https://via.placeholder.com/128?text=No+Image'; };
      previewName.textContent = parsed.name || '';
      previewId.textContent = `ID: ${parsed.id || ''}`;
      preview.style.display = 'flex';
      // but keep charSection hidden until password auth
      charSection.style.display = 'none';
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
    }catch(e){ console.warn('saved char parse err', e); }
  }
  renderFleets();
});
