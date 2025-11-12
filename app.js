const charIdInput = document.getElementById("charIdInput");
const charNameInput = document.getElementById("charNameInput");
const charPasswordInput = document.getElementById("charPasswordInput");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const charSection = document.getElementById("charSection");
const previewImg = document.getElementById("previewImg");
const previewName = document.getElementById("previewName");
const previewId = document.getElementById("previewId");
const fleetList = document.getElementById("fleetList");
const fleetNameInput = document.getElementById("fleetNameInput");
const fleetStatusSelect = document.getElementById("fleetStatusSelect");
const createFleetBtn = document.getElementById("createFleet");

let currentChar = null;

function showPreview(char){
  if(!char){document.getElementById("charPreview").style.display="none";return;}
  previewImg.src = `https://images.evetech.net/characters/${char.id}/portrait?size=128`;
  previewImg.onerror = ()=>{previewImg.src='https://via.placeholder.com/128?text=No';};
  previewName.textContent = char.name;
  previewId.textContent = `ID: ${char.id}`;
  document.getElementById("charPreview").style.display="flex";
}

function saveCurrentChar(){
  if(currentChar){ localStorage.setItem('currentChar', JSON.stringify(currentChar)); }
}

loginBtn.addEventListener("click", ()=>{
  const id = charIdInput.value.trim();
  const name = charNameInput.value.trim();
  const pw = charPasswordInput.value.trim();
  if(!id||!name||!pw){alert("Tüm alanları doldurun!");return;}
  if(!/^\d+$/.test(id)){alert("ID sadece rakam olmalı");return;}

  let savedPw = localStorage.getItem(`pw_${id}`);
  if(!savedPw){ localStorage.setItem(`pw_${id}`, pw); }
  else if(savedPw!==pw){ alert("Şifre hatalı!"); return; }

  currentChar = {id, name};
  saveCurrentChar();

  loginBtn.style.display="none";
  logoutBtn.style.display="inline-block";
  charSection.style.display="block";
  charIdInput.value="";charNameInput.value="";charPasswordInput.value="";
  showPreview(currentChar);
  renderFleets();
});

logoutBtn.addEventListener("click", ()=>{
  currentChar=null; localStorage.removeItem('currentChar');
  loginBtn.style.display="inline-block"; logoutBtn.style.display="none";
  charSection.style.display="none";
  charIdInput.value="";charNameInput.value="";charPasswordInput.value="";
});

createFleetBtn.addEventListener("click", ()=>{
  if(!currentChar){alert("Önce giriş yapın");return;}
  const name = fleetNameInput.value.trim();
  const status = fleetStatusSelect.value;
  if(!name){alert("Fleet adı girin");return;}
  const fleets = JSON.parse(localStorage.getItem("fleets")||"[]");
  fleets.unshift({
    id: Date.now().toString(),
    owner: currentChar.name,
    ownerId: currentChar.id,
    title: name,
    status: status,
    created: new Date().toLocaleString()
  });
  localStorage.setItem("fleets", JSON.stringify(fleets));
  fleetNameInput.value="";
  renderFleets();
});

function renderFleets(){
  const fleets = JSON.parse(localStorage.getItem("fleets")||"[]");
  fleetList.innerHTML = fleets.map(f=>{
    const canDelete = currentChar && String(currentChar.id)===String(f.ownerId);
    return `<li data-id="${f.id}" class="${f.status}">
      <img src="https://images.evetech.net/characters/${f.ownerId}/portrait?size=64" onerror="this.src='https://via.placeholder.com/64?text=No';">
      <div><b>${f.title}</b></div>
      <div class="small">${f.owner} • ${f.created} • ${f.status==="open"?"Açık":"Kapalı"}</div>
      ${canDelete?`<button class="deleteBtn" data-id="${f.id}">Sil</button>`:""}
    </li>`;
  }).join("");
  document.querySelectorAll(".deleteBtn").forEach(btn=>{
    btn.onclick = ()=>{
      const fleets = JSON.parse(localStorage.getItem("fleets")||"[]");
      const filtered = fleets.filter(f=>f.id!==btn.dataset.id);
      localStorage.setItem("fleets", JSON.stringify(filtered));
      renderFleets();
    }
  });
}

window.addEventListener("load", ()=>{
  const saved = localStorage.getItem("currentChar");
  if(saved){
    currentChar = JSON.parse(saved);
    showPreview(currentChar);
    loginBtn.style.display="none";
    logoutBtn.style.display="inline-block";
    charSection.style.display="block";
  }
  renderFleets();
});
