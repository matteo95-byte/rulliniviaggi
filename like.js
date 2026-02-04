import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

const photoId = "fiore_yfh2db";
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
