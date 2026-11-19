const FEED_URL = "https://flat-violet-3772egypt-by-mosta-photos.mostaa-hassan.workers.dev/";

const photosContainer = document.getElementById("photos");
const statusMessage = document.getElementById("feed-status");

document.getElementById("year").textContent = new Date().getFullYear();

async function loadPhotos() {
  try {
    const response = await fetch(FEED_URL);

    if (!response.ok) {
      throw new Error("Feed unavailable");
    }

    const data = await response.json();
    const photos = data.photos || [];
const collage = document.getElementById("hero-collage");

if (collage) {
  collage.innerHTML = "";

  photos.slice(0, 3).forEach((photo) => {
    if (!photo.image_url) return;

    const img = document.createElement("img");
    img.src = photo.image_url + (photo.image_url.includes("?") ? "&" : "?") + "v=" + Date.now();
    img.alt = "Egypt By Mosta";
    img.loading = "eager";

    collage.appendChild(img);
  });
}
    photosContainer.innerHTML = "";

    if (photos.length === 0) {
      photosContainer.innerHTML = "<p>No photos available yet.</p>";
      return;
    }

    photos.forEach((photo) => {
      const card = document.createElement("article");
      card.className = "photo-card";

      const image = document.createElement("img");
      image.src = photo.image_url + (photo.image_url.includes("?") ? "&" : "?") + "v=" + Date.now();
      image.alt = photo.caption || "Egypt By Mosta photo";
      image.loading = "lazy";

      const caption = document.createElement("p");
      caption.textContent = photo.caption || "A moment from Egypt.";

      card.appendChild(image);
      card.appendChild(caption);
      photosContainer.appendChild(card);
    });
  } catch (error) {
    photosContainer.innerHTML = "<p>Stories are temporarily unavailable. Please visit our Facebook page.</p>";
    statusMessage.textContent = "Follow Egypt By Mosta on Facebook for the latest updates.";
  }
}

loadPhotos();
