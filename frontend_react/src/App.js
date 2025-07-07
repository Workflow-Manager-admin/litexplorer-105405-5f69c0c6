import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
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

  // PUBLIC_INTERFACE
  return (
    <div className="App" style={{ minHeight: "100vh" }}>
      <header className="explorer-header">
        <h1 className="app-title">
          <span style={{ color: "var(--accent-color)" }}>Genre</span> Explorer
        </h1>
        <p className="subtitle">
          Discover popular books and summaries for your favorite literary genres.
        </p>
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
          <h2 className="genre-title">{genre.name}</h2>
          <p className="genre-description">{genre.summary}</p>
        </section>

        <section className="books-grid-section" aria-label="Books">
          <h3 className="books-title">
            Influential &amp; Popular Books in{" "}
            <span style={{ color: "var(--accent-color)" }}>{genre.name}</span>
          </h3>
          <div className="books-grid">
            {bookList.map((book, idx) => (
              <div className="book-card" key={idx}>
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
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
