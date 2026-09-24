import { useEffect, useState } from "react";

import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getMovieDetails,
  getMovieVideos,
} from "./api";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function MovieRow({ title, movies, id, onMovieClick }) {
  return (
    <section className="movie-section" id={id}>
      <h2>{title}</h2>

      <div className="movie-row">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie.id}
            onClick={() => onMovieClick(movie)}
          >
            {movie.poster_path ? (
              <img
                src={`${IMAGE_URL}${movie.poster_path}`}
                alt={movie.title || movie.name || "Movie"}
              />
            ) : (
              <div className="no-poster">No Image</div>
            )}

            <p>{movie.title || movie.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          trendingMovies,
          popularMovies,
          topRatedMovies,
        ] = await Promise.all([
          getTrending(),
          getPopularMovies(),
          getTopRatedMovies(),
        ]);

        setTrending(trendingMovies);
        setPopular(popularMovies);
        setTopRated(topRatedMovies);
      } catch (err) {
        console.error("Movie loading error:", err);
        setError(
          "Unable to load movies. Please check your TMDB API key."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goHome = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const showMyList = () => {
    alert("My List feature will be added next ❤️");
  };

  const handleMovieClick = async (movie) => {
    try {
      setDetailsLoading(true);
      setSelectedMovie(null);
      setTrailerKey(null);
      setShowTrailer(false);

      const type = movie.media_type === "tv" ? "tv" : "movie";

      const [details, videos] = await Promise.all([
        getMovieDetails(movie.id, type),
        getMovieVideos(movie.id, type),
      ]);

      // Find official YouTube trailer first
      const trailer =
        videos.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official === true
        ) ||
        videos.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer"
        ) ||
        videos.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Teaser"
        );

      setSelectedMovie({
        ...details,
        media_type: type,
      });

      setTrailerKey(trailer?.key || null);
    } catch (err) {
      console.error("Details error:", err);
      alert("Unable to load movie details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setTrailerKey(null);
    setShowTrailer(false);
  };

  const openTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true);
    }
  };

  const closeTrailer = () => {
    setShowTrailer(false);
  };

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <button
          className="logo-button"
          onClick={goHome}
        >
          NETFLIX CLOUD
        </button>

        <div className="nav-links">
          <button onClick={goHome}>
            Home
          </button>

          <button
            onClick={() =>
              scrollToSection("popular")
            }
          >
            Movies
          </button>

          <button
            onClick={() =>
              scrollToSection("top-rated")
            }
          >
            Series
          </button>

          <button onClick={showMyList}>
            My List
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="hero">
        <div className="hero-content">
          <h2>
            Unlimited Movies, TV Shows and More
          </h2>

          <p>
            Watch your favorite movies and TV shows
            in one place.
          </p>

          <button
            className="watch-button"
            onClick={() =>
              scrollToSection("trending")
            }
          >
            ▶ Start Watching
          </button>
        </div>
      </section>

      {/* ================= LOADING ================= */}

      {loading && (
        <h2 className="status">
          Loading movies... 🎬
        </h2>
      )}

      {/* ================= ERROR ================= */}

      {error && (
        <h2 className="status error">
          {error}
        </h2>
      )}

      {/* ================= MOVIE ROWS ================= */}

      {!loading && !error && (
        <>
          <MovieRow
            title="🔥 Trending Now"
            movies={trending}
            id="trending"
            onMovieClick={handleMovieClick}
          />

          <MovieRow
            title="🎬 Popular Movies"
            movies={popular}
            id="popular"
            onMovieClick={handleMovieClick}
          />

          <MovieRow
            title="⭐ Top Rated"
            movies={topRated}
            id="top-rated"
            onMovieClick={handleMovieClick}
          />
        </>
      )}

      {/* ================= DETAILS LOADING ================= */}

      {detailsLoading && (
        <div className="modal-loading">
          <h2>
            Loading details... 🎬
          </h2>
        </div>
      )}

      {/* ================= MOVIE DETAILS MODAL ================= */}

      {selectedMovie && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="movie-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* CLOSE BUTTON */}

            <button
              className="close-button"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* POSTER */}

            {selectedMovie.poster_path ? (
              <img
                className="modal-poster"
                src={`${IMAGE_URL}${selectedMovie.poster_path}`}
                alt={
                  selectedMovie.title ||
                  selectedMovie.name ||
                  "Movie"
                }
              />
            ) : (
              <div className="modal-poster no-poster">
                No Image
              </div>
            )}

            {/* DETAILS */}

            <div className="modal-content">
              <h2>
                {selectedMovie.title ||
                  selectedMovie.name}
              </h2>

              <p className="rating">
                ⭐{" "}
                {selectedMovie.vote_average
                  ? selectedMovie.vote_average.toFixed(
                      1
                    )
                  : "N/A"}
                /10
              </p>

              <p>
                📅{" "}
                {selectedMovie.release_date ||
                  selectedMovie.first_air_date ||
                  "Release date unavailable"}
              </p>

              {selectedMovie.runtime && (
                <p>
                  ⏱️ {selectedMovie.runtime} minutes
                </p>
              )}

              <p className="overview">
                {selectedMovie.overview ||
                  "No description available."}
              </p>

              {/* TRAILER BUTTON */}

              {trailerKey ? (
                <button
                  className="modal-watch-button"
                  onClick={openTrailer}
                >
                  ▶ Watch Trailer
                </button>
              ) : (
                <p className="no-trailer">
                  Trailer not available for this title.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TRAILER PLAYER ================= */}

      {showTrailer && trailerKey && (
        <div
          className="modal-overlay"
          onClick={closeTrailer}
        >
          <div
            className="trailer-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              position: "relative",
              width: "900px",
              maxWidth: "95%",
              background: "#000",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            {/* CLOSE TRAILER */}

            <button
              className="close-button"
              onClick={closeTrailer}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                zIndex: 10,
              }}
            >
              ✕
            </button>

            {/* YOUTUBE PLAYER */}

            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "56.25%",
                marginTop: "10px",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title="Movie Trailer"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;