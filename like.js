const photos = [
  { id: "fiore_yfh2db", url: "https://res.cloudinary.com/dim73lhdw/image/upload/v1770160997/fiore_yfh2db.png", destination: "Ascoli" },
  { id: "benito_shjdqg", url: "https://res.cloudinary.com/dim73lhdw/image/upload/v1770334313/benito_shjdqg.png", destination: "Sanmarco" },
  { id: "london_01", url: "https://res.cloudinary.com/dim73lhdw/image/upload/v1772767782/london_01.png", destination: "Londra" }
];

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
const likes = {}; // localStorage-style, senza Firebase per ora

function animateBigHeart() {
  bigHeart.classList.remove("pop-in");
  void bigHeart.offsetWidth;
  bigHeart.classList.add("pop-in");
  setTimeout(() => bigHeart.classList.remove("pop-in"), 600);
}

function updateFullscreenLike(photoId) {
  const count = likes[photoId] || 0;
  const liked = localStorage.getItem(photoId) === "true";
  fullscreenLikeCount.textContent = count + " " + (liked ? "❤️" : "🤍");
}

function toggleLike(photoId) {
  const liked = localStorage.getItem(photoId) === "true";
  localStorage.setItem(photoId, liked ? "false" : "true");
  likes[photoId] = (likes[photoId] || 0) + (liked ? -1 : 1);
  animateBigHeart();
  updateFullscreenLike(photoId);
  createGallery();
}

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
    div.style.display = (dest === "all" || div.dataset.destination === dest) ? "block" : "none";
  });
}

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

function updateImage() {
  lightboxImg.src = photos[currentIndex].url;
  lightboxImg.dataset.id = photos[currentIndex].id;
  updateFullscreenLike(photos[currentIndex].id);
}

function showNext() { currentIndex = (currentIndex + 1) % photos.length; updateImage(); }
function showPrev() { currentIndex = (currentIndex - 1 + photos.length) % photos.length; updateImage(); }

nextZone.onclick = showNext;
prevZone.onclick = showPrev;
closeBtn.onclick = closeLightbox;
overlay.onclick = closeLightbox;

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "Escape") closeLightbox();
});

lightbox.addEventListener("dblclick", () => toggleLike(lightboxImg.dataset.id));

function createGallery() {
  gallery.innerHTML = "";
  createFilters();

  photos.forEach((photo, i) => {
    const div = document.createElement("div");
    div.classList.add("photo");
    div.dataset.destination = photo.destination;

    const liked = localStorage.getItem(photo.id) === "true";
    const count = likes[photo.id] || 0;

    div.innerHTML = `
      <img src="${photo.url}" loading="lazy">
      <button class="likeBtn">
        <span class="heart">${liked ? "❤️" : "🤍"}</span>
        <span class="likeCount">${count}</span>
      </button>
    `;

    div.querySelector("img").onclick = () => openLightbox(i);
    div.querySelector("button").onclick = () => toggleLike(photo.id);

    gallery.appendChild(div);
  });
}

createGallery();
