const BACKEND_URL = "https://mymnfleet.onrender.com"; // Render backend adresin

document.getElementById("login").addEventListener("click", () => {
  const redirectUri = "https://pixchunk.github.io/mymnfleet/index.html"; // GitHub Pages adresin
  const clientId = "34085e73f00243c5bd9cdbd12e8dfc5b";
  const scope = "publicData";

  window.location.href = `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}&scope=${scope}`;
});

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

if (code) {
  handleSSO(code);
}

async function handleSSO(code) {
  document.getElementById("loading").style.display = "block";
  try {
    // 1️⃣ Token al
    const tokenRes = await fetch(`${BACKEND_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const tokenData = await tokenRes.json();
    const access_token = tokenData.access_token;
    if (!access_token) throw new Error("Token alınamadı");

    // 2️⃣ Karakter bilgisi al
    const charRes = await fetch(`${BACKEND_URL}/character`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token }),
    });

    const character = await charRes.json();

    document.getElementById("login").style.display = "none";
    document.getElementById("loading").style.display = "none";
    document.getElementById("charInfo").innerHTML = `
      <img src="https://images.evetech.net/characters/${character.CharacterID}/portrait?size=128" alt="Portrait" />
      <h2>${character.CharacterName}</h2>
    `;
  } catch (err) {
    document.getElementById("loading").style.display = "none";
    alert("SSO girişinde hata oluştu!");
    console.error(err);
  }
}
