import React from 'react';

// PUBLIC_INTERFACE
function Homepage({ onNavigateBooks }) {
  // Copyright-free Unsplash images and curated quotes
  const quotes = [
    {
      text: "A room without books is like a body without a soul.",
      author: "Marcus Tullius Cicero",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80"
    },
    {
      text: "There is no friend as loyal as a book.",
      author: "Ernest Hemingway",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80"
    },
    {
      text: "We read to know we are not alone.",
      author: "C.S. Lewis",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
    },
    {
      text: "Books are a uniquely portable magic.",
      author: "Stephen King",
      image: "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?auto=format&fit=crop&w=900&q=80"
    }
  ];
  // Pick a quote for mobile: randomly, for desktop carousel
  const [quoteIdx, setQuoteIdx] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((idx) => (idx + 1) % quotes.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const currentQuote = quotes[quoteIdx];

  return (
    <div
      className="homepage-root"
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}>
      <header
        style={{
          padding: '2rem 0 0.75rem 0',
          textAlign: 'center',
          background: '#fff',
          boxShadow: '0 2px 16px 0 rgba(99,102,241,0.04)',
          zIndex: 1,
        }}>
        <h1
          style={{
            fontSize: '2.65rem',
            fontWeight: 900,
            color: 'var(--primary-color, #374151)',
            letterSpacing: '-1.7px',
            marginBottom: 0,
          }}>
          <span style={{ color: 'var(--accent-color, #fbbf24)' }}>Lit</span>Explorer
        </h1>
        <p
          style={{
            color: 'var(--text-dim, #7b7b7b)',
            fontSize: '1.28rem',
            margin: '0.7rem 0 0.25rem',
            fontFamily: 'Georgia,Times,"Times New Roman",serif',
            fontStyle: 'italic',
            maxWidth: 540,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
          Where every page begins a new adventure.
        </p>
        <button
          onClick={onNavigateBooks}
          className="btn"
          style={{
            marginTop: '1.5rem',
            padding: '0.7em 2em',
            background: 'var(--secondary-color, #6366f1)',
            color: '#fff',
            borderRadius: '2em',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1.14em',
            cursor: 'pointer',
            boxShadow: '0 3px 8px rgba(99,102,241,0.09)',
            letterSpacing: '0.05em',
            transition: 'background 0.21s',
          }}
        >
          Explore Books
        </button>
      </header>
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1rem 2rem 1rem',
        }}>
        <div
          className="homepage-quote-card"
          style={{
            width: '100%',
            maxWidth: 640,
            borderRadius: '1.13em',
            background: 'linear-gradient(134deg, #fff 51%, #fbbf240d 97%)',
            boxShadow:
              '0 6px 32px 0 rgba(99,102,241,0.10), 0 1.5px 7px rgba(251,191,36,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            border: '1.5px solid var(--border-color, #e9ecef)',
          }}>
          <img
            src={currentQuote.image}
            alt={`Books/Artistic: Quote by ${currentQuote.author}`}
            style={{
              width: '100%',
              maxHeight: '240px',
              objectFit: 'cover',
              display: 'block',
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
              borderBottom: '1.5px solid var(--border-color, #e9ecef)'
            }}
          />
          <blockquote
            style={{
              fontFamily: 'Georgia,Times,"Times New Roman",serif',
              fontSize: '1.28em',
              color: 'var(--primary-color, #374151)',
              textAlign: 'center',
              margin: '1.7em 1em 1.1em 1em',
              fontStyle: 'italic',
              lineHeight: 1.38,
              letterSpacing: '-0.018em',
              position: 'relative',
              maxWidth: 510
            }}
          >“{currentQuote.text}”
            <footer
              style={{
                fontWeight: 600,
                marginTop: '1.28em',
                fontFamily: 'Segoe UI, Arial, sans-serif',
                color: 'var(--secondary-color, #6366f1)',
                fontSize: '1.08em'
              }}>
              — {currentQuote.author}
            </footer>
          </blockquote>
          <div
            style={{
              position: 'absolute',
              right: 16,
              bottom: 12,
              color: 'var(--accent-color, #fbbf24)',
              fontSize: '2.2em',
              opacity: 0.12,
              userSelect: 'none'
            }}>
            <span role="img" aria-label="books">📚</span>
          </div>
        </div>
      </main>
      <footer
        style={{
          textAlign: 'center',
          color: '#7b7b7b',
          paddingBottom: '1.7rem',
          paddingTop: '0.4rem',
          fontSize: '1rem',
        }}>
        <span>
          Imagery via <a href="https://unsplash.com/" style={{ color: 'var(--accent-color, #fbbf24)' }}>Unsplash</a>
        </span>
        &nbsp;·&nbsp;
        <span>
          Quotes from literary history
        </span>
      </footer>
    </div>
  );
}

export default Homepage;
