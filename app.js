const charInput = document.getElementById("charName");
const loginBtn = document.getElementById("login");
const charSection = document.getElementById("charSection");
const charInfo = document.getElementById("charInfo");
const createFleetBtn = document.getElementById("createFleet");
const fleetList = document.getElementById("fleetList");

let currentChar = null;

// Giriş yap (karakteri bul)
loginBtn.addEventListener("click", async () => {
  const name = charInput.value.trim();
  if (!name) return alert("Lütfen karakter adını yaz!");

  try {
    // EVE ESI arama API
    const res = await fetch(`https://esi.evetech.net/latest/search/?categories=character&search=${encodeURIComponent(name)}&strict=true`);
    const data = await res.json();

    if (!data.character || data.character.length === 0) {
      alert("Karakter bulunamadı!");
      return;
    }

    const charId = data.character[0];
    currentChar = { id: charId, name };

    // Karakteri göster
    charInfo.innerHTML = `
      <img src="https://images.evetech.net/characters/${charId}/portrait?size=128" alt="Portrait" />
      <p>${name}</p>
    `;

    document.getElementById("loginSection").style.display = "none";
    charSection.style.display = "block";

    // LocalStorage'a kaydet
    localStorage.setItem("currentChar", JSON.stringify(currentChar));
  } catch (err) {
    console.error(err);
    alert("Karakter bilgisi alınamadı!");
  }
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
    charInfo.innerHTML = `
      <img src="https://images.evetech.net/characters/${currentChar.id}/portrait?size=128" alt="Portrait" />
      <p>${currentChar.name}</p>
    `;
    document.getElementById("loginSection").style.display = "none";
    charSection.style.display = "block";
  }
  renderFleets();
});
