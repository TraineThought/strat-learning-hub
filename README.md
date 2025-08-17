# Strat Learning Hub

**Strat Learning Hub** is a beginner-friendly resource to learn the basics of **TheStrat** trading strategy.  
It combines tutorials, interactive charts, videos, and downloadable PDFs into one streamlined site.

🌐 **Live Demo**: [trainethought.github.io](https://trainethought.github.io/strat-learning-hub/)

---

## 📚 Features

- **Tutorials Section**  
  Expandable lessons introducing TheStrat concepts, candlestick basics, scenarios, and price action.

- **Interactive Charts**  
  Filter by tag, search by name/description, and view charts in a **lightbox** with keyboard navigation.

- **Video Library**  
  Curated YouTube resources (autoplay embeds, one-at-a-time playback, and playlist support).

- **Downloads**  
  PDF guides, cheat sheets, and reference material.  
  - Files are auto-listed from `/files/index.json`  
  - Includes graceful fallback if JSON fails to load.

- **Dark/Light Mode**  
  Toggle with localStorage persistence.

- **Mobile-Friendly UI**  
  Responsive layout optimized for small screens. Smooth scroll + section highlighting in nav.

---

## 🛠️ Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript**
- **JSON** for PDF manifest
- **GitHub Pages** for hosting

---

## 📂 Project Structure

├── index.html          # Main entry page <br>
├── style.css           # Stylesheet <br>
├── script.js           # All interactive logic <br>
├── files/              # PDF files + index.json manifest <br>
│   ├── index.json <br>
│   ├── thestrat-guide.pdf <br>
│   └── … <br>
├── img/                # Images used in charts/tutorials <br>
└── README.md           # Project documentation

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>

2.	Serve locally (optional)
Open index.html directly in your browser or run a local server:

python -m http.server 8000


3.	Deploy
• Push changes to your main branch
• GitHub Pages automatically serves from /
• Accessible at https://<your-username>.github.io/<your-repo>

⸻

📖 How It Works <br>
• Tutorials: Each item has a toggle button (Read More / Hide).<br>
• Charts: Filtered via chips + search input. Count auto-updates.<br>
• Lightbox: Supports next/prev, keyboard arrows, and ESC to close.<br>
• Videos: Only one video plays at a time. Stops when section leaves viewport.<br>
• PDFs: Loaded dynamically from files/index.json. Sorted alphabetically.

⸻

🤝 Contributing

Contributions, suggestions, or fixes are welcome!
Feel free to open an issue or submit a pull request.

⸻

📜 License

This project is licensed under the MIT License – free to use, modify, and share.
