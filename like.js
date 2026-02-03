import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// INCOLLA QUI IL BLOCCO DI CONFIGURAZIONE DI FIREBASE
const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const photoId = "foto1";
const likeRef = doc(db, "likes", photoId);

const countEl = document.getElementById("likeCount");
const btn = document.getElementById("likeBtn");

async function loadLikes() {
  const snap = await getDoc(likeRef);
  if (snap.exists()) {
    countEl.textContent = snap.data().count;
  }
}

btn.onclick = async () => {
  if (localStorage.getItem(photoId)) return;
  await updateDoc(likeRef, { count: increment(1) });
  localStorage.setItem(photoId, true);
  loadLikes();
};

loadLikes();
