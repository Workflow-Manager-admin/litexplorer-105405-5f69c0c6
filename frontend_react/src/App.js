import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Homepage from './Homepage';
import AddBookForm from './AddBookForm';

/**
 * Icon and emoji assignments for genres
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
  "Romance": (
    <svg width="30" height="30" aria-label="romance" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 30 30"><ellipse cx="15" cy="15" rx="13" ry="13" fill="#fbbf24" opacity="0.12"/><path d="M15 23s-7.5-5.222-7.5-10.083C7.5 9.156 10.203 7 13.083 7A4.057 4.057 0 0 1 15 8.667 4.057 4.057 0 0 1 16.917 7C19.797 7 22.5 9.156 22.5 12.917c0 4.861-7.5 10.083-7.5 10.083z" fill="#E87A41" opacity="0.48"/></svg>
  ),
  "Biography": (
    <svg width="32" height="32" aria-label="biography" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 32 32"><ellipse cx="16" cy="16" rx="14" ry="14" fill="#6366f1" opacity="0.07"/><ellipse cx="16" cy="23" rx="7.5" ry="3" fill="#fbbf24" opacity="0.11"/><circle cx="16" cy="13" r="4" fill="#E87A41" opacity="0.28"/><ellipse cx="16" cy="19" rx="4" ry="2" fill="#6366f1" opacity="0.2"/></svg>
  ),
  "Dystopian": (
    <svg width="32" height="32" aria-label="dystopian" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 32 32"><ellipse cx="16" cy="16" rx="14" ry="14" fill="#374151" opacity="0.08"/><rect x="7" y="19" width="18" height="5" rx="2.5" fill="#6366f1" opacity="0.13"/><rect x="10" y="8" width="12" height="15" rx="4" fill="#E87A41" opacity="0.22"/><rect x="14" y="14" width="4" height="9" rx="1.3" fill="#6366f1" opacity="0.18"/></svg>
  ),
  "Historical": (
    <svg width="30" height="30" aria-label="historical" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 30 30"><ellipse cx="15" cy="15" rx="13" ry="13" fill="#E87A41" opacity="0.07"/><rect x="8" y="12" width="14" height="7" rx="1.8" fill="#6366f1" opacity="0.13"/><rect x="10" y="8" width="10" height="6" rx="1.4" fill="#fbbf24" opacity="0.23"/></svg>
  ),
  "Horror": (
    <svg width="29" height="29" aria-label="horror" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 29 29" fill="none"><ellipse cx="14.5" cy="14.5" rx="13.5" ry="13.5" fill="#e53935" opacity="0.083"/><ellipse cx="14.5" cy="23" rx="7.5" ry="2.5" fill="#E87A41" opacity="0.13"/><ellipse cx="14.5" cy="13.5" rx="4.7" ry="5.3" fill="#6366f1" opacity="0.18"/><rect x="9.5" y="17" width="10" height="2" rx="1" fill="#e53935" opacity="0.16"/></svg>
  ),
  "Young Adult": (
    <svg width="30" height="30" aria-label="young adult" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 30 30"><ellipse cx="15" cy="15" rx="13" ry="13" fill="#fbbf24" opacity="0.09"/><ellipse cx="15" cy="23" rx="6" ry="2" fill="#6366f1" opacity="0.13"/><ellipse cx="15" cy="15" rx="7" ry="2.2" fill="#6366f1" opacity="0.15"/><circle cx="15" cy="11.5" r="3.1" fill="#E87A41" opacity="0.32"/></svg>
  ),
  "Thriller": (
    <svg width="32" height="32" aria-label="thriller" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 32 32"><ellipse cx="16" cy="16" rx="14" ry="14" fill="#374151" opacity="0.11"/><ellipse cx="16" cy="23" rx="7" ry="2" fill="#6366f1" opacity="0.16"/><polygon points="15,10 18,10 21,17 12,17" fill="#E87A41" opacity="0.22"/></svg>
  ),
  "Classic": (
    <svg width="28" height="28" aria-label="classic" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 28 28"><ellipse cx="14" cy="14" rx="12" ry="12" fill="#e2e6ea" opacity="0.10"/><rect x="10" y="8" width="8" height="12" rx="1.6" fill="#E87A41" opacity="0.18"/><rect x="11.2" y="10" width="5.6" height="8.5" rx="1.1" fill="#6366f1" opacity="0.16"/></svg>
  ),
  "Adventure": (
    <svg width="32" height="32" aria-label="adventure" style={{marginRight:10,verticalAlign:'middle'}} viewBox="0 0 32 32"><ellipse cx="16" cy="16" rx="13" ry="13" fill="#fbbf24" opacity="0.10"/><polygon points="16,6 26,26 6,26" fill="#6366f1" opacity="0.19"/><ellipse cx="16" cy="21" rx="7.3" ry="2.2" fill="#E87A41" opacity="0.11"/></svg>
  ),
};
const GENRE_EMOJIS = {
  "Science Fiction": "🚀",
  "Fantasy": "🐉",
  "Mystery": "🕵️‍♂️",
  "Nonfiction": "🖋️",
  "Romance": "💕",
  "Biography": "👤",
  "Dystopian": "🏙️",
  "Historical": "🏛️",
  "Horror": "🧛",
  "Young Adult": "🧢",
  "Thriller": "🔪",
  "Classic": "📜",
  "Adventure": "🗺️",
};
const GENRES = [
  { name: "Science Fiction", wiki: "Science_fiction" },
  { name: "Fantasy", wiki: "Fantasy" },
  { name: "Mystery", wiki: "Mystery_fiction" },
  { name: "Nonfiction", wiki: "Non-fiction" },
  { name: "Romance", wiki: "Romance_novel" },
  { name: "Biography", wiki: "Biography" },
  { name: "Dystopian", wiki: "Dystopian_literature" },
  { name: "Historical", wiki: "Historical_fiction" },
  { name: "Horror", wiki: "Horror_fiction" },
  { name: "Young Adult", wiki: "Young_adult_fiction" },
  { name: "Thriller", wiki: "Thriller_(genre)" },
  { name: "Classic", wiki: "Classic_literature" },
  { name: "Adventure", wiki: "Adventure_novel" },
];

// ==============================
// GenreDropdown COMPONENT
// ==============================
function GenreDropdown({
  genres,
  selectedGenre,
  setSelectedGenre,
  inputId = "genre-search",
  labelId = "genre-label",
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusIndex, setFocusIndex] = useState(-1);
  const searchRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    // Close dropdown on outside click/tap
    function handler(e) {
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setFocusIndex(-1);
      }
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    function onEsc(evt) {
      if (evt.key === 'Escape') {
        setDropdownOpen(false);
        setFocusIndex(-1);
      }
    }
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [dropdownOpen]);

  const filteredGenres = genres.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  useEffect(() => {
    if (!dropdownOpen) return;
    if (focusIndex >= 0 && focusIndex < filteredGenres.length) {
      const el = document.getElementById(`genre-item-${focusIndex}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusIndex, dropdownOpen, filteredGenres.length]);

  function handleInputKeyDown(e) {
    if (e.key === "ArrowDown" && filteredGenres.length) {
      setFocusIndex(0);
    }
    if (e.key === "Enter") {
      setDropdownOpen((d) => !d);
    }
  }
  function handleListKeyDown(e) {
    if (e.key === "ArrowDown") {
      setFocusIndex((c) => Math.min(filteredGenres.length - 1, c + 1));
      e.preventDefault();
    }
    if (e.key === "ArrowUp") {
      setFocusIndex((c) => Math.max(0, c - 1));
      e.preventDefault();
    }
    if (e.key === "Enter" && focusIndex >= 0 && focusIndex < filteredGenres.length) {
      setSelectedGenre(filteredGenres[focusIndex].name);
      setDropdownOpen(false);
      setFocusIndex(-1);
      setTimeout(() => searchRef.current && searchRef.current.blur(), 0);
    }
    if (e.key === "Tab") {
      setDropdownOpen(false); setFocusIndex(-1);
    }
  }
  function handleGenreClick(idx, name) {
    setSelectedGenre(name);
    setDropdownOpen(false);
    setFocusIndex(-1);
  }
  const dropdownWidth = 'min(320px, 97vw)';
  return (
    <div className="genre-select-wrapper" ref={dropdownRef} style={{ position: 'relative', width: dropdownWidth, flex: 1 }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 0}}>
        <input
          id={inputId}
          ref={searchRef}
          className="genre-search-input"
          placeholder="Search genres…"
          aria-label="Search genres"
          value={search}
          autoComplete="off"
          onClick={() => setDropdownOpen(true)}
          onFocus={() => setDropdownOpen(true)}
          onChange={e => {
            setSearch(e.target.value);
            setDropdownOpen(true);
            setFocusIndex(-1);
          }}
          onKeyDown={handleInputKeyDown}
          style={{width: '100%', background: '#fff'}}
        />
        <button
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
          aria-controls="genre-listbox"
          tabIndex={0}
          className="genre-select"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            marginLeft: '-35px',
            color: "var(--secondary-color)",
            fontSize: '1.4em',
            padding: 0,
            position: "relative",
            zIndex: 3,
            width: 30,
            height: 35
          }}
          title="Show genres"
          onClick={() => { setDropdownOpen(d => !d); setFocusIndex(-1); }}
        >▼</button>
      </div>
      {dropdownOpen && (
        <div
          className="genre-dropdown-list"
          role="listbox"
          aria-labelledby={labelId}
          id="genre-listbox"
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          style={{
            position: 'absolute',
            top: "2.5em",
            left: 0,
            width: dropdownWidth,
            maxHeight: 240,
            overflowY: 'auto',
            background: '#fff',
            border: '1.5px solid var(--border-color)',
            borderRadius: '0.6em',
            boxShadow: '0 6px 24px 0 rgba(55, 65, 81, 0.12)',
            zIndex: 20,
            transition: 'opacity 0.13s cubic-bezier(.63,.19,.19,1.2)',
            animation: 'fadeIn .18s cubic-bezier(.41,1.19,.13,1.01)'
          }}
        >
          {filteredGenres.length === 0 && (
            <div
              style={{
                padding: "0.8em 1em",
                color: "#bbb",
                fontWeight: 500
              }}
            >
              No genres found
            </div>
          )}
          {filteredGenres.map((g, idx) =>
            <div
              key={g.name}
              id={`genre-item-${idx}`}
              role="option"
              aria-selected={selectedGenre === g.name}
              tabIndex={-1}
              className="genre-dropdown-item"
              style={{
                display: 'flex',
                alignItems: "center",
                padding: "0.65em 1.03em",
                fontSize: "1.08em",
                background: focusIndex === idx
                  ? "var(--secondary-color)"
                  : selectedGenre === g.name
                  ? "rgba(99,102,241,0.13)"
                  : "#fff",
                color: focusIndex === idx
                  ? "#fff"
                  : selectedGenre === g.name
                  ? "var(--primary-color)"
                  : "#282c34",
                borderRadius: '.45em',
                margin: "0.11em 0.18em",
                cursor: "pointer",
                fontWeight: 600,
                outline: focusIndex === idx ? "2.5px solid var(--accent-color)" : "none",
                userSelect: "none",
                transition: "background 0.14s, color 0.14s"
              }}
              onMouseDown={e => { e.preventDefault(); handleGenreClick(idx, g.name);}}
              onMouseEnter={() => setFocusIndex(idx)}
              onMouseLeave={() => setFocusIndex(-1)}
              onKeyDown={e => e.key === "Enter" && handleGenreClick(idx, g.name)}
            >
              {GENRE_ICONS[g.name]
                ? <span aria-hidden="true" style={{width: "1.53em", height: "1.53em", marginRight: "0.59em", display: "flex", alignItems: "center"}}>{GENRE_ICONS[g.name]}</span>
                : <span aria-hidden="true" style={{fontSize:"1.2em", marginRight: "0.72em"}}>{GENRE_EMOJIS[g.name] || "📚"}</span>
              }
              <span>{g.name}</span>
              {selectedGenre === g.name &&
                <span aria-hidden="true" style={{marginLeft: "auto", color: "var(--accent-color)", fontSize: "1.2em"}}>✓</span>
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Utility
function pickLivelyAnimation(idx) {
  const options = ['flipY', 'flipX', 'bounce', 'slide', 'rotate3D'];
  return options[idx % options.length];
}
function pickSubtleAnimation(idx) {
  const options = ['subtle-fade', 'subtle-scale', 'subtle-slide'];
  return options[idx % options.length];
}
function getBookVisuals(book, idx = 0) {
  let rating = book.averageRating || book.rating || 4.0 + (idx % 11) / 10;
  let popularity = book.popularity !== undefined
    ? Math.min(1, book.popularity)
    : ((idx % 4) + 1) / 5;
  return { rating, popularity };
}
function StarRating({ rating }) {
  const rounded = Math.round(rating * 2) / 2;
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
  return <span style={{display:'inline-flex', verticalAlign:'middle'}}>{stars}</span>;
}
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

// Main wrapper using router, exported as default
function AppWrapper() {
  // Router navigation
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddBook, setShowAddBook] = useState(false);

  // Store user-added books only in memory (for demo)
  const [userBooks, setUserBooks] = useState([]);

  // Handler for adding a book (from AddBookForm)
  function handleAddBook(book) {
    setUserBooks((prev) => [...prev, book]);
    setShowAddBook(false);
    // After add, go back to book explorer page
    navigate('/books');
  }

  function handleCancelAddBook() {
    setShowAddBook(false);
    // Just go back if on add book route
    if (location.pathname !== '/books') navigate('/books');
  }

  function NavigationBar() {
    return (
      <nav
        style={{
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '1.2em',
          padding: '0.5em 1.5em',
          position: 'relative',
          zIndex: 22,
        }}>
        <Link
          to="/"
          style={{
            color: location.pathname === '/' ? 'var(--accent-color,#fbbf24)' : 'var(--primary-color,#374151)',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '1.03em',
            marginRight: 'auto',
            letterSpacing: '-0.02em',
            opacity: 0.98
          }}>
          Home
        </Link>
        <Link
          to="/books"
          style={{
            color: location.pathname.startsWith('/books') ? 'var(--secondary-color,#6366f1)' : '#444',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '1.03em',
            letterSpacing: '-0.02em'
          }}>
          Book Explorer
        </Link>
        {location.pathname === '/books' && (
          <button
            onClick={() => setShowAddBook(true)}
            className="btn"
            style={{
              background: 'var(--accent-color,#fbbf24)',
              color: '#1A1A1A',
              border: 'none',
              borderRadius: '1.5em',
              fontWeight: 'bold',
              fontSize: '1em',
              padding: '0.48em 1.5em',
              marginLeft: '1em',
              cursor: 'pointer',
              boxShadow: '0 1.5px 6px 0 rgba(251,191,36,0.13)',
              transition: 'background 0.16s'
            }}
          >+ Add Book</button>
        )}
      </nav>
    );
  }

  return (
    <>
      <NavigationBar />
      <Routes>
        {/* Homepage Route */}
        <Route
          path="/"
          element={
            <Homepage onNavigateBooks={() => navigate('/books')} />
          }
        />
        {/* Add Book Route */}
        <Route
          path="/books/new"
          element={
            <AddBookForm genres={GENRES} onAddBook={handleAddBook} onCancel={handleCancelAddBook} />
          }
        />
        {/* Main Book Explorer Route */}
        <Route
          path="/books"
          element={
            <BookExplorer
              userBooks={userBooks}
              onAddNewBookClick={() => setShowAddBook(true)}
            />
          }
        />
      </Routes>
      {showAddBook && (
        <div
          style={{
            position: 'fixed',
            left: 0, top: 0, width: '100vw', height: '100vh',
            background: 'rgba(55,65,81,0.20)',
            zIndex: 55,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <AddBookForm genres={GENRES} onAddBook={handleAddBook} onCancel={handleCancelAddBook} />
        </div>
      )}
    </>
  );
}

