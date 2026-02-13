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
const prevZone = document.getElementById("prevZone");
const nextZone = document.getElementById("nextZone");
const closeLightbox = document.getElementById("closeLightbox");
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
    const liked = isLiked();

    await updateDoc(doc(db, "likes", photoId), {
      count: increment(liked ? -1 : 1)
    });

    if (liked) {
      localStorage.removeItem(photoId);
    } else {
      localStorage.setItem(photoId, "true");
    }

    heartWrapper.classList.remove("pop");
    void heartWrapper.offsetWidth;
    heartWrapper.classList.add("pop");

    loadLikes();
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
  lightboxImg.src = photos[curren]()
