document.addEventListener("DOMContentLoaded", () => {
  // Smooth Scroll
  const navLinks = document.querySelectorAll("nav a[href^='#']");
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Theme Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "☀️ Light Mode";
  }

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Expand/Collapse Tutorials
  const toggles = document.querySelectorAll(".toggle-btn");
  toggles.forEach(button => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      content?.classList.toggle("active");
      button.textContent = content?.classList.contains("active") ? "Hide" : "Read More";
    });
  });

  // Charts: filter chips + search + count
  const chips = document.querySelectorAll(".chart-toolbar .chip");
  const cards = Array.from(document.querySelectorAll(".chart-card"));
  const searchInput = document.getElementById("chartSearch");
  const countEl = document.getElementById("chartCount");

  let activeFilter = "all";
  let query = "";

function matches(card) {
  const tags = (card.dataset.tags || "").split(",");
  const byTag = activeFilter === "all" || tags.includes(activeFilter);
  if (query.trim() === "") return byTag;
  const cap = card.querySelector("figcaption")?.textContent?.toLowerCase() || "";
  const alt = card.querySelector("img")?.alt?.toLowerCase() || "";
  const q = query.toLowerCase();
  return byTag && (cap.includes(q) || alt.includes(q));
}

function applyFilters() {
  let shown = 0;
  cards.forEach(card => {
    const show = matches(card);
    card.style.display = show ? "" : "none";
    if (show) shown++;
  });
  if (countEl) countEl.textContent = `${shown} result${shown === 1 ? "" : "s"}`;
}

// init count
applyFilters();

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => {
      c.classList.remove("is-active");
      c.setAttribute("aria-pressed", "false");
    });
    chip.classList.add("is-active");
    chip.setAttribute("aria-pressed", "true");
    activeFilter = chip.dataset.filter || "all";
    applyFilters();
  });
});

searchInput?.addEventListener("input", (e) => {
  query = e.target.value || "";
  applyFilters();
});

// Charts: enhanced lightbox with prev/next + keyboard & focus return
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeBtn = document.querySelector(".lightbox-close");
const prevBtn = document.querySelector(".lightbox-prev");
const nextBtn = document.querySelector(".lightbox-next");

// Build an ordered list of images for navigation
const galleryImgs = cards.map(card => card.querySelector("img")).filter(Boolean);
let currentIndex = -1;
let lastFocusedEl = null;

function openAt(index) {
  const img = galleryImgs[index];
  if (!img) return;
  currentIndex = index;
  const full = img.getAttribute("data-full") || img.src;
  const caption = img.closest("figure")?.querySelector("figcaption")?.textContent?.trim() || img.alt || "";
  if (lightboxImg) lightboxImg.src = full;
  if (lightboxCaption) lightboxCaption.textContent = caption;
  lightbox?.classList.add("open");
  lightbox?.setAttribute("aria-hidden", "false");
  nextBtn?.focus();
}

function closeLightbox() {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  if (lightboxImg) lightboxImg.src = "";
  if (lightboxCaption) lightboxCaption.textContent = "";
  currentIndex = -1;
  lastFocusedEl?.focus();
}

function showPrev() {
  // find previous visible card
  let i = currentIndex;
  for (let step = 0; step < galleryImgs.length; step++) {
    i = (i - 1 + galleryImgs.length) % galleryImgs.length;
    if (galleryImgs[i]?.closest("figure")?.style.display !== "none") {
      openAt(i);
      return;
    }
  }
}

function showNext() {
  // find next visible card
  let i = currentIndex;
  for (let step = 0; step < galleryImgs.length; step++) {
    i = (i + 1) % galleryImgs.length;
    if (galleryImgs[i]?.closest("figure")?.style.display !== "none") {
      openAt(i);
      return;
    }
  }
}

document.addEventListener("click", (e) => {
  // open from click on image
  const imgEl = e.target.closest?.(".chart-card img");
  if (imgEl) {
    lastFocusedEl = imgEl;
    const idx = galleryImgs.indexOf(imgEl);
    if (idx > -1) openAt(idx);
  }
  // backdrop click closes
  if (e.target === lightbox) closeLightbox();
});

// Keyboard open on Enter/Space for focused images
document.addEventListener("keydown", (e) => {
  const focusedImg = document.activeElement?.closest?.(".chart-card")?.querySelector("img");
  if ((e.key === "Enter" || e.key === " ") && focusedImg && document.activeElement === focusedImg) {
    e.preventDefault();
    lastFocusedEl = focusedImg;
    const idx = galleryImgs.indexOf(focusedImg);
    if (idx > -1) openAt(idx);
  }
});

