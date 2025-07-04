import React, { useState } from "react";

/*
  PUBLIC_INTERFACE
  GenreSelector component for selecting a literary genre.

  - Renders a searchable dropdown from a list of genres.
  - Calls onGenreSelect(genre) when the selection changes.
  - Manages its own input state for filtering.
  - Initial genres are provided as a stub (can be replaced by API data).

  Props:
    - genres: Array of genre strings to display (optional, default: internal stub)
    - onGenreSelect: function(genre) called with newly selected genre
    - value: string, current selected genre (for controlled components; optional)
*/

const GENRE_STUB = [
  "Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Horror",
  "Historical",
  "Non-Fiction",
  "Thriller",
  "Biography"
  // Add more genres for production or fetch from backend/API
];

function GenreSelector({
  genres = GENRE_STUB,
  onGenreSelect = () => {},
  value = ""
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Filter genres by search term (case-insensitive substring match)
  const filteredGenres = genres.filter((g) =>
    g.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle when a genre is selected from dropdown
  const handleSelect = (genre) => {
    onGenreSelect(genre);
    setDropdownOpen(false);
    setSearchTerm(""); // Optionally clear search box
  };

  // UI: simple custom dropdown + text input (unstyled for now)
  return (
    <div style={{ position: "relative", maxWidth: 360, margin: "0 auto" }}>
      <label htmlFor="genre-select-input" style={{ fontWeight: 500 }}>
        Select Genre
      </label>
      <input
        id="genre-select-input"
        type="text"
        autoComplete="off"
        value={searchTerm}
        placeholder={value ? value : "Type or select a genre..."}
        style={{
          width: "100%",
          padding: "0.55rem 0.5rem",
          marginTop: "0.4rem",
          borderRadius: "0.5rem",
          border: "1px solid #bbb",
          boxSizing: "border-box"
        }}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setTimeout(() => setDropdownOpen(false), 120)}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setDropdownOpen(true);
        }}
        aria-label="Search and select genre"
      />

      {dropdownOpen && (
        <ul
          style={{
            position: "absolute",
            width: "100%",
            background: "var(--bg-primary, #fff)",
            border: "1px solid #bbb",
            borderTop: "none",
            maxHeight: 200,
            overflowY: "auto",
            borderRadius: "0 0 0.5rem 0.5rem",
            zIndex: 10,
            listStyle: "none",
            padding: 0,
            margin: 0,
            boxShadow: "0 2px 6px rgba(30,36,50,0.06)"
          }}
        >
          {/* Show filtered options or a stub "not found" */}
          {filteredGenres.length === 0 ? (
            <li
              style={{
                padding: "0.7rem 1rem",
                color: "#888",
                fontStyle: "italic",
                cursor: "default"
              }}
            >
              No genres found.
            </li>
          ) : (
            filteredGenres.map((genre, idx) => (
              <li
                key={genre}
                style={{
                  padding: "0.7rem 1rem",
                  background:
                    genre === value
                      ? "var(--border-color, #ececec)"
                      : "transparent",
                  cursor: "pointer"
                }}
                onMouseDown={() => handleSelect(genre)}
                aria-selected={genre === value}
              >
                {genre}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default GenreSelector;
