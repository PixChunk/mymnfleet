const charNameInput = document.getElementById("charNameInput");
const loginBtn = document.getElementById("login");
const charSection = document.getElementById("charSection");
const charInfo = document.getElementById("charInfo");
const createFleetBtn = document.getElementById("createFleet");
const fleetList = document.getElementById("fleetList");

let currentChar = null;

// Giriş yap
loginBtn.addEventListener("click", () => {
  const name = charNameInput.value.trim();
  if (!name) return alert("Lütfen karakter adını yaz!");

  currentChar = { name };

  // EVE Who portre URL'si
  const portraitUrl = `https://evewho.com/pilot/${encodeURIComponent(name)}/portrait`;

  charInfo.innerHTML = `
    <img src="${portraitUrl}" alt="Portrait" />
    <p>${name}</p>
  `;

  document.getElementById("loginSection").style.display = "none";
  charSection.style.display = "block";

  // LocalStorage'a kaydet
  localStorage.setItem("currentChar", JSON.stringify(currentChar));
});

// Fleet oluştur
createFleetBtn.addEventListener("click", () => {
  if (!currentChar) return;

  const fleets = JSON.parse(localStorage.getItem("fleets") || "[]");
  const newFleet = {
    id: Date.now(),
    owner: currentChar.name,
    created: new Date().toLocaleString()
  };

  fleets.push(newFleet);
  localStorage.setItem("fleets", JSON.stringify(fleets));
  renderFleets();
});

// Fleetleri listele
function renderFleets() {
  const fleets = JSON.parse(localStorage.getItem("fleets") || "[]");
  fleetList.innerHTML = fleets.map(fleet => `
    <li>
      <b>${fleet.owner}</b> - ${fleet.created}
    </li>
  `).join("");
}

// Sayfa yüklendiğinde kayıtlı karakter ve fleetleri yükle
window.addEventListener("load", () => {
  const savedChar = localStorage.getItem("currentChar");
  if (savedChar) {
    currentChar = JSON.parse(savedChar);
    const portraitUrl = `https://evewho.com/pilot/${encodeURIComponent(currentChar.name)}/portrait`;

    charInfo.innerHTML = `
      <img src="${portraitUrl}" alt="Portrait" />
      <p>${currentChar.name}</p>
    `;
    document.getElementById("loginSection").style.display = "none";
    charSection.style.display = "block";
  }
  renderFleets();
});