closeBtn?.addEventListener("click", closeLightbox);
prevBtn?.addEventListener("click", showPrev);
nextBtn?.addEventListener("click", showNext);

document.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});

// Videos: render grid from YouTube links
const videoGrid = document.getElementById("videoGrid");

// Add links + titles here
const videoItems = [
  { url: "https://youtu.be/f1gl2rg-o68", title: "Rob Smith STRAT Basics: What is #TheSTRAT" },
  { url: "https://youtu.be/JBshY9fNvNo", title: "Quant Edge Introduction to the 3 Universal Scenarios" },
  { url: "https://youtu.be/fEGr0D8HwzM", title: "Using TheStrat to Day Trade" },
  { url: "https://youtu.be/IBpGbmpb9N8", title: "The Best Way To Read & Master Candlesticks - PT. 1" },
  { url: "https://youtu.be/onVE7QdV0lk", title: "The Best Way To Read & Master Candlesticks - PT.2" },
  { url: "https://www.youtube.com/live/uUvdpzSWgTU?si=aH2z8ZLozHSR9O_y", title: "AdexTrades Beginner's & Charting Q&A" },
  { url: "https://www.youtube.com/live/uUxNP4XScJ0?si=bajExh9gSEWiC9Ha", title: "Learn #TheStrat in one video" },
];

