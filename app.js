const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const fleetSection = document.getElementById("fleetSection");
const previewName = document.getElementById("previewName");
const fleetList = document.getElementById("fleetList");
const fleetNameInput = document.getElementById("fleetNameInput");
const fleetDescInput = document.getElementById("fleetDescInput");
const fleetStatusSelect = document.getElementById("fleetStatusSelect");
const addFleetBtn = document.getElementById("addFleetBtn");

let currentUser = null;

function saveCurrentUser(){
  if(currentUser){ localStorage.setItem('currentUser', JSON.stringify(currentUser)); }
}

function renderFleets(){
  const fleets = JSON.parse(localStorage.getItem("fleets")||"[]");
  fleetList.innerHTML = fleets.map(f=>{
    const canDelete = currentUser && currentUser.username === f.owner;
    return `<li class="${f.status}">
      <div><b>${f.title}</b></div>
      <div>${f.desc}</div>
      <div class="small">${f.owner} • ${f.status==="open"?"Açık":"Kapalı"} • ${f.created}</div>
      ${canDelete?`<button class="deleteBtn">Sil</button>`:""}
    </li>`;
  }).join("");

  document.querySelectorAll(".deleteBtn").forEach((btn,i)=>{
    btn.onclick = ()=>{
      const fleets = JSON.parse(localStorage.getItem("fleets")||"[]");
      const filtered = fleets.filter((f,j)=>i!==j || currentUser.username !== f.owner);
      localStorage.setItem("fleets", JSON.stringify(filtered));
      renderFleets();
    }
  });
}

loginBtn.addEventListener("click", ()=>{
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if(!username||!password){alert("Kullanıcı adı ve şifre girin!"); return;}

  let savedPw = localStorage.getItem(`pw_${username}`);
  if(!savedPw){ localStorage.setItem(`pw_${username}`, password); }
  else if(savedPw!==password){ alert("Şifre hatalı!"); return; }

  currentUser = {username};
  saveCurrentUser();

  loginBtn.style.display="none";
  logoutBtn.style.display="inline-block";
  fleetSection.style.display="block";
  previewName.textContent = username;

  usernameInput.value=""; passwordInput.value="";
  renderFleets();
});

logoutBtn.addEventListener("click", ()=>{
  currentUser=null;
  localStorage.removeItem('currentUser');
  loginBtn.style.display="inline-block";
  logoutBtn.style.display="none";
  fleetSection.style.display="none";
});

addFleetBtn.addEventListener("click", ()=>{
  if(!currentUser){alert("Önce giriş yapın"); return;}
  const title = fleetNameInput.value.trim();
  const desc = fleetDescInput.value.trim();
  const status = fleetStatusSelect.value;
  if(!title || !desc){alert("Fleet adı ve açıklama girin!"); return;}
  const fleets = JSON.parse(localStorage.getItem("fleets")||"[]");
  fleets.unshift({
    title,
    desc,
    status,
    owner: currentUser.username,
    created: new Date().toLocaleString()
  });
  localStorage.setItem("fleets", JSON.stringify(fleets));
  fleetNameInput.value=""; fleetDescInput.value="";
  renderFleets();
});

window.addEventListener("load", ()=>{
  const saved = localStorage.getItem("currentUser");
  if(saved){
    currentUser = JSON.parse(saved);
    loginBtn.style.display="none";
    logoutBtn.style.display="inline-block";
    fleetSection.style.display="block";
    previewName.textContent = currentUser.username;
  }
  renderFleets();
});
