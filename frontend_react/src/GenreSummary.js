import React, { useEffect, useState } from "react";

/*
  PUBLIC_INTERFACE
  GenreSummary component.

  Props:
    - genre: Selected genre (string)
  Displays a short summary paragraph for the genre using the Wikipedia API.
  Shows loading and error states. If genre is blank, renders a friendly prompt.
*/
function GenreSummary({ genre }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFetched, setLastFetched] = useState(""); // memoize fetch for the same genre

  useEffect(() => {
    // If no genre selected, clear summary and states
    if (!genre) {
      setSummary("");
      setError("");
      setLoading(false);
      setLastFetched("");
      return;
    }

    // Avoid re-fetching if user selects the same genre again
    if (genre === lastFetched) return;

    setLoading(true);
    setError("");
    setSummary("");

    // Wikipedia summary API endpoint
    // Explanation:
    // - We use the first word only capitalized for title (approx.), spaces -> underscores
    // - Example: https://en.wikipedia.org/api/rest_v1/page/summary/Science_fiction
    const wikipediaTitle = genre.replace(/\s/g, "_");
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikipediaTitle)}`;

    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          // Try to provide a fallback or better error
          throw new Error("Summary not found on Wikipedia.");
        }
        const data = await response.json();
        if (data && data.extract) {
          setSummary(data.extract);
          setLastFetched(genre);
        } else {
          throw new Error("No summary available for this genre.");
        }
      })
      .catch((err) => {
        setError(err.message);
        setLastFetched(genre);
      })
      .finally(() => setLoading(false));
  }, [genre, lastFetched]);

  if (!genre) {
    return (
      <div className="placeholder summary-placeholder">
        Select a genre to see its brief overview here.
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="placeholder summary-placeholder"
        aria-busy="true"
        aria-live="polite"
        style={{ color: "#6366f1" }}
      >
        Loading summary…
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="placeholder summary-placeholder"
        style={{ color: "#c83535" }}
        role="alert"
      >
        Sorry, couldn't fetch summary: {error}
      </div>
    );
  }

  return (
    <div className="summary-content" style={{ fontSize: "1.06rem", lineHeight: 1.55 }}>
      {summary}
    </div>
  );
}

export default GenreSummary;
