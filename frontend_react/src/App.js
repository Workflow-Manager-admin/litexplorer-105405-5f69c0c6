import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Utility: pseudo-random deterministic animation assignment per card on each render
function pickLivelyAnimation(idx) {
  const options = ['flipY', 'flipX', 'bounce', 'slide', 'rotate3D'];
  // Use mod so the animation selection stays consistent per card
  return options[idx % options.length];
}

function pickSubtleAnimation(idx) {
  // Subtle: fade, scale, light slide
  const options = ['subtle-fade', 'subtle-scale', 'subtle-slide'];
  return options[idx % options.length];
}

// Simple genre icon SVGs for demonstration
const GENRE_ICONS = {
  "Science Fiction": (
    <svg width="31" height="31" aria-label="sci-fi" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 31 31" fill="none"><circle cx="15.5" cy="15.5" r="13.5" fill="#6366f1" opacity="0.13"/><ellipse cx="15.5" cy="19" rx="7.5" ry="2.5" fill="#E87A41" opacity="0.3"/><ellipse cx="15.5" cy="14.7" rx="8.6" ry="3.2" fill="#6366f1" opacity="0.17"/><circle cx="15.5" cy="13" r="4.5" fill="#6366f1" /></svg>
  ),
  "Fantasy": (
    <svg width="29" height="29" aria-label="fantasy" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 29 29" fill="none"><ellipse cx="14.5" cy="14.5" rx="13" ry="8.5" fill="#fbbf24" opacity="0.18"/><path d="M14.5 3L17 10H12L14.5 3ZM14.5 26L12 19H17L14.5 26Z" fill="#6366f1" opacity="0.45"/><ellipse cx="14.5" cy="15" rx="5.5" ry="5" fill="#E87A41" opacity="0.26"/></svg>
  ),
  "Mystery": (
    <svg width="29" height="29" aria-label="mystery" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 29 29" fill="none"><ellipse cx="14.5" cy="14.5" rx="13.5" ry="13.5" fill="#374151" opacity="0.11"/><ellipse cx="14.5" cy="22" rx="6" ry="1.7" fill="#6366f1" opacity="0.13"/><path d="M14.5 8.8a3.7 3.7 0 11-1.1 7.3c-.1-.5.3-1 .8-1.2 1.1-.5 2.2-2.2 1.1-3.2-1.1-.9-3-.1-2.4 1.5" stroke="#6366f1" strokeWidth="1.5" opacity="0.54"/><circle cx="14.5" cy="20" r="1.1" fill="#E87A41"/></svg>
  ),
  "Nonfiction": (
    <svg width="29" height="29" aria-label="nonfiction" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 29 29" fill="none"><rect x="3" y="4" width="19" height="21" rx="2.6" fill="#E87A41" opacity="0.14"/><rect x="7" y="4" width="15" height="21" rx="2.6" fill="#6366f1" opacity="0.13"/><rect x="8.9" y="8" width="6.2" height="1.1" rx="0.5" fill="#6366f1" opacity="0.22"/><rect x="8.9" y="11.1" width="9.1" height="1.1" rx="0.5" fill="#6366f1" opacity="0.12"/></svg>
  ),
};