// Book Explorer as sub-component (NOT default export)
function BookExplorer({ userBooks, onAddNewBookClick }) {
  const bgRef = useRef(null);
  const [animationMode, setAnimationMode] = useState("subtle");
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0].name);
  const [genreSummary, setGenreSummary] = useState("");
  const [genreSummaryStatus, setGenreSummaryStatus] = useState("idle");
  const [summaryErrorMsg, setSummaryErrorMsg] = useState("");
  const [books, setBooks] = useState([]);
  const [booksStatus, setBooksStatus] = useState("idle");
  const [booksErrorMsg, setBooksErrorMsg] = useState("");

  const genreObj = GENRES.find(g => g.name === selectedGenre) || GENRES[0];

  useEffect(() => {
    let aborted = false;
    async function fetchSummary() {
      setGenreSummaryStatus("loading");
      setSummaryErrorMsg("");
      try {
        const resp = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(genreObj.wiki)}`
        );
        if (!resp.ok) throw new Error(`Wikipedia API error (${resp.status})`);
        const data = await resp.json();
        let summary = data.extract || (data.description ? data.description.substring(0, 350) : "");
        if (!summary && data.type === "disambiguation" && Array.isArray(data.titles)) {
          summary = "No summary available. (Disambiguation page)";
        }
        if (!summary) throw new Error("Wikipedia summary not found.");
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
  }, [genreObj.wiki]);

  useEffect(() => {
    let aborted = false;
    async function fetchBooks() {
      setBooksStatus("loading");
      setBooksErrorMsg("");
      setBooks([]);
      const genreQueryMap = {
        "Science Fiction": "science fiction",
        "Fantasy": "fantasy",
        "Mystery": "mystery",
        "Nonfiction": "nonfiction",
        "Romance": "romance",
        "Biography": "biography",
        "Dystopian": "dystopian",
        "Historical": "historical fiction",
        "Horror": "horror",
        "Young Adult": "young adult",
        "Thriller": "thriller",
        "Classic": "classic literature",
        "Adventure": "adventure",
      };
      const subject = genreQueryMap[genreObj.name] || genreObj.name;
      const baseURL = "https://www.googleapis.com/books/v1/volumes";
      const params = `?q=subject:${encodeURIComponent(subject)}&maxResults=8&printType=books&orderBy=relevance&langRestrict=en`;
      try {
        const resp = await fetch(baseURL + params);
        if (!resp.ok) throw new Error(`Google Books API error (${resp.status})`);
        const data = await resp.json();
        if (!data.items || !Array.isArray(data.items)) throw new Error("No books found.");
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
            averageRating: info.averageRating || null,
            popularity: info.ratingsCount
              ? Math.min(1, (info.ratingsCount / 4000) + Math.random() * 0.2)
              : Math.random() * 0.5,
            raw: info
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
  }, [genreObj.name]);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        const y = Math.min(scrollY * 0.38, 120);
        bgRef.current.style.transform = `translateY(${y}px) scale(1.08)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const matchingUserBooks =
    userBooks && userBooks.length > 0
      ? userBooks.filter((b) => b.genre === genreObj.name)
      : [];

  return (
    <div className="App" style={{ minHeight: "100vh", position: "relative" }}>
      <div className="background-parallax" aria-hidden="true" ref={bgRef}></div>
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
          <button
            onClick={onAddNewBookClick}
            className="btn"
            style={{
              background: 'var(--accent-color,#fbbf24)',
              color: '#1A1A1A',
              border: 'none',
              borderRadius: '1.5em',
              fontWeight: 'bold',
              fontSize: '1em',
              padding: '0.36em 1.2em',
              marginLeft: '2em',
              cursor: 'pointer',
              boxShadow: '0 1.5px 6px 0 rgba(251,191,36,0.09)',
              transition: 'background 0.12s'
            }}>Add Book</button>
        </div>
      </header>
      <main className="main-container">
        <section className="genre-selection-section" aria-label="Select Genre">
          <label htmlFor="genre-search" className="genre-label" id="genre-label">
            Pick a genre:
          </label>
          <GenreDropdown
            genres={GENRES}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            inputId="genre-search"
            labelId="genre-label"
          />
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
          {booksStatus === "done" && books.length === 0 && matchingUserBooks.length === 0 && (
            <div style={{color:'var(--text-dim)', padding:'0.9em 0'}}>No books found for this genre.</div>
          )}
          <div className="books-grid">
            {matchingUserBooks.map((book, idx) => {
              const livelyAnim = pickLivelyAnimation(idx + 11);
              const subtleAnim = pickSubtleAnimation(idx + 7);
              const animClass =
                animationMode === "lively"
                  ? `book-card-anim book-card-lively book-${livelyAnim}`
                  : `book-card-anim book-card-subtle book-${subtleAnim}`;
              return (
                <div
                  className={`book-card ${animClass}`}
                  tabIndex="0"
                  key={"userbook-" + idx}
                  aria-label={`Book: ${book.title} by ${book.author}`}
                  style={{borderColor:'var(--secondary-color,#6366f1)'}}
                >
                  <div className="book-card-overlay" aria-hidden="true"
                    style={{background: "linear-gradient(130deg,rgba(251,191,36,0.17) 41%,rgba(99,102,241,0.18) 100%)"}}
                  ></div>
                  <div className="book-card-content">
                    <div className="book-cover-wrapper" style={{paddingBottom:"124px",marginBottom:".7rem"}}>
                      <img
                        src={book.image && book.image.trim() ? book.image : "https://via.placeholder.com/132x178.png?text=No+Cover"}
                        alt={`Cover of ${book.title}`}
                        className="book-cover"
                        loading="lazy"
                        style={{ background: "#fafcff", border: "1px solid #ececec" }}
                      />
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
                        title={`${book.genre} genre`}
                      >
                        {GENRE_ICONS[book.genre]
                          ? <span style={{ width:"1.6em",height:"1.6em",display:"flex",alignItems:"center",justifyContent:"center" }}>{GENRE_ICONS[book.genre]}</span>
                          : <span role="img" aria-label={book.genre + " icon"} style={{fontSize:"1.6em"}}>{GENRE_EMOJIS[book.genre]||"📚"}</span>
                        }
                      </div>
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
                        <span style={{
                          background:'#e53935',
                          color:'#fff',
                          padding:'0.36em 0.66em',
                          borderRadius:'2em',
                          fontWeight:600,
                          fontSize:'0.98em'
                        }}>Added</span>
                      </div>
                    </div>
                    <div className="book-info" style={{marginTop:"-14px"}}>
                      <div className="book-meta" style={{display:"flex",alignItems:"flex-start",gap:"0.5em",marginBottom:"4px"}}>
                        <div style={{flex:1,minWidth:0}}>
                          <h4 className="book-title" style={{marginBottom:"1.7px"}}>{book.title}</h4>
                          <span className="book-author">{book.author}</span>
                        </div>
                      </div>
                      <p className="book-description">{book.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {booksStatus === "done" && books.map((book, idx) => {
              const livelyAnim = pickLivelyAnimation(idx);
              const subtleAnim = pickSubtleAnimation(idx);
              const animClass =
                animationMode === "lively"
                  ? `book-card-anim book-card-lively book-${livelyAnim}`
                  : `book-card-anim book-card-subtle book-${subtleAnim}`;

              const { rating, popularity } = getBookVisuals(book, idx);

              return (
                <div
                  className={`book-card ${animClass}`}
                  tabIndex="0"
                  key={idx}
                  aria-label={`Book: ${book.title} by ${book.author}`}
                >
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
                          : genreObj.name === "Romance"
                          ? "linear-gradient(127deg,rgba(232,122,65,0.13) 36%,rgba(251,191,36,0.23) 80%,rgba(255,37,73,0.14) 100%)"
                          : genreObj.name === "Biography"
                          ? "linear-gradient(120deg,rgba(99,102,241,0.16) 19%,rgba(251,191,36,0.07) 100%)"
                          : genreObj.name === "Dystopian"
                          ? "linear-gradient(130deg,rgba(55,65,81,0.18) 55%,rgba(232,122,65,0.09) 100%)"
                          : genreObj.name === "Historical"
                          ? "linear-gradient(110deg,rgba(251,191,36,0.15) 30%,rgba(99,102,241,0.09) 100%)"
                          : genreObj.name === "Horror"
                          ? "linear-gradient(120deg,rgba(229,57,53,0.18),rgba(99,102,241,0.06) 80%,rgba(232,122,65,0.14) 100%)"
                          : genreObj.name === "Young Adult"
                          ? "linear-gradient(127deg,rgba(99,102,241,0.11) 49%,rgba(251,191,36,0.18) 100%)"
                          : genreObj.name === "Thriller"
                          ? "linear-gradient(130deg,rgba(229,57,53,0.09) 41%,rgba(99,102,241,0.19) 100%)"
                          : genreObj.name === "Classic"
                          ? "linear-gradient(120deg,rgba(251,191,36,0.15) 17%,rgba(232,122,65,0.12) 100%)"
                          : genreObj.name === "Adventure"
                          ? "linear-gradient(120deg,rgba(251,191,36,0.17) 63%,rgba(99,102,241,0.08) 100%)"
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

export default AppWrapper;
