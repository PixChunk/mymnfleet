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
const db = getDatabase(app);
const statusRef = ref(db, "fleetStatus");

const statusDiv = document.getElementById("status");

// Firebase’den veri oku ve göster
onValue(statusRef, (snapshot) => {
  const data = snapshot.val();
  if (data === true) {
    statusDiv.textContent = "Fleet AKTİF 🚀";
    statusDiv.classList.remove("text-red-500");
    statusDiv.classList.add("text-green-500");
  } else if (data === false) {
    statusDiv.textContent = "Fleet YOK ❌";
    statusDiv.classList.remove("text-green-500");
    statusDiv.classList.add("text-red-500");
  } else {
    statusDiv.textContent = "Durum bilinmiyor…";
    statusDiv.classList.remove("text-green-500", "text-red-500");
  }
});
