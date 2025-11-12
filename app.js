import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// 🔹 Firebase bilgilerini buraya yaz
const firebaseConfig = {
  apiKey: "AIzaSyDb_8138o6_rPY_-zUH4MgZXWnjb5c2NEk",
  authDomain: "mymn-3949b.firebaseapp.com",
  databaseURL: "https://mymn-3949b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mymn-3949b",
  storageBucket: "mymn-3949b.firebasestorage.app",
  messagingSenderId: "407180149461",
  appId: "1:407180149461:web:0b7de3f295b3a180e4985c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Kullanıcı ID
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = "user_" + Date.now() + "_" + Math.floor(Math.random()*1000);
  localStorage.setItem("userId", userId);
}

const ADMIN_PASSWORD = "1234";

const fleetsRef = ref(db, "fleets");
const fleetList = document.getElementById("fleetList");
const fleetNameInput = document.getElementById("fleetName");
const addFleetBtn = document.getElementById("addFleetBtn");

// Fleet listeleme
onValue(fleetsRef, (snapshot) => {
  fleetList.innerHTML = "";
  const data = snapshot.val();
  if (data) {
    Object.entries(data).forEach(([key, fleet]) => {
      const li = document.createElement("li");
      li.classList.add("flex", "justify-between", "items-center", "mb-2", "px-3", "py-2", "rounded");

      // Arka plan rengi: aktif → yeşil, pasif → gri
      if (fleet.active) {
        li.classList.add("bg-green-600", "text-white", "font-bold");
      } else {
        li.classList.add("bg-gray-800", "text-white");
      }

      // Fleet bilgileri: isim, ekleyen, eklenme zamanı
      const infoDiv = document.createElement("div");
      infoDiv.classList.add("flex", "flex-col");

      const nameSpan = document.createElement("span");
      nameSpan.textContent = fleet.name;
      nameSpan.classList.add("font-semibold");

      const creatorSpan = document.createElement("span");
      creatorSpan.textContent = "Ekleyen: " + fleet.creator;
      creatorSpan.classList.add("text-sm", "text-gray-200");

      const timeSpan = document.createElement("span");
      const date = new Date(Number(key));
      timeSpan.textContent = "Eklenme: " + date.toLocaleString();
      timeSpan.classList.add("text-sm", "text-gray-200");

      infoDiv.appendChild(nameSpan);
      infoDiv.appendChild(creatorSpan);
      infoDiv.appendChild(timeSpan);

      li.appendChild(infoDiv);

      // Silme butonu
      const delBtn = document.createElement("button");
      delBtn.textContent = "Sil";
      delBtn.classList.add("ml-4", "px-2", "py-1", "bg-red-600", "rounded", "hover:bg-red-700", "btn-glow");
      delBtn.addEventListener("click", () => {
        if (fleet.creator === userId) {
          if (confirm(`"${fleet.name}" silinsin mi?`)) {
            const fleetRef = ref(db, "fleets/" + key);
            set(fleetRef, null);
          }
        } else {
          const pass = prompt("Admin şifresi (fleet silmek için):");
          if (pass === ADMIN_PASSWORD) {
            if (confirm(`"${fleet.name}" silinsin mi?`)) {
              const fleetRef = ref(db, "fleets/" + key);
              set(fleetRef, null);
            }
          } else {
            alert("Sadece oluşturucu veya admin silebilir!");
          }
        }
      });

      li.appendChild(delBtn);
      fleetList.appendChild(li);
    });
  }
});

// Yeni fleet ekleme
addFleetBtn.addEventListener("click", () => {
  const name = fleetNameInput.value.trim();
  if (!name) return;
  const newFleetRef = ref(db, "fleets/" + Date.now());
  set(newFleetRef, { name, creator: userId, active: true });
  fleetNameInput.value = "";
});
