import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

console.log(
  "TMDB API key:",
  API_KEY ? "FOUND" : "NOT FOUND"
);

const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getTrending = async () => {
  try {
    const response = await api.get("/trending/all/week");
    return response.data.results;
  } catch (error) {
    console.error(
      "TMDB ERROR:",
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getPopularMovies = async () => {
  const response = await api.get("/movie/popular");
  return response.data.results;
};

export const getTopRatedMovies = async () => {
  const response = await api.get("/movie/top_rated");
  return response.data.results;
};

export const getMovieDetails = async (id, type = "movie") => {
  const response = await api.get(`/${type}/${id}`);
  return response.data;
};

export const getMovieVideos = async (id, type = "movie") => {
  const response = await api.get(`/${type}/${id}/videos`);
  return response.data.results;
};