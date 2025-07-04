import React, { useState, useEffect } from 'react';
import './App.css';
import GenreSelector from './GenreSelector';
import GenreSummary from './GenreSummary';
import BooksGrid from './BooksGrid';

/*
  PUBLIC_INTERFACE
  Main App layout for the Literary Genre Explorer.
  - Header at top
  - Section for genre selection (searchable input/dropdown)
  - Section for genre summary (fetched from Wikipedia)
  - Section for grid of books (from Google Books API)
  - Theme toggle
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

        {/* Genre Summary Section */}
        <section className="genre-summary-section">
          <GenreSummary genre={selectedGenre} />
        </section>

        {/* Book Grid Section (interactive, responsive) */}
        <section className="book-grid-section">
          <BooksGrid genre={selectedGenre} />
        </section>
      </main>
    </div>
  );
}

export default App;