function parseYouTube(u) {
  try {
    const url = new URL(u);
    const host = url.hostname.replace(/^www\./, "");
    const list = url.searchParams.get("list") || null;

    // 1) Try standard ?v=
    let id = url.searchParams.get("v");

    // 2) youtu.be/<id>[...]
    if (!id && host === "youtu.be") {
      id = url.pathname.slice(1).split(/[/?&#]/)[0];
    }

    // 3) /shorts/<id>[...]
    if (!id && url.pathname.includes("/shorts/")) {
      id = url.pathname.split("/shorts/")[1]?.split(/[/?&#]/)[0];
    }

    // 4) /embed/<id>[...]
    if (!id && url.pathname.includes("/embed/")) {
      id = url.pathname.split("/embed/")[1]?.split(/[/?&#]/)[0];
    }

    // 5) /live/<id>[...]  (note: some live URLs are /live/<id>; some are /live without id)
    if (!id && url.pathname.includes("/live/")) {
      id = url.pathname.split("/live/")[1]?.split(/[/?&#]/)[0];
    }

    return { id: id || null, list };
  } catch {
    return { id: null, list: null };
  }
}

function thumbFor(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// --- Only-one-video + pause/close helpers ---
let currentPlaying = null; // { card, embed, thumb }

function stopCurrentVideo() {
  if (!currentPlaying) return;
  const { embed, thumb } = currentPlaying;
  // Remove the iframe and bring the thumbnail back
  embed?.remove();
  if (thumb) thumb.style.removeProperty("display");
  currentPlaying = null;
}

function buildCard({ url, title }) {
  const { id, list } = parseYouTube(url);
  const card = document.createElement("article");
  card.className = "video-card";

  const thumb = document.createElement("div");
  thumb.className = "video-thumb";
  thumb.setAttribute("role", "button");
  thumb.setAttribute("tabindex", "0");
  thumb.setAttribute("aria-label", `Play video: ${title}`);

  const img = document.createElement("img");
  img.loading = "lazy";
  if (id) {
    img.src = thumbFor(id);
    img.alt = title;
  } else {
    img.alt = `${title} (playlist)`;
    img.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'>
        <rect width='100%' height='100%' fill='black'/>
        <text x='50%' y='50%' fill='white' font-size='42' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>Playlist</text>
        </svg>`
    );
  }
  thumb.appendChild(img);

  const playBtn = document.createElement("button");
  playBtn.className = "play-btn";
  playBtn.setAttribute("aria-label", `Play ${title}`);
  playBtn.textContent = "Play";
  thumb.appendChild(playBtn);

  const meta = document.createElement("div");
  meta.className = "video-meta";
  meta.innerHTML = `<h3>${title}</h3>`;

function startPlayback() {
    // if this card is already playing, toggle it off
    if (currentPlaying && currentPlaying.card === card) {
      stopCurrentVideo();
      return;
    }

    // Stop any other playing video
    stopCurrentVideo();

  const wrap = document.createElement("div");
  wrap.className = "video-embed";

  // Build the embed URL with autoplay + playsinline
  const params = new URLSearchParams({ rel: "0", autoplay: "1", playsinline: "1" });
  let src;

  if (list && !id) {
    // Playlist only
    src = `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(list)}&${params}`;
  } else if (list && id) {
    // Video within playlist
    src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?list=${encodeURIComponent(list)}&${params}`;
  } else if (id) {
    // Single video
    src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`;
  } else {
    window.open(url, "_blank");
    return;
  }

  // Create iframe with autoplay allowed
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.title = title;
  iframe.loading = "lazy";
  iframe.allow =
    "autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;

  wrap.appendChild(iframe);

// Insert player before the title/meta; hide the thumbnail
const meta = card.querySelector(".video-meta");
thumb.style.display = "none";
card.insertBefore(wrap, meta);

// Optional: move keyboard focus into the player so Space/Arrow keys work immediately
iframe.setAttribute("tabindex", "-1");
iframe.focus({ preventScroll: true });

// Tell the global stopper what's playing now
currentPlaying = { card, embed: wrap, thumb };
}

  thumb.addEventListener("click", startPlayback);
  thumb.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); startPlayback(); }
  });

  card.appendChild(thumb);
  card.appendChild(meta);
  return card;
}

if (videoGrid && Array.isArray(videoItems)) {
  videoGrid.classList.add("video-grid");
  videoItems.forEach(item => videoGrid.appendChild(buildCard(item)));
}

// Close when clicking anywhere outside the Videos grid
document.addEventListener("click", (e) => {
  if (!videoGrid) return;
  if (currentPlaying && !videoGrid.contains(e.target)) {
    stopCurrentVideo();
  }
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") stopCurrentVideo();
});

// Close when navigating away via the top nav
document.querySelectorAll('nav a[href^="#"]').forEach((a) => {
  a.addEventListener("click", () => {
    const href = a.getAttribute("href");
    if (href !== "#videos") stopCurrentVideo();
  });
});

// Close when the Videos section leaves the viewport
const videosSection = document.getElementById("videos");
if (videosSection) {
  const vidsObs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) stopCurrentVideo();
  }, { threshold: 0 });
  vidsObs.observe(videosSection);
}

// Downloadable PDFs
const pdfGrid = document.getElementById("pdfGrid");

// Optional fallback (used if the page is opened as file:// or fetch fails)
const fallbackPdfs = [
  { file: "THESTRAT-Guide.pdf", title: "TheStrat Guide", desc: "A guide explaining TheStrat concepts, setups and scenarios." },
  { file: "Scenario-1.pdf", title: "Scenario 1", desc: "More information about the Scenario 1: Inside bar." },
  { file: "Scenario-2.pdf", title: "Scenario 2", desc: "More information about the Scenario 2: Directional bar." },
  { file: "Scenario-3.pdf", title: "Scenario 3", desc: "More information about the Scenario 3: Outside bar." },
  { file: "Options-Greeks-Made-Simple.pdf", title: "Options Greeks Made Simple", desc: "A brief explanation about Options Greeks." },
  { file: "10-days-to-successful-options-trading.pdf", title: "10 Days to Successful Options Trading", desc: "A more in-depth guide to trading options successfully." }
];

function renderPdfs(items) {
  if (!pdfGrid) return;
  pdfGrid.textContent = "";
  items
    .slice() // don’t mutate original
    .sort((a, b) => a.title.localeCompare(b.title))
    .forEach(({ file, title, desc }) => {
      const card = document.createElement("article");
      card.className = "pdf-card";
      const href = `files/${encodeURIComponent(file)}`;
      card.innerHTML = `
        <h3>${title}</h3>
        <p>${desc || ""}</p>
        <a class="pdf-btn" href="${href}" download>⬇️ Download</a>
      `;
      pdfGrid.appendChild(card);
    });
}

async function loadPdfs() {
  if (!pdfGrid) return;

  // If opened directly from disk, skip fetch and use fallback to prevent CORS errors
  if (location.protocol === "file:") {
    //console.warn("Running from file:// — skipping JSON fetch and using fallback list.");
    renderPdfs(fallbackPdfs);
    return;
  }

  try {
    const res = await fetch("./files/index.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    renderPdfs(items);
  } catch (err) {
    console.error("PDF manifest load failed:", err);
    // Fallback UI
    const msg = document.createElement("p");
    msg.style.color = "crimson";
    msg.textContent = "Couldn’t load the PDF list. Showing a local fallback.";
    pdfGrid.appendChild(msg);
    renderPdfs(fallbackPdfs);
  }
}

loadPdfs();

// Section highlight in nav
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
        activeLink?.classList.add("active");
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));
});