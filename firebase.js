// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb_8138o6_rPY_-zUH4MgZXWnjb5c2NEk",
  authDomain: "mymn-3949b.firebaseapp.com",
  databaseURL: "https://mymn-3949b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mymn-3949b",
  storageBucket: "mymn-3949b.firebasestorage.app",
  messagingSenderId: "407180149461",
  appId: "1:407180149461:web:0b7de3f295b3a180e4985c",
  measurementId: "G-9P45P9J5JE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const statusRef = ref(db, "fleetStatus");

// Sayfa tipine göre davran
if (window.location.pathname.includes("admin.html")) {
  const btn = document.getElementById("toggleBtn");
  const current = document.getElementById("currentStatus");

  onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    current.textContent = data ? "Fleet şu anda AKTİF 🚀" : "Fleet şu anda YOK ❌";
  });

  btn.addEventListener("click", async () => {
    const snapshot = await new Promise((res) => onValue(statusRef, res, { onlyOnce: true }));
    const currentVal = snapshot.val();
    await set(statusRef, !currentVal);
  });
} else {
  const status = document.getElementById("status");

  onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    status.textContent = data ? "Fleet şu anda AKTİF 🚀" : "Fleet şu anda YOK ❌";
  });
}