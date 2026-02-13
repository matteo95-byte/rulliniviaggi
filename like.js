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
const prevZone = document.getElementById("prevZone");
const nextZone = document.getElementById("nextZone");
const closeBtn = document.getElementById("closeLightbox");
const overlay = document.getElementById("overlay");

let currentIndex = 0;

/* -------------------- LIKE BUTTON -------------------- */

async function initLikeButton(div, photoId) {
  const btn = div.querySelector(".likeBtn");
  const heartEl = div.querySelector(".heart");
  const heartWrapper = div.querySelector(".heartWrapper");
  const countEl = div.querySelector(".likeCount");

  function isLiked() { return localStorage.getItem(photoId) === "true"; }
  function setLikedUI(liked) { heartEl.textContent = liked ? "❤️" : "🤍"; }

  async function loadLikes() {
    const snap = await getDoc(doc(db, "likes", photoId));
    countEl.textContent = snap.exists() ? snap.data().count : "0";
    setLikedUI(isLiked());
  }

  btn.onclick = async () => {
    await toggleLike(photoId, heartWrapper);
  };

  loadLikes();
}

/* -------------------- FUNZIONE TOGGLE LIKE -------------------- */

async function toggleLike(photoId, heartWrapper = null) {
  const liked = localStorage.getItem(photoId) === "true";

  // Aggiorna Firebase
  await updateDoc(doc(db, "likes", photoId), {
    count: increment(liked ? -1 : 1)
  });

  // Aggiorna localStorage
  if (liked) localStorage.removeItem(photoId);
  else localStorage.setItem(photoId, "true");

  // Aggiorna UI dei bottoni se heartWrapper fornito
  if (heartWrapper) {
    heartWrapper.classList.remove("pop");
    void heartWrapper.offsetWidth;
    heartWrapper.classList.add("pop");
  }

  // Aggiorna lightbox se è la foto corrente
  if (lightbox.classList.contains("active") && photos[currentIndex].id === photoId) {
    animateBigHeart(!liked);
  }

  // Aggiorna conteggio like
  const divs = document.querySelectorAll(".photo");
  divs.forEach(div => {
    if (div.querySelector(".likeBtn") && div.querySelector(".likeBtn").dataset.photoId === photoId) {
      const countEl = div.querySelector(".likeCount");
      getDoc(doc(db, "likes", photoId)).then(snap => {
        if (snap.exists()) countEl.textContent = snap.data().count;
      });
      const heartEl = div.querySelector(".heart");
      if (heartEl) heartEl.textContent = !liked ? "❤️" : "🤍";
    }
  });
}

/* -------------------- ANIMAZIONE BIG HEART -------------------- */

function animateBigHeart(like = true) {
  bigHeart.classList.remove("pop-in", "pop-out");
  void bigHeart.offsetWidth;

  if (like) bigHeart.classList.add("pop-in");
  else bigHeart.classList.add("pop-out");
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

/* -------------------- DOUBLE CLICK PER LIKE -------------------- */

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
