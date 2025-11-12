const BACKEND_URL = "https://YOUR_RENDER_BACKEND_URL"; // Render URL

document.getElementById("login").addEventListener("click", () => {
  window.location.href = `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=https://YOUR_FRONTEND_URL/index.html&client_id=YOUR_CLIENT_ID&scope=publicData`;
});

async function handleSSO(code) {
  const tokenRes = await fetch(`${BACKEND_URL}/token`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ code })
  });
  const { access_token } = await tokenRes.json();

  const charRes = await fetch(`${BACKEND_URL}/character`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ access_token })
  });
  const character = await charRes.json();
  console.log(character);
  // Fleet ekleme işlemi burada yapılacak
}