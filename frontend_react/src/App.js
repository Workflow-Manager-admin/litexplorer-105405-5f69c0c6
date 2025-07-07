import React, { useState, useRef, useEffect } from 'react';
import './App.css';

/**
 * Utility function: pseudo-random deterministic animation assignment per card on each render.
 */
function pickLivelyAnimation(idx) {
  const options = ['flipY', 'flipX', 'bounce', 'slide', 'rotate3D'];
  // Use mod so the animation selection stays consistent per card
  return options[idx % options.length];
}

/**
 * Utility function: assign subtle card entry animations.
 */
function pickSubtleAnimation(idx) {
  // Subtle: fade, scale, light slide
  const options = ['subtle-fade', 'subtle-scale', 'subtle-slide'];
  return options[idx % options.length];
}

/**
 * Returns consistent SVG/emoji icons per genre (for card icon and summary header).
 * Accessible, visually clear, modern.
 */
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

/**
 * Assigns a visually balanced, genre-themed emoji as fallback/card accent.
 */
const GENRE_EMOJIS = {
  "Science Fiction": "🚀",
  "Fantasy": "🐉",
  "Mystery": "🕵️‍♂️",
  "Nonfiction": "🖋️",
};

/**
 * Generate a mock rating and popularity when not provided.
 */
function getBookVisuals(book, idx = 0) {
  // Try to use Google Books rating/popularity fields if available
  let rating = book.averageRating || book.rating || 4.0 + (idx % 11) / 10;
  let popularity = book.popularity !== undefined
    ? Math.min(1, book.popularity)
    : ((idx % 4) + 1) / 5;
  return { rating, popularity };
}

/**
 * Renders a star rating out of five, with 0.5 step, using accessible emoji/SVG.
 */
