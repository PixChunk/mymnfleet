const charInput = document.getElementById("charInput");
const loginBtn = document.getElementById("login");
const charSection = document.getElementById("charSection");
const charInfo = document.getElementById("charInfo");
const createFleetBtn = document.getElementById("createFleet");
const fleetList = document.getElementById("fleetList");

let currentChar = null;

// Giriş yap
loginBtn.addEventListener("click", async () => {
  const value = charInput.value.trim();
  if (!value) return alert("Lütfen karakter adı veya ID yaz!");

  let charId, charName;

  // Eğer sayı girilmişse direkt ID olarak kullan
  if (/^\d+$/.test(value)) {
    charId = value;
    charName = value; // Adı bilmesek ID’yi göster
  } else {
    // API ile karakter ID bul
    try {
      const res = await fetch(`https://esi.evetech.net/latest/search/?categories=character&search=${encodeURIComponent(value)}&strict=false`);
      const data = await res.json();

      if (!data.character || data.character.length === 0) {
        alert("Karakter bulunamadı!");
        return;
      }

      charId = data.character[0];
      charName = value;
    } catch (err) {
      console.error(err);
      return alert("Karakter bilgisi alınamadı!");
    }
  }

  currentChar = { id: charId, name: charName };

  // Karakteri göster
  charInfo.innerHTML = `
    <img src="https://images.evetech.net/characters/${charId}/portrait?size=128" alt="Portrait" />
    <p>${charName}</p>
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
    charInfo.innerHTML = `
      <img src="https://images.evetech.net/characters/${currentChar.id}/portrait?size=128" alt="Portrait" />
      <p>${currentChar.name}</p>
    `;
    document.getElementById("loginSection").style.display = "none";
    charSection.style.display = "block";
  }
  renderFleets();
});
