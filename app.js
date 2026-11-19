
const FEED_URL = "https://flat-violet-3772egypt-by-mosta-photos.mostaa-hassan.workers.dev/";

const photosContainer = document.getElementById("photos");
const statusMessage = document.getElementById("feed-status");
const isStoriesPage = document.body.dataset.page === "stories";

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

let allPhotos = [];
let currentIndex = 0;
let displayedCount = 0;

const PAGE_SIZE = 9;

function renderPhoto(photo) {
  if (!photo.image_url) return;

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
    allPhotos = data.photos || [];

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
      photosContainer.innerHTML = "<p>No photos available yet.</p>";
      return;
    }

    if (isStoriesPage) {
      photosContainer.innerHTML = "";
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
    photosContainer.innerHTML =
      "<p>Stories are temporarily unavailable. Please visit our Facebook page.</p>";

    if (statusMessage) {
      statusMessage.textContent =
        "Follow Egypt By Mosta on Facebook for the latest updates.";
    }
  }
}

if (photosContainer) {
  loadPhotos();
}

const loadMoreButton = document.getElementById("load-more");

if (loadMoreButton) {
  loadMoreButton.addEventListener("click", loadMorePhotos);
}
