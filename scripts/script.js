const whatsappNumber = "5551995888855";
const copyPixButton = document.querySelector("[data-copy-pix]");
const pixKey = document.querySelector("#pix-key")?.textContent?.trim();
const prayerForm = document.querySelector("[data-prayer-form]");
const albumTabs = document.querySelector("[data-album-tabs]");
const photoGrid = document.querySelector("[data-photo-grid]");
const galleryCount = document.querySelector("[data-gallery-count]");
const galleryEmpty = document.querySelector("[data-gallery-empty]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrevious = document.querySelector("[data-lightbox-previous]");
const lightboxNext = document.querySelector("[data-lightbox-next]");

let galleryAlbums = [];
let selectedAlbumIndex = null;
let selectedPhotoIndex = 0;

copyPixButton?.addEventListener("click", async () => {
  if (!pixKey) return;

  try {
    await navigator.clipboard.writeText(pixKey);
    copyPixButton.textContent = "Chave copiada";
  } catch {
    copyPixButton.textContent = pixKey;
  }

  window.setTimeout(() => {
    copyPixButton.textContent = "Copiar chave Pix";
  }, 2200);
});

prayerForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(prayerForm);
  const name = formData.get("name")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!message) return;

  const text = [
    "Olá, vim pelo site da Lagoinha São Leopoldo.",
    name ? `Meu nome é ${name}.` : "",
    "Gostaria de deixar um pedido de oração:",
    message,
  ]
    .filter(Boolean)
    .join("\n\n");

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
});

const formatDate = (dateValue) => {
  const [year, month, day] = dateValue.split("-");

  if (!year || !month || !day) return dateValue;

  return `${day}/${month}/${year}`;
};

const renderAlbumTabs = () => {
  if (!albumTabs) return;

  albumTabs.innerHTML = "";

  galleryAlbums.forEach((album, index) => {
    const photos = album.photos ?? [];
    const coverPhoto = photos[0];
    const button = document.createElement("button");
    button.className = "album-card";
    button.type = "button";
    button.setAttribute(
      "aria-label",
      `${index === 0 ? "Último culto, " : ""}${formatDate(album.date)}, ${photos.length} ${
        photos.length === 1 ? "foto" : "fotos"
      }`
    );
    button.setAttribute("aria-selected", String(index === selectedAlbumIndex));
    button.setAttribute("aria-expanded", String(index === selectedAlbumIndex));

    if (coverPhoto) {
      const image = document.createElement("img");
      image.src = coverPhoto.src;
      image.alt = "";
      image.loading = index === 0 ? "eager" : "lazy";
      button.append(image);
    }

    const details = document.createElement("span");
    details.className = "album-card-details";

    if (index === 0) {
      const badge = document.createElement("span");
      badge.className = "album-card-badge";
      badge.textContent = "Último culto";
      details.append(badge);
    }

    const date = document.createElement("strong");
    date.textContent = formatDate(album.date);

    const meta = document.createElement("span");
    meta.textContent = `${photos.length} ${photos.length === 1 ? "foto" : "fotos"}`;

    details.append(date, meta);
    button.append(details);

    button.addEventListener("click", () => {
      selectedAlbumIndex = index;
      selectedPhotoIndex = 0;
      renderGallery();
      openLightbox(0);
    });

    albumTabs.append(button);
  });
};

const renderPhotos = () => {
  if (!photoGrid || !galleryEmpty || !galleryCount) return;

  const album = galleryAlbums[selectedAlbumIndex];
  const photos = album?.photos ?? [];

  photoGrid.innerHTML = "";
  photoGrid.hidden = true;

  if (selectedAlbumIndex === null) {
    galleryEmpty.hidden = false;
    galleryEmpty.textContent = "Escolha um culto e relembre esse momento.";
    galleryCount.textContent = `${galleryAlbums.length} ${galleryAlbums.length === 1 ? "culto" : "cultos"}`;
    return;
  }

  galleryEmpty.hidden = true;
  galleryEmpty.textContent = "Nenhuma foto encontrada para este álbum.";
  galleryCount.textContent = `${photos.length} ${photos.length === 1 ? "foto" : "fotos"}`;
};

const renderGallery = () => {
  renderAlbumTabs();
  renderPhotos();
};

const showLightboxPhoto = () => {
  if (!lightboxImage) return;

  const album = galleryAlbums[selectedAlbumIndex];
  const photo = album?.photos?.[selectedPhotoIndex];

  if (!photo) return;

  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt || `Foto do culto em ${formatDate(album.date)}`;
};

const openLightbox = (photoIndex) => {
  if (!lightbox) return;

  selectedPhotoIndex = photoIndex;
  showLightboxPhoto();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose?.focus();
};

const closeLightbox = () => {
  if (!lightbox) return;

  lightbox.hidden = true;
  document.body.style.overflow = "";
};

const moveLightbox = (direction) => {
  const photos = galleryAlbums[selectedAlbumIndex]?.photos ?? [];

  if (!photos.length || lightbox?.hidden) return;

  selectedPhotoIndex =
    (selectedPhotoIndex + direction + photos.length) % photos.length;
  showLightboxPhoto();
};

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrevious?.addEventListener("click", () => moveLightbox(-1));
lightboxNext?.addEventListener("click", () => moveLightbox(1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (lightbox?.hidden) return;

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    moveLightbox(-1);
  }

  if (event.key === "ArrowRight") {
    moveLightbox(1);
  }
});

const loadGallery = async () => {
  if (!albumTabs || !photoGrid) return;

  try {
    const response = await fetch("./data/gallery.json");

    if (!response.ok) {
      throw new Error("Galeria indisponível");
    }

    const albums = await response.json();
    galleryAlbums = albums
      .filter((album) => Array.isArray(album.photos) && album.photos.length)
      .sort((first, second) => second.date.localeCompare(first.date));

    renderGallery();
  } catch {
    if (galleryEmpty) {
      galleryEmpty.hidden = false;
      galleryEmpty.textContent = "Não foi possível carregar as fotos.";
    }
  }
};

loadGallery();
