const charIdInput = document.getElementById("charIdInput");
const charNameInput = document.getElementById("charNameInput");
const loginBtn = document.getElementById("login");
const charSection = document.getElementById("charSection");
const charInfo = document.getElementById("charInfo");
const createFleetBtn = document.getElementById("createFleet");
const fleetList = document.getElementById("fleetList");

let currentChar = null;

// Giriş yap
loginBtn.addEventListener("click", () => {
  const id = charIdInput.value.trim();
  const name = charNameInput.value.trim();

  if (!id || !name) return alert("Lütfen hem ID hem isim girin!");
  if (!/^\d+$/.test(id)) return alert("ID sadece rakamlardan oluşmalıdır!");

  currentChar = { id, name };

  // Portreyi direkt ESI API üzerinden göster
  const portraitUrl = `https://images.evetech.net/characters/${id}/portrait?size=128`;

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
    charId: currentChar.id,
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
      <img src="https://images.evetech.net/characters/${fleet.charId}/portrait?size=32" alt="">
      <b>${fleet.owner}</b> - ${fleet.created}
    </li>
  `).join("");
}

// Sayfa yüklendiğinde kayıtlı karakter ve fleetleri yükle
window.addEventListener("load", () => {
  const savedChar = localStorage.getItem("currentChar");
  if (savedChar) {
    currentChar = JSON.parse(savedChar);
    const portraitUrl = `https://images.evetech.net/characters/${currentChar.id}/portrait?size=128`;

    charInfo.innerHTML = `
      <img src="${portraitUrl}" alt="Portrait" />
      <p>${currentChar.name}</p>
    `;
    document.getElementById("loginSection").style.display = "none";
    charSection.style.display = "block";
  }
  renderFleets();
});
