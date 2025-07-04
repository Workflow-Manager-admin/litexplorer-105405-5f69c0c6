import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";

/*
  PUBLIC_INTERFACE
  BooksGrid component.

  Props:
    - genre: string (selected literary genre)
  Fetches, displays, and handles loading/error state for popular books in the selected genre via Google Books API.
  Renders a responsive grid of BookCard components.
*/
function BooksGrid({ genre }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFetched, setLastFetched] = useState(""); // genre last fetched

  useEffect(() => {
    // If no genre selected, clear states
    if (!genre) {
      setBooks([]);
      setLoading(false);
      setError("");
      setLastFetched("");
      return;
    }
    // Prevent fetching if genre is already loaded
    if (genre === lastFetched) return;

    setLoading(true);
    setError("");
    setBooks([]);

    // Construct Google Books API URL. Use "subject:$GENRE" as query.
    // Example: https://www.googleapis.com/books/v1/volumes?q=subject:Science+Fiction&maxResults=15
    const q = `subject:${genre}`.replace(/\s+/g, "+");
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      q
    )}&maxResults=12&printType=books`;

    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not fetch books for this genre.");
        }
        const data = await response.json();
        if (!data.items || data.items.length === 0) {
          throw new Error("No books found for this genre.");
        }
        // Normalize book data
        const mapped = data.items
          .map((item) => {
            const info = item.volumeInfo || {};
            return {
              id: item.id,
              title: info.title || "Untitled",
              authors: info.authors || [],
              description: info.description || "",
              thumbnail:
                (info.imageLinks && info.imageLinks.thumbnail) ||
                (info.imageLinks && info.imageLinks.smallThumbnail) ||
                "",
              previewLink: info.previewLink || "",
            };
          })
          // Filter out books with no title, minimal info
          .filter((b) => b.title && (!!b.thumbnail || !!b.previewLink));
        setBooks(mapped);
        setLastFetched(genre);
      })
      .catch((err) => {
        setError(typeof err === "string" ? err : err.message);
        setLastFetched(genre);
      })
      .finally(() => setLoading(false));
  }, [genre, lastFetched]);

  if (!genre) {
    // Prompt user to select a genre to view books
    return (
      <div className="placeholder books-placeholder">
        Select a genre to explore popular or influential books here.
      </div>
    );
  }
  if (loading) {
    return (
      <div
        className="placeholder books-placeholder"
        aria-busy="true"
        aria-live="polite"
        style={{ color: "#374151" }}
      >
        Loading books…
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="placeholder books-placeholder"
        style={{ color: "#c83535" }}
        role="alert"
      >
        Sorry, couldn&apos;t fetch books: {error}
      </div>
    );
  }
  if (!books || books.length === 0) {
    return (
      <div className="placeholder books-placeholder">
        No books found for &quot;{genre}&quot;. Try a different genre.
      </div>
    );
  }
  return (
    <div className="books-grid" role="list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} role="listitem" />
      ))}
    </div>
  );
}

export default BooksGrid;
