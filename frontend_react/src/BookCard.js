import React from "react";
import PropTypes from "prop-types";

/*
  PUBLIC_INTERFACE
  BookCard component.

  Props:
    - book: {
        id: string,
        title: string,
        authors: string[],
        description: string,
        thumbnail: string, // (cover image url)
        previewLink: string
      }

  Renders a visually separated card showing book cover, title, author(s), description (truncated), and a preview link.
*/
function BookCard({ book }) {
  const { title, authors, description, thumbnail, previewLink } = book;

  // Truncate description to ~200 chars, word boundary
  const truncate = (text, maxLen = 200) => {
    if (!text) return "";
    if (text.length <= maxLen) return text;
    let end = text.lastIndexOf(" ", maxLen);
    if (end === -1) end = maxLen;
    return text.slice(0, end) + "…";
  };

  return (
    <div className="book-card" tabIndex={0} aria-label={`Book: ${title}`}>
      <div className="book-card-image-wrap">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Cover of ${title}`}
            className="book-card-thumbnail"
            loading="lazy"
          />
        ) : (
          <div className="book-card-noimage" aria-label="No cover available">
            No Image
          </div>
        )}
      </div>
      <div className="book-card-content">
        <h3 className="book-card-title">{title}</h3>
        <div className="book-card-authors">
          {authors && authors.length > 0
            ? authors.join(", ")
            : "Unknown author"}
        </div>
        <div className="book-card-desc">
          {description ? truncate(description) : <span style={{ opacity: 0.56 }}>No description available.</span>}
        </div>
        {previewLink &&
          <a
            className="book-preview-link"
            href={previewLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Preview "${title}" on Google Books`}
          >
            Preview &rarr;
          </a>
        }
      </div>
    </div>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    previewLink: PropTypes.string
  }).isRequired
};

export default BookCard;