// PUBLIC_INTERFACE
function App() {
  // For parallax effect
  const bgRef = useRef(null);

  // Animation mode: 'subtle' or 'lively'
  const [animationMode, setAnimationMode] = useState("subtle");

  // Genre and books mock data
  const genres = [
    {
      name: "Science Fiction",
      summary:
        "Science Fiction is a genre that explores speculative concepts such as futuristic science and technology, space exploration, time travel, and extraterrestrial life.",
    },
    {
      name: "Fantasy",
      summary:
        "Fantasy literature features magical elements, mythological creatures, and fantastical worlds that are not bound by the laws of nature.",
    },
    {
      name: "Mystery",
      summary:
        "Mystery novels center around solving a crime or unraveling secrets, often featuring detectives or amateur sleuths.",
    },
    {
      name: "Nonfiction",
      summary:
        "Nonfiction books are grounded in fact, providing information, education, or personal experience across a variety of subjects.",
    },
  ];

  const MOCK_BOOKS = {
    "Science Fiction": [
      {
        title: "Dune",
        author: "Frank Herbert",
        description:
          "Set on the desert planet Arrakis, Dune is the story of Paul Atreides and the conflict for control of the spice melange.",
        image:
          "https://covers.openlibrary.org/b/id/9996671-L.jpg",
        preview:
          "https://www.google.com/books/edition/Dune/9Bq9DwAAQBAJ",
      },
      {
        title: "Neuromancer",
        author: "William Gibson",
        description:
          "A classic cyberpunk novel about a washed-up computer hacker hired for one last job in a dystopian future.",
        image:
          "https://covers.openlibrary.org/b/id/8228691-L.jpg",
        preview:
          "https://www.google.com/books/edition/Neuromancer/O9lZAAAAMAAJ",
      },
      {
        title: "Kindred",
        author: "Octavia E. Butler",
        description:
          "A time-travel story exploring slavery in 19th-century America through the eyes of a contemporary Black woman.",
        image:
          "https://covers.openlibrary.org/b/id/10909282-L.jpg",
        preview:
          "https://www.google.com/books/edition/Kindred/_jNGEAAAQBAJ",
      },
      {
        title: "Foundation",
        author: "Isaac Asimov",
        description:
          "A galactic saga following the rise and fall of civilizations, and the mathematicians predicting their future.",
        image:
          "https://covers.openlibrary.org/b/id/8374146-L.jpg",
        preview:
          "https://www.google.com/books/edition/Foundation/XMCm6VUEEEkC",
      },
    ],
    Fantasy: [
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        description:
          "A classic tale of a hobbit, a wizard, and a group of dwarves on an adventure to reclaim a lost kingdom.",
        image:
          "https://covers.openlibrary.org/b/id/6979861-L.jpg",
        preview:
          "https://www.google.com/books/edition/The_Hobbit/1JJtDwAAQBAJ",
      },
      {
        title: "A Game of Thrones",
        author: "George R.R. Martin",
        description:
          "The first book in the epic fantasy saga 'A Song of Ice and Fire', exploring politics, power, and dragons.",
        image:
          "https://covers.openlibrary.org/b/id/5541062-L.jpg",
        preview:
          "https://www.google.com/books/edition/A_Game_of_Thrones/7F1PAwAAQBAJ",
      },
      {
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        description:
          "Kvothe relates his journey from young prodigy to the most legendary figure in the world.",
        image:
          "https://covers.openlibrary.org/b/id/7559256-L.jpg",
        preview:
          "https://www.google.com/books/edition/The_Name_of_the_Wind/4Xi4vV9nZl0C",
      },
      {
        title: "Mistborn",
        author: "Brandon Sanderson",
        description:
          "In a world where ash falls from the sky, a street thief discovers her powers and the possibility of overthrowing a tyrant.",
        image:
          "https://covers.openlibrary.org/b/id/8595652-L.jpg",
        preview:
          "https://www.google.com/books/edition/Mistborn/8P5aAAAAMAAJ",
      },
    ],
    Mystery: [
      {
        title: "The Girl with the Dragon Tattoo",
        author: "Stieg Larsson",
        description:
          "A journalist and a hacker team up to solve a decades-old disappearance in Sweden.",
        image:
          "https://covers.openlibrary.org/b/id/9260157-L.jpg",
        preview:
          "https://www.google.com/books/edition/The_Girl_with_the_Dragon_Tattoo/nlKnL5ZRsQ0C",
      },
      {
        title: "Gone Girl",
        author: "Gillian Flynn",
        description:
          "A twisted psychological thriller about a woman who vanishes on her wedding anniversary.",
        image:
          "https://covers.openlibrary.org/b/id/8188691-L.jpg",
        preview:
          "https://www.google.com/books/edition/Gone_Girl/5T3_zQEACAAJ",
      },
      {
        title: "And Then There Were None",
        author: "Agatha Christie",
        description:
          "Ten strangers are invited to an island, only to be accused of murder and confronted with their secrets.",
        image:
          "https://covers.openlibrary.org/b/id/8291891-L.jpg",
        preview:
          "https://www.google.com/books/edition/And_Then_There_Were_None/uSy84FCB_K4C",
      },
      {
        title: "In the Woods",
        author: "Tana French",
        description:
          "A detective investigates a girl's murder that may be tied to his own past.",
        image:
          "https://covers.openlibrary.org/b/id/8225231-L.jpg",
        preview:
          "https://www.google.com/books/edition/In_the_Woods/W8w1nQMxyE8C",
      },
    ],
    Nonfiction: [
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        description:
          "A sweeping narrative exploring how Homo sapiens became Earth’s dominant species.",
        image:
          "https://covers.openlibrary.org/b/id/8225631-L.jpg",
        preview:
          "https://www.google.com/books/edition/Sapiens/jd0SDQAAQBAJ",
      },
      {
        title: "Educated",
        author: "Tara Westover",
        description:
          "A memoir about a woman who, kept out of school by her survivalist family, strives for knowledge and escapes into academia.",
        image:
          "https://covers.openlibrary.org/b/id/9250881-L.jpg",
        preview:
          "https://www.google.com/books/edition/Educated/3WhDDwAAQBAJ",
      },
      {
        title: "The Immortal Life of Henrietta Lacks",
        author: "Rebecca Skloot",
        description:
          "The story of the woman whose cells transformed medical research.",
        image:
          "https://covers.openlibrary.org/b/id/8091010-L.jpg",
        preview:
          "https://www.google.com/books/edition/The_Immortal_Life_of_Henrietta_Lacks/w2vZTDPHqmQC",
      },
      {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        description:
          "An exploration of the two systems that drive the way we think and make choices.",
        image:
          "https://covers.openlibrary.org/b/id/7934751-L.jpg",
        preview:
          "https://www.google.com/books/edition/Thinking_Fast_and_Slow/frnBAAAQBAJ",
      },
    ],
  };

  const [selectedGenre, setSelectedGenre] = useState(genres[0].name);
  const [genreQuery, setGenreQuery] = useState("");

  const genre = genres.find((g) => g.name === selectedGenre);

  const bookList = MOCK_BOOKS[selectedGenre];

  // For minimal search/filter effect in dropdown
  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(genreQuery.toLowerCase())
  );

  // Handle hero parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        // Parallax: move slower than scroll position
        const scrollY = window.scrollY;
        // Clamp to not drag too much when scroll is low/high
        const y = Math.min(scrollY * 0.38, 120);
        bgRef.current.style.transform = `translateY(${y}px) scale(1.08)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // PUBLIC_INTERFACE
  return (
    <div className="App" style={{ minHeight: "100vh", position: "relative" }}>
      {/* Parallax Movement Layer */}
      <div
        className="background-parallax"
        aria-hidden="true"
        ref={bgRef}
      ></div>

      <header className="explorer-header">
        <h1 className="app-title">
          <span style={{ color: "var(--accent-color)" }}>Genre</span> Explorer
        </h1>
        <p className="subtitle">
          Discover popular books and summaries for your favorite literary genres.
        </p>
        <div style={{
            marginTop: "1rem",
            marginBottom: "-0.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.8rem",
            fontSize: "1rem",
        }}>
          <label htmlFor="animation-mode-toggle" style={{fontWeight:600}}>Card Animation:</label>
          <button
            id="animation-mode-toggle"
            className={"anim-toggle-btn " + (animationMode === "lively" ? "active" : "")}
            aria-pressed={animationMode === 'lively'}
            aria-label="Switch animation style"
            onClick={() => setAnimationMode(animationMode === "subtle" ? "lively" : "subtle")}
            style={{
              background: animationMode === "lively" ? "var(--secondary-color)" : "var(--accent-color)",
              color: "#fff",
              border: "none",
              borderRadius: "1.6em",
              fontWeight: "bold",
              fontSize: "1.04em",
              padding: "0.38em 1.35em",
              cursor: "pointer",
              outline: animationMode === "lively" ? "2px solid var(--accent-color)" : "",
              transition: "background 0.17s, outline 0.14s"
            }}
          >
            {animationMode === "subtle" ? "Subtle" : "Lively"}
          </button>
        </div>
      </header>

      <main className="main-container">
        <section className="genre-selection-section" aria-label="Select Genre">
          <label htmlFor="genre-select" className="genre-label">
            Pick a genre:
          </label>
          <div className="genre-select-wrapper">
            <input
              className="genre-search-input"
              type="text"
              placeholder="Search genres…"
              value={genreQuery}
              onChange={(e) => setGenreQuery(e.target.value)}
              aria-label="Search genres"
            />
            <select
              id="genre-select"
              className="genre-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {filteredGenres.length === 0 ? (
                <option value="">No genres found</option>
              ) : (
                filteredGenres.map((g) => (
                  <option key={g.name} value={g.name}>
                    {g.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </section>
        <section className="genre-summary-section" aria-label="Genre Summary">
          <div className="genre-summary-row">
            {GENRE_ICONS[genre.name]}
            <div>
              <h2 className="genre-title">{genre.name}</h2>
              <p className="genre-description">{genre.summary}</p>
            </div>
          </div>
        </section>

        <section className="books-grid-section" aria-label="Books">
          <h3 className="books-title">
            Influential &amp; Popular Books in{" "}
            <span style={{ color: "var(--accent-color)" }}>{genre.name}</span>
          </h3>
          <div className="books-grid">
            {bookList.map((book, idx) => {
              // Animation assignment
              const livelyAnim = pickLivelyAnimation(idx);
              const subtleAnim = pickSubtleAnimation(idx);
              const animClass =
                animationMode === "lively"
                  ? `book-card-anim book-card-lively book-${livelyAnim}`
                  : `book-card-anim book-card-subtle book-${subtleAnim}`;

              return (
                <div
                  className={`book-card ${animClass}`}
                  tabIndex="0"
                  key={idx}
                >
                  {/* Glassmorphism overlay with genre tint */}
                  <div
                    className="book-card-overlay"
                    aria-hidden="true"
                    style={{
                      background:
                        genre.name === "Science Fiction"
                          ? "linear-gradient(120deg,rgba(99,102,241,0.31) 38%,rgba(251,191,36,0.13) 80%,rgba(232,122,65,0.12) 100%)"
                          : genre.name === "Fantasy"
                          ? "linear-gradient(120deg,rgba(251,191,36,0.19),rgba(99,102,241,0.13) 75%,rgba(255,255,255,0.16) 100%)"
                          : genre.name === "Mystery"
                          ? "linear-gradient(120deg,rgba(99,102,241,.20),rgba(232,122,65,.13) 42%,rgba(55,65,81,0.13) 100%)"
                          : "linear-gradient(110deg,rgba(232,122,65,0.12) 20%,rgba(99,102,241,0.08) 100%)",
                    }}
                  ></div>
                  <div className="book-card-content">
                    <div className="book-cover-wrapper">
                      <img
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                        className="book-cover"
                      />
                    </div>
                    <div className="book-info">
                      <div className="book-meta">
                        <h4 className="book-title">{book.title}</h4>
                        <span className="book-author">{book.author}</span>
                      </div>
                      <p className="book-description">{book.description}</p>
                      <a
                        className="book-preview-link"
                        href={book.preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Preview ${book.title}`}
                      >
                        Preview&nbsp;↗
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