function StarRating({ rating }) {
  // Round to 0.5
  const rounded = Math.round(rating * 2) / 2;
  // Filled, half, empty star logic
  const stars = [];
  for (let i = 1; i <= 5; ++i) {
    if (rounded >= i) {
      stars.push(<span key={i} aria-label="star" style={{color:'#fbbf24', fontSize:'1.15em',marginRight:1}}>&#9733;</span>);
    } else if (rounded >= i - 0.5) {
      stars.push(<span key={i} aria-label="half star" style={{color:'#fbbf24', fontSize:'1.15em',marginRight:1}}>&#189;</span>);
    } else {
      stars.push(<span key={i} aria-label="empty star" style={{color:'#e9ecef', fontSize:'1.15em',marginRight:1}}>&#9734;</span>);
    }
  }
  return <span style={{display:'inline-flex',verticalAlign:'middle'}}>{stars}</span>;
}

/**
 * Renders a popularity badge (color accent + 🔥 emoji if high).
 */
function PopularityBadge({ popularity }) {
  let color = "#e9ecef";
  let label = "Typical";
  if (popularity > 0.86) {
    color = "#e53935";
    label = "Trending";
  } else if (popularity > 0.7) {
    color = "#fbbf24";
    label = "Popular";
  } else if (popularity > 0.48) {
    color = "#6366f1";
    label = "Well-liked";
  }
  return (
    <span
      role="img"
      aria-label={label}
      style={{
        background: color,
        color: color === "#fbbf24" ? "#222" : "#fff",
        padding: "0.36em 0.66em",
        borderRadius: "2em",
        fontWeight: 600,
        fontSize: "0.98em",
        boxShadow:
          color === "#e53935"
            ? "0 4px 16px 0 rgba(229,57,53,0.09)"
            : color === "#fbbf24"
            ? "0 2px 7px 0 rgba(251,191,36,0.08)"
            : undefined,
        marginLeft: 7,
        marginRight: 2,
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        gap: "0.28em"
      }}
    >
      {label}
      {label === "Trending" && <span aria-label="fire" style={{marginLeft:2,fontSize:'1.18em'}}>🔥</span>}
      {label === "Popular" && <span aria-label="star" style={{marginLeft:2,fontSize:'1.13em'}}>⭐</span>}
      {label === "Well-liked" && <span aria-label="thumbs up" style={{marginLeft:2,fontSize:'1.09em'}}>👍</span>}
    </span>
  );
}

// PUBLIC_INTERFACE
function App() {
  // For parallax effect
  const bgRef = useRef(null);

  // Animation mode: 'subtle' or 'lively'
  const [animationMode, setAnimationMode] = useState("subtle");

  // List of genres, each with a Wikipedia-friendly search string.
  const genres = [
    { name: "Science Fiction", wiki: "Science_fiction" },
    { name: "Fantasy", wiki: "Fantasy" },
    { name: "Mystery", wiki: "Mystery_fiction" },
    { name: "Nonfiction", wiki: "Non-fiction" },
  ];

  const [selectedGenre, setSelectedGenre] = useState(genres[0].name);
  const [genreQuery, setGenreQuery] = useState("");
  const [genreSummary, setGenreSummary] = useState("");
  const [genreSummaryStatus, setGenreSummaryStatus] = useState("idle"); // "idle", "loading", "error", "done"
  const [books, setBooks] = useState([]);
  const [booksStatus, setBooksStatus] = useState("idle");  // "idle", "loading", "error", "done"
  const [booksErrorMsg, setBooksErrorMsg] = useState("");
  const [summaryErrorMsg, setSummaryErrorMsg] = useState("");

  // Utility: find genre object from name
  const genreObj = genres.find((g) => g.name === selectedGenre);

  // For minimal search/filter effect in dropdown
  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(genreQuery.toLowerCase())
  );

  // --- Fetch genre summary from Wikipedia ---
  useEffect(() => {
    let aborted = false;
    async function fetchSummary() {
      setGenreSummaryStatus("loading");
      setSummaryErrorMsg("");
      try {
        // Use Wikipedia REST summary API for best-guess/short summary.
        const resp = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(genreObj.wiki)}`
        );
        if (!resp.ok) throw new Error(`Wikipedia API error (${resp.status})`);
        const data = await resp.json();
        // Wikipedia API: get extract (short summary), fallback to first 350 chars of description.
        let summary = data.extract || (data.description ? data.description.substring(0, 350) : "");
        if (!summary && data.type === "disambiguation" && Array.isArray(data.titles)) {
          summary = "No summary available. (Disambiguation page)";
        }
        if (!summary) {
          throw new Error("Wikipedia summary not found.");
        }
        if (!aborted) {
          setGenreSummary(summary);
          setGenreSummaryStatus("done");
        }
      } catch (err) {
        if (!aborted) {
          setGenreSummaryStatus("error");
          setSummaryErrorMsg(err.message || "Failed to load summary.");
          setGenreSummary("");
        }
      }
    }
    fetchSummary();
    return () => { aborted = true; };
    // genreObj.wiki update triggers fetch
  }, [genreObj.wiki]);

  // --- Fetch book data from Google Books API (filter by genre/topic) ---
  useEffect(() => {
    let aborted = false;
    async function fetchBooks() {
      setBooksStatus("loading");
      setBooksErrorMsg("");
      setBooks([]);
      // Use a mapping for good genre queries
      const genreQueryMap = {
        "Science Fiction": "science fiction",
        "Fantasy": "fantasy",
        "Mystery": "mystery",
        "Nonfiction": "nonfiction",
      };
      const subject = genreQueryMap[genreObj.name] || genreObj.name;
      // Build the query for bestbooks by subject: uses 'subject' and ordered by relevance
      const baseURL = "https://www.googleapis.com/books/v1/volumes";
      // Show only print books, relevance ordering, limit to 8.
      const params = `?q=subject:${encodeURIComponent(subject)}&maxResults=8&printType=books&orderBy=relevance&langRestrict=en`;
      try {
        const resp = await fetch(baseURL + params);
        if (!resp.ok) throw new Error(`Google Books API error (${resp.status})`);
        const data = await resp.json();
        if (!data.items || !Array.isArray(data.items)) throw new Error("No books found.");
        // Map to our structure, provide fallbacks for missing images/authors/descriptions.
        const parsedBooks = data.items.map((item) => {
          const info = item.volumeInfo || {};
          return {
            title: info.title || "Untitled Book",
            author: (info.authors && info.authors[0]) || "Unknown Author",
            description: info.description
              ? info.description.length > 320
                ? info.description.substring(0, 300) + "…"
                : info.description
              : "No description available.",
            image:
              (info.imageLinks && (info.imageLinks.large || info.imageLinks.thumbnail || info.imageLinks.smallThumbnail)) ||
              "https://via.placeholder.com/132x178.png?text=No+Cover",
            preview:
              info.previewLink ||
              info.infoLink ||
              "https://books.google.com/",

            // API-provided fields for visuals:
            averageRating: info.averageRating || null,
            // Not a real API popularity field but randomize for visual accent
            popularity: info.ratingsCount
              ? Math.min(1, (info.ratingsCount / 4000) + Math.random() * 0.2)
              : Math.random() * 0.5,
          };
        });
        if (!aborted) {
          setBooks(parsedBooks);
          setBooksStatus("done");
        }
      } catch (err) {
        if (!aborted) {
          setBooksErrorMsg(err.message || "Failed to load books.");
          setBooks([]);
          setBooksStatus("error");
        }
      }
    }
    fetchBooks();
    return () => { aborted = true; };
    // genreObj update triggers books fetch
  }, [genreObj.name]);

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
            {GENRE_ICONS[genreObj.name]}
            <div>
              <h2 className="genre-title">{genreObj.name}</h2>
              {genreSummaryStatus === "loading" && (
                <p className="genre-description" style={{color:'var(--text-dim)'}}>Loading summary…</p>
              )}
              {genreSummaryStatus === "error" && (
                <p className="genre-description" style={{color:"#e53935"}}>Failed to load genre overview. {summaryErrorMsg ? (<span style={{ fontWeight: 500 }}>{summaryErrorMsg}</span>) : null}</p>
              )}
              {genreSummaryStatus === "done" && (
                <p className="genre-description">{genreSummary}</p>
              )}
            </div>
          </div>
        </section>

        <section className="books-grid-section" aria-label="Books">
          <h3 className="books-title">
            Influential &amp; Popular Books in{" "}
            <span style={{ color: "var(--accent-color)" }}>{genreObj.name}</span>
          </h3>
          {booksStatus === "loading" && (
            <div style={{color:'var(--text-dim)',padding:'0.9em 0'}}>Loading books…</div>
          )}
          {booksStatus === "error" && (
            <div style={{color:'#e53935', fontWeight: 500, padding:'0.9em 0'}} aria-live="polite">
              {booksErrorMsg ? `Failed to load books: ${booksErrorMsg}` : "Error loading books."}
            </div>
          )}
          {booksStatus === "done" && books.length === 0 && (
            <div style={{color:'var(--text-dim)', padding:'0.9em 0'}}>No books found for this genre.</div>
          )}
          <div className="books-grid">
            {booksStatus === "done" && books.map((book, idx) => {
              // Determine the card's animation
              const livelyAnim = pickLivelyAnimation(idx);
              const subtleAnim = pickSubtleAnimation(idx);
              const animClass =
                animationMode === "lively"
                  ? `book-card-anim book-card-lively book-${livelyAnim}`
                  : `book-card-anim book-card-subtle book-${subtleAnim}`;

              // Get genre icon/emoji for this card
              const cardIcon =
                GENRE_ICONS[genreObj.name] ||
                <span style={{ fontSize: "2em", marginRight: 8 }}>{GENRE_EMOJIS[genreObj.name] || "📚"}</span>;

              // Get visual indicators
              const { rating, popularity } = getBookVisuals(book, idx);

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
                        genreObj.name === "Science Fiction"
                          ? "linear-gradient(120deg,rgba(99,102,241,0.31) 38%,rgba(251,191,36,0.13) 80%,rgba(232,122,65,0.12) 100%)"
                          : genreObj.name === "Fantasy"
                          ? "linear-gradient(120deg,rgba(251,191,36,0.19),rgba(99,102,241,0.13) 75%,rgba(255,255,255,0.16) 100%)"
                          : genreObj.name === "Mystery"
                          ? "linear-gradient(120deg,rgba(99,102,241,.20),rgba(232,122,65,.13) 42%,rgba(55,65,81,0.13) 100%)"
                          : "linear-gradient(110deg,rgba(232,122,65,0.12) 20%,rgba(99,102,241,0.08) 100%)",
                    }}
                  ></div>
                  <div className="book-card-content">
                    <div className="book-cover-wrapper" style={{paddingBottom:"124px",marginBottom:".7rem"}}>
                      <img
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                        className="book-cover"
                        loading="lazy"
                        style={{ background: "#fafcff", border: "1px solid #ececec" }}
                      />
                      {/* Card Genre Icon */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: "0.78em",
                          left: "0.86em",
                          zIndex: 3,
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.93)",
                          padding: "0.37em 0.37em 0.24em",
                          boxShadow: "0 1.5px 5px #efefef55",
                          fontSize: "1.45em",
                          lineHeight: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        title={`${genreObj.name} genre`}
                      >
                        {GENRE_ICONS[genreObj.name]
                          ? <span style={{ width:"1.6em",height:"1.6em",display:"flex",alignItems:"center",justifyContent:"center" }}>{GENRE_ICONS[genreObj.name]}</span>
                          : <span role="img" aria-label={genreObj.name + " icon"} style={{fontSize:"1.6em"}}>{GENRE_EMOJIS[genreObj.name]}</span>
                        }
                      </div>
                      {/* Rating/Popularity badge at corner */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: "0.7em",
                          right: "0.72em",
                          zIndex: 3,
                          display: "flex",
                          gap: "0.35em",
                          alignItems: "center"
                        }}
                      >
                        <PopularityBadge popularity={popularity} />
                      </div>
                    </div>
                    <div className="book-info" style={{marginTop:"-14px"}}>
                      <div className="book-meta" style={{display:"flex",alignItems:"flex-start",gap:"0.5em",marginBottom:"4px"}}>
                        <div style={{flex:1,minWidth:0}}>
                          <h4 className="book-title" style={{marginBottom:"1.7px"}}>{book.title}</h4>
                          <span className="book-author">{book.author}</span>
                        </div>
                        {/* Star Rating (to right of title/author) */}
                        <div
                          title={`Rating: ${rating} out of 5`}
                          aria-label={`Rating: ${rating} out of 5`}
                          style={{marginTop:"2px", marginLeft:"0.3em", flexShrink:0}}
                        >
                          <StarRating rating={rating} />
                        </div>
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
