
const FEED_URL = "https://flat-violet-3772egypt-by-mosta-photos.mostaa-hassan.workers.dev/";

const photosContainer = document.getElementById("photos");
const statusMessage = document.getElementById("feed-status");
const isStoriesPage = false;

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

let allPhotos = [];
let currentIndex = 0;
let displayedCount = 0;
let lightboxIndex = 0;

const PAGE_SIZE = 9;

function renderPhoto(photo) {
  if (!photo.image_url || !photosContainer) return;

  const card = document.createElement("article");
  card.className = "photo-card";

  const image = document.createElement("img");
  image.src = photo.image_url +
    (photo.image_url.includes("?") ? "&" : "?") +
    "v=" + Date.now();

  image.alt = photo.caption || "Egypt By Mosta photo";
  image.loading = "lazy";

  const caption = document.createElement("p");
  caption.textContent = photo.caption || "A moment from Egypt.";

  card.appendChild(image);
  card.appendChild(caption);
  photosContainer.appendChild(card);
}

function renderPhotos(photos) {
  if (!photosContainer) return;

  photosContainer.innerHTML = "";
  photos.forEach(renderPhoto);
}

function updateHomePhotos() {
  if (!allPhotos.length) return;

  const visiblePhotos = [];

  for (let i = 0; i < Math.min(3, allPhotos.length); i++) {
    visiblePhotos.push(allPhotos[(currentIndex + i) % allPhotos.length]);
  }

  renderPhotos(visiblePhotos);

  if (allPhotos.length > 3) {
    currentIndex = (currentIndex + 1) % allPhotos.length;
  }
}

function loadMorePhotos() {
  if (!photosContainer) return;

  const nextPhotos = allPhotos.slice(
    displayedCount,
    displayedCount + PAGE_SIZE
  );

  nextPhotos.forEach(renderPhoto);
  displayedCount += nextPhotos.length;

  const button = document.getElementById("load-more");

  if (button && displayedCount >= allPhotos.length) {
    button.style.display = "none";
  }
}

async function loadPhotos() {
  try {
    const response = await fetch(FEED_URL);

    if (!response.ok) {
      throw new Error("Feed unavailable");
    }

    const data = await response.json();
    allPhotos = Array.isArray(data.photos) ? data.photos : [];

    const collage = document.getElementById("hero-collage");

    if (collage) {
      collage.innerHTML = "";

      allPhotos.slice(0, 3).forEach((photo) => {
        if (!photo.image_url) return;

        const img = document.createElement("img");
        img.src = photo.image_url +
          (photo.image_url.includes("?") ? "&" : "?") +
          "v=" + Date.now();

        img.alt = "Egypt By Mosta";
        img.loading = "eager";
        collage.appendChild(img);
      });
    }

    if (!allPhotos.length) {
      if (photosContainer) {
        photosContainer.innerHTML = "<p>No photos available yet.</p>";
      }
      return;
    }

    if (isStoriesPage) {
      if (photosContainer) {
        photosContainer.innerHTML = "";
      }

      displayedCount = 0;
      loadMorePhotos();

      const button = document.getElementById("load-more");

      if (button && displayedCount < allPhotos.length) {
        button.style.display = "inline-block";
      }
    } else {
      updateHomePhotos();

      if (allPhotos.length > 3) {
        setInterval(updateHomePhotos, 8000);
      }
    }

     } catch (error) {
    console.error("Error loading Egypt By Mosta stories:", error);

    if (statusMessage) {
      statusMessage.textContent =
        "Follow Egypt By Mosta on Facebook for the latest updates.";
    }
  }
}
if (photosContainer) {
  loadPhotos();
}

// Image Lightbox
const lightbox = document.createElement("div");
lightbox.id = "image-lightbox";

lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close">&times;</button>
  <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
  <img class="lightbox-image" src="" alt="Egypt By Mosta">
  <button class="lightbox-next" aria-label="Next">&#10095;</button>
`;

Object.assign(lightbox.style, {
  display: "none",
  position: "fixed",
  inset: "0",
  background: "rgba(0,0,0,0.95)",
  zIndex: "100000",
  alignItems: "center",
  justifyContent: "center"
});

document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".lightbox-image");

Object.assign(lightboxImage.style, {
  maxWidth: "90%",
  maxHeight: "85%",
  objectFit: "contain"
});

function showLightbox(index) {
  if (!allPhotos.length) return;

  lightboxIndex = (index + allPhotos.length) % allPhotos.length;

  lightboxImage.src = allPhotos[lightboxIndex].image_url;
  lightboxImage.alt = allPhotos[lightboxIndex].caption || "Egypt By Mosta";

  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.style.display = "none";
  document.body.style.overflow = "";
}

function changeLightbox(direction) {
  showLightbox(lightboxIndex + direction);
}

if (photosContainer) {
  photosContainer.addEventListener("click", (event) => {
    const clickedImage = event.target.closest(".photo-card img");
    if (!clickedImage) return;

    const index = allPhotos.findIndex(photo =>
      clickedImage.src.startsWith(photo.image_url)
    );

    if (index !== -1) showLightbox(index);
  });
}

lightbox.querySelector(".lightbox-close").onclick = closeLightbox;
lightbox.querySelector(".lightbox-prev").onclick = () => changeLightbox(-1);
lightbox.querySelector(".lightbox-next").onclick = () => changeLightbox(1);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (lightbox.style.display !== "flex") return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") changeLightbox(1);
  if (event.key === "ArrowLeft") changeLightbox(-1);
});
