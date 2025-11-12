import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.post("/token", async (req, res) => {
  const { code } = req.body;
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("redirect_uri", REDIRECT_URI);

    const response = await axios.post(
      "https://login.eveonline.com/v2/oauth/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.json({ access_token: response.data.access_token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Token alınamadı" });
  }
});

app.post("/character", async (req, res) => {
  const { access_token } = req.body;
  try {
    const charRes = await axios.get(
      "https://esi.evetech.net/latest/verify/",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    res.json({
      character_id: charRes.data.CharacterID,
      character_name: charRes.data.CharacterName
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Karakter bilgisi alınamadı" });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Backend running on port", process.env.PORT || 3000)
);
