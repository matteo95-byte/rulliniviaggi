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

  function setLikedUI(liked) {
    heartEl.textContent = liked ? "❤️" : "🤍";
  }

  // ---- CARICA LIKE ----
  async function loadLikes() {
    const snap = await getDoc(doc(db, "likes", photoId));
    countEl.textContent = snap.exists() ? snap.data().count : "0";
    setLikedUI(isLiked());
  }

  // ---- CLICK LIKE ----
  btn.onclick = async () => {
    const liked = isLiked();

    if (liked) {
      await updateDoc(doc(db, "likes", photoId), { count: increment(-1) });
      localStorage.removeItem(photoId);
      setLikedUI(false);
    } else {
      await updateDoc(doc(db, "likes", photoId), { count: increment(1) });
      localStorage.setItem(photoId, "true");
      setLikedUI(true);
    }

    // animazione pop
    heartWrapper.classList.remove("pop");
    void heartWrapper.offsetWidth; // forza reflow
    heartWrapper.classList.add("pop");

    loadLikes();
  };

  loadLikes();
}

// ---- CREAZIONE FOTO ----
photos.forEach(async photo => {
  const div = document.createElement("div");
  div.classList.add("photo");
  div.dataset.destination = photo.destination;

  div.innerHTML = `
    <img src="${photo.url}" width="90%">
    <button class="likeBtn" aria-label="Mi piace">
      <span class="heartWrapper"><span class="heart">🤍</span></span>
      <span class="likeCount">0</span>
    </button>
  `;

  gallery.appendChild(div);

  // ---- CREA DOCUMENTO FIREBASE SE NON ESISTE ----
  const docRef = doc(db, "likes", photo.id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    await setDoc(docRef, { count: 0 });
  }

  initLikeButton(div, photo.id);
});

// ---- FILTRO DESTINAZIONE ----
window.filterDestination = function(dest) {
  document.querySelectorAll(".photo").forEach(div => {
    div.style.display = (dest === "all" || div.dataset.destination === dest) ? "block" : "none";
  });
};




