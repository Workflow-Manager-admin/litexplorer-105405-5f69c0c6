import React, { useState, useEffect } from 'react';
import './App.css';
import GenreSelector from './GenreSelector';
import GenreSummary from './GenreSummary';
import BooksGrid from './BooksGrid';

/*
  PUBLIC_INTERFACE
  Main App layout for the Literary Genre Explorer.

  Handles:
    - Theme selection (light/dark) and applies CSS variable.
    - Genre selection state.
    - Propagating only essential props to subcomponents.
    - Ensures state stays at appropriate owner layer.
    - Assembles and coordinates subcomponents responsively.
*/
function App() {
  const [theme, setTheme] = useState('light');
  const [selectedGenre, setSelectedGenre] = useState(''); // Main app state: current genre

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div className="App">
      {/* Theme Toggle: sits above main layout for easy access */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      {/* App header */}
      <header className="app-header-main">
        <h1 className="app-title">Literary Genre Explorer</h1>
        <span className="app-subtitle">
          Discover genres & their most influential books
        </span>
      </header>
      {/* Main content, all state management flows from App */}
      <main className="app-main-content">
        {/* Genre Selection */}
        <section className="genre-selector-section" aria-label="Genre selection area">
          <GenreSelector
            value={selectedGenre}
            onGenreSelect={handleGenreSelect}
            // Optionally could add genres prop here for expansion
          />
        </section>
        {/* Genre summary */}
        <section className="genre-summary-section" aria-label="Genre summary area">
          <GenreSummary genre={selectedGenre} />
        </section>
        {/* Book grid */}
        <section className="book-grid-section" aria-label="Books grid area">
          <BooksGrid genre={selectedGenre} />
        </section>
      </main>
    </div>
  );
}

export default App;
