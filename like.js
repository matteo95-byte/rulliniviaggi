import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ---- FIREBASE ----
const firebaseConfig = {
  apiKey: "AIzaSyA9-cVNzBlVOElttIDI39Zjkuf4JKOjEdY",
  authDomain: "viaggi-analogici.firebaseapp.com",
  projectId: "viaggi-analogici",
  storageBucket: "viaggi-analogici.firebasestorage.app",
  messagingSenderId: "9701288769",
  appId: "1:9701288769:web:c8e8b3db272823dafe8fc0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---- ARRAY FOTO ----
const photos = [
  { id: "fiore_yfh2db", url: "https://res.cloudinary.com/dim73lhdw/image/upload/v1770160997/fiore_yfh2db.png", destination: "Roma" },
  { id: "mare_ab123", url: "https://res.cloudinary.com/dim73lhdw/image/upload/v1770160997/mare_ab123.png", destination: "Sardegna" },
  { id: "montagna_cd456", url: "https://res.cloudinary.com/dim73lhdw/image/upload/v1770160997/montagna_cd456.png", destination: "Dolomiti" },

  // puoi aggiungere qui nuove foto, il documento Firebase sarà creato automaticamente
  { id: "lago_ef789", url: "https://res.cloudinary.com/dim73lhdw/image/upload/v1770160997/lago_ef789.png", destination: "Lago di Como" }
];

// ---- GALLERY ----
const gallery = document.getElementById("gallery");

// ---- FUNZIONE INIZIALIZZA LIKE ----
async function initLikeButton(div, photoId) {
  const btn = div.querySelector(".likeBtn");
  const heartEl = div.querySelector(".heart");
  const heartWrapper = div.querySelector(".heartWrapper");
  const countEl = div.querySelector(".likeCount");

  function isLiked() {
    return localStorage.getItem(photoId) === "true";
  }

  functi



