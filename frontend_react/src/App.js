import React, { useState, useEffect } from 'react';
import './App.css';
import GenreSelector from './GenreSelector';

/*
  PUBLIC_INTERFACE
  Main App layout for the Literary Genre Explorer.
  - Header at top
  - Section for genre selection (placeholder)
  - Section for genre summary (placeholder)
  - Section for grid of books (placeholder)
  - Theme toggle for future support
*/
function App() {
  const [theme, setTheme] = useState('light');
  const [selectedGenre, setSelectedGenre] = useState(""); // state for selected genre

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Handler for when a genre is selected
  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    // Future: trigger data fetch for books, etc.
  };

  return (
    <div className="App">
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      {/* Header */}
      <header className="app-header-main">
        <h1 className="app-title">Literary Genre Explorer</h1>
        <span className="app-subtitle">Discover genres &amp; their most influential books</span>
      </header>

      {/* Main Content */}
      <main className="app-main-content">
        {/* Genre Selection Area */}
        <section className="genre-selector-section">
          {/* GenreSelector (searchable dropdown) */}
          <GenreSelector
            value={selectedGenre}
            onGenreSelect={handleGenreSelect}
          />
        </section>

        {/* Genre Summary Section (placeholder) */}
        <section className="genre-summary-section">
          {/* Placeholder: Genre summary (from Wikipedia) */}
          <div className="placeholder summary-placeholder">
            Short genre overview will appear here.
          </div>
        </section>

        {/* Book Grid Section (placeholder) */}
        <section className="book-grid-section">
          {/* Placeholder: Responsive grid of books */}
          <div className="placeholder book-grid-placeholder">
            Grid of books will appear here.
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
