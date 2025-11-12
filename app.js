const charIdInput = document.getElementById("charIdInput");
const charNameInput = document.getElementById("charNameInput");
const charPasswordInput = document.getElementById("charPasswordInput");
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
  const password = charPasswordInput.value.trim();

  if (!id || !name || !password) return alert("Lütfen tüm alanları doldurun!");
  if (!/^\d+$/.test(id)) return alert("ID sadece rakamlardan oluşmalıdır!");

  const storedPassword = localStorage.getItem(`pw_${id}`);
  if (storedPassword && storedPassword !== password) {
    return alert("Şifre hatalı!");
  } else if (!storedPassword) {
    localStorage.setItem(`pw_${id}`, password);
  }

  currentChar = { id, name };

  const portraitUrl = `https://images.evetech.net/characters/${id}/portrait?size=128`;

  charInfo.innerHTML = `
    <img src="${portraitUrl}" alt="Portrait" onerror="this.src='https://via.placeholder.com/128?text=No+Image';" />
    <p>${name}</p>
  `;

  document.getElementById("loginSection").style.display = "none";
  charSection.style.display = "block";

  localStorage.setItem("currentChar", JSON.stringify(currentChar));
  renderFleets();
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

// Fleetleri listele ve silme butonu ekle
function renderFleets() {
  const fleets = JSON.parse(localStorage.getItem("fleets") || "[]");
  fleetList.innerHTML = fleets.map(fleet => `
    <li>
      <img src="https://images.evetech.net/characters/${fleet.charId}/portrait?size=32" alt="Portrait" onerror="this.src='https://via.placeholder.com/32?text=No';" />
      <b>${fleet.owner}</b> - ${fleet.created}
      ${fleet.owner === currentChar.name ? `<button class="deleteBtn" data-id="${fleet.id}">Sil</button>` : ''}
    </li>
  `).join("");

  // Sil butonları için event listener
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const fleets = JSON.parse(localStorage.getItem("fleets") || "[]");
      const filtered = fleets.filter(f => f.id != btn.dataset.id);
      localStorage.setItem("fleets", JSON.stringify(filtered));
      renderFleets();
    });
  });
}

// Sayfa yüklendiğinde kayıtlı karakter ve fleetleri yükle
window.addEventListener("load", () => {
  const savedChar = localStorage.getItem("currentChar");
  if (savedChar) {
    currentChar = JSON.parse(savedChar);
    const portraitUrl = `https://images.evetech.net/characters/${currentChar.id}/portrait?size=128`;

    charInfo.innerHTML = `
      <img src="${portraitUrl}" alt="Portrait" onerror="this.src='https://via.placeholder.com/128?text=No+Image';" />
      <p>${currentChar.name}</p>
    `;
    document.getElementById("loginSection").style.display = "none";
    charSection.style.display = "block";
  }
  renderFleets();
});
