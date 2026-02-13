import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* -------------------- FIREBASE -------------------- */

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

/* -------------------- ARRAY FOTO -------------------- */

let photos = [
  { id: "fiore_yfh2db", url: "https://res.cloudinary.com/dim73lhdw/image/upload/v1770160997/fiore_yfh2db.png", destination: "Ascoli" },
  { id: "benito_shjdqg", url: "https://res.cloudinary.com/dim73lhdw/image/upload/v1770334313/benito_shjdqg.png", destination: "Sanmarco" }
];

/* -------------------- SELEZIONI HTML -------------------- */

const gallery = document.getElementById("gallery");
const filtersDiv = document.getElementById("filters");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const bigHeart = document.getElementById("bigHeart");
const fullscreenLikeCount = document.getElementById("fullscreenLikeCount");
const prevZone = document.getElementById("prevZone");
const nextZone = document.getElementById("nextZone");
const closeBtn = document.getElementById("closeLightbox");
const overlay = document.getElementById("overlay");

let currentIndex = 0;

/* -------------------- ANIMAZIONE BIG HEART -------------------- */

function animateBigHeart() {
  bigHeart.classList.remove("pop-in");
  void bigHeart.offsetWidth;
  bigHeart.classList.add("pop-in");

  // Scomparsa automatica dopo animazione
  setTimeout(() => {
    bigHeart.classList.remove("pop-in");
  }, 600); // durata animazione pop-in
}

/* -------------------- AGGIORNA CONTATORE FULLSCREEN -------------------- */

async function updateFullscreenLike(photoId) {
  const snap = await getDoc(doc(db, "likes", photoId));
  const count = snap.exists() ? snap.data().count : 0;
  const liked = localStorage.getItem(photoId) === "true";
  fullscreenLikeCount.textContent = count + " " + (liked ? "❤️" : "🤍");
}

/* -------------------- TOGGLE LIKE -------------------- */

async function toggleLike(photoId) {
  const liked = localStorage.getItem(photoId) === "true";

  // Aggiorna Firebase
  await updateDoc(doc(db, "likes", photoId), {
    count: increment(liked ? -1 : 1)
  });

  // Aggiorna localStorage
  if (liked) localStorage.removeItem(photoId);
  else localStorage.setItem(photoId, "true");

  // Aggiorna UI dei bottoni nella gallery
  document.querySelectorAll(".photo").forEach(div => {
    const btn = div.querySelector(".likeBtn");
    const heartEl = div.querySelector(".heart");
    const countEl = div.querySelector(".likeCount");
    if (btn && btn.dataset.photoId === photoId) {
      getDoc(doc(db, "likes", photoId)).then(snap => {
        if (snap.exists()) countEl.textContent = snap.data().count;
      });
      heartEl.textContent = liked ? "🤍" : "❤️";
    }
  });

  // Aggiorna fullscreen se aperto
  if (lightbox.classList.contains("active") && lightboxImg.dataset.id === photoId) {
    if (!liked) animateBigHeart(); // mostra cuore solo quando aggiunge like
    updateFullscreenLike(photoId);
  }
}

/* -------------------- INIZIALIZZAZIONE LIKE BUTTON -------------------- */

async function initLikeButton(div, photoId) {
  const btn = div.querySelector(".likeBtn");
  const heartEl = div.querySelector(".heart");
  const countEl = div.querySelector(".likeCount");

  async function loadLikes() {
    const snap = await getDoc(doc(db, "likes", photoId));
    countEl.textContent = snap.exists() ? snap.data().count : "0";
    heartEl.textContent = localStorage.getItem(photoId) === "true" ? "❤️" : "🤍";
  }

  btn.onclick = async () => {
    await toggleLike(photoId);
  };

  loadLikes();
}

/* -------------------- FILTRI -------------------- */

function createFilters() {
  filtersDiv.innerHTML = "";
  const destinations = ["all", ...new Set(photos.map(p => p.destination))];

  destinations.forEach(dest => {
    const btn = document.createElement("button");
    btn.textContent = dest === "all" ? "Tutte" : dest;
    btn.onclick = () => filterDestination(dest);
    filtersDiv.appendChild(btn);
  });
}

function filterDestination(dest) {
  document.querySelectorAll(".photo").forEach(div => {
    div.style.display =
      (dest === "all" || div.dataset.destination === dest)
        ? "block"
        : "none";
  });
}

/* -------------------- LIGHTBOX -------------------- */

function openLightbox(index) {
  currentIndex = index;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
  updateImage();
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "auto";
}

function updateImage(direction = null) {
  if (direction) {
    lightboxImg.classList.remove("slide-left", "slide-right");
    void lightboxImg.offsetWidth;
    lightboxImg.classList.add(direction === "next" ? "slide-left" : "slide-right");
  }

  lightboxImg.src = photos[currentIndex].url;
  lightboxImg.dataset.id = photos[currentIndex].id;

  updateFullscreenLike(photos[currentIndex].id);
}

function showNext() {
  currentIndex = (currentIndex + 1) % photos.length;
  updateImage("next");
}

function showPrev() {
  currentIndex = (currentIndex - 1 + photos.length) % photos.length;
  updateImage("prev");
}

nextZone.addEventListener("click", showNext);
prevZone.addEventListener("click", showPrev);
closeBtn.addEventListener("click", closeLightbox);
overlay.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "Escape") closeLightbox();
});

/* -------------------- DOUBLE CLICK FULLSCREEN -------------------- */

lightbox.addEventListener("dblclick", () => {
  const currentPhotoId = lightboxImg.dataset.id;
  toggleLike(currentPhotoId);
});

/* -------------------- CREAZIONE GALLERY -------------------- */

async function createGallery() {
  gallery.innerHTML = "";
  createFilters();

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];

    const div = document.createElement("div");
    div.classList.add("photo");
    div.dataset.destination = photo.destination;

    div.innerHTML = `
      <img src="${photo.url}">
      <button class="likeBtn" aria-label="Mi piace" data-photo-id="${photo.id}">
        <span class="heartWrapper"><span class="heart">🤍</span></span>
        <span class="likeCount">0</span>
      </button>
    `;

    gallery.appendChild(div);

    // 👉 apertura lightbox
    div.querySelector("img").addEventListener("click", () => {
      openLightbox(i);
    });

    const docRef = doc(db, "likes", photo.id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) await setDoc(docRef, { count: 0 });

    initLikeButton(div, photo.id);
  }
}

/* -------------------- AVVIO -------------------- */

createGallery();

