import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!url.trim()) {
      setError("Paste a URL first.");
      setShortUrl("");
      return;
    }

    setError("");
    setCopied(false);
    setShortUrl("");
    setShowQR(false);
    setLoading(true);

    try {
      const response = await fetch(
        "https://shortly-s9y0.onrender.com/shorten",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            original_url: url.trim(),
          }),
        }
      );

      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          typeof errorData.detail === "string"
            ? errorData.detail
            : "Failed to shorten URL."
        );
      }

      // Read successful response
      const data = await response.json();

      // Build complete shortened URL
      setShortUrl(
        `https://shortly-s9y0.onrender.com/${data.shortened_url}`
      );
    } catch (error) {
      console.error("URL shortening error:", error);

      setError(
        error.message ||
          "Unable to connect to the URL Shortener API."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Copy failed:", error);
      setError("Unable to copy the shortened URL.");
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById("shortly-qr-code");

    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "shortly-qr-code.png";

    downloadLink.click();
  };

  return (
    <div className="app">
      {/* Backdrop */}
      <div
        className="orb orb-coral"
        aria-hidden="true"
      ></div>

      <div
        className="orb orb-citrus"
        aria-hidden="true"
      ></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-mark">
            <span className="logo-long"></span>
            <span className="logo-short"></span>
          </span>

          <span className="logo-text">
            Shortly
          </span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
        </div>
      </nav>

      {/* Main Section */}
      <main className="hero" id="home">
        <div className="hero-content">

          {/* Badge */}
          <div className="badge">
            Fast · Simple · Secure
          </div>

          {/* Heading */}
          <h1>
            Turn long links
            <br />
            into{" "}
            <span className="highlight">
              short ones.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="subtitle">
            Paste a URL, get something small enough
            to text, tweet, or say out loud.
          </p>

          {/* URL Form */}
          <form
            className="url-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="input-wrapper">

              <span
                className="link-icon"
                aria-hidden="true"
              >
                🔗
              </span>

              <input
                type="url"
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                aria-label="Long URL to shorten"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Shortening..."
              ) : (
                <>
                  Shorten URL
                  <span aria-hidden="true">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <p
              className="error-text"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Result */}
          {shortUrl && (
            <>
              <div className="result-card">

                <div>
                  <p className="result-label">
                    Your shortened URL
                  </p>

                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="short-url"
                  >
                    {shortUrl}
                  </a>
                </div>

                <div className="result-actions">
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={handleCopy}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>

                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => setShowQR(!showQR)}
                  >
                    {showQR ? "Hide QR" : "QR Code"}
                  </button>
                </div>
              </div>

              {/* QR Code */}
              {showQR && (
                <div className="qr-card">

                  <p className="result-label">
                    Scan to open
                  </p>

                  <div className="qr-container">
                    <QRCodeCanvas
                      id="shortly-qr-code"
                      value={shortUrl}
                      size={220}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <button
                    type="button"
                    className="copy-btn qr-download-btn"
                    onClick={handleDownloadQR}
                  >
                    Download QR
                  </button>
                </div>
              )}
            </>
          )}

          {/* Privacy Message */}
          <p className="privacy-text">
            Your URLs are processed securely through our API.
          </p>
        </div>
      </main>

      {/* Features */}
      <section
        className="features"
        id="about"
      >
        <div className="feature">
          <div
            className="feature-icon"
            aria-hidden="true"
          >
            ⚡
          </div>

          <h3>Lightning fast</h3>

          <p>
            Generate short links instantly with
            our FastAPI backend.
          </p>
        </div>

        <div className="feature">
          <div
            className="feature-icon"
            aria-hidden="true"
          >
            🔒
          </div>

          <h3>Reliable</h3>

          <p>
            Your shortened URLs are stored safely
            in PostgreSQL.
          </p>
        </div>

        <div className="feature">
          <div
            className="feature-icon"
            aria-hidden="true"
          >
            📋
          </div>

          <h3>Easy to share</h3>

          <p>
            Copy your shortened URL and share it
            anywhere.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;