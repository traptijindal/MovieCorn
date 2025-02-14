import React, { useEffect, useState } from 'react';
import './MovieCorn.css';
import { GiAchievement } from 'react-icons/gi';

const MovieCorn = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovies = async () => {
    if (searchTerm.trim() === '') return;
    try {
      const url = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apiKey=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovieList(data.Search);
      } else {
        setMovieList([]);
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const defaultMovieId = 'tt0111161'

  const fetchMovieDetails = async (imdbID) => {
    try {
      const url = `https://www.omdbapi.com/?i=${imdbID}&apiKey=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.Response === 'True') {
        setSelectedMovie(data);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedMovie(null);
  };

  const handleMovieSelect = (imdbID) => {
    fetchMovieDetails(imdbID);
    setMovieList([]);
    setSearchTerm('');
  };

  useEffect(() => {
    fetchMovieDetails(defaultMovieId); 
  }, []);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchMovies();
    }, 500);
    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  return (
    <div className="container">
      <div className="search-box">
        <p>Search Movie:</p>
        <input
          placeholder="Search Movie Title..."
          onChange={handleInputChange}
          value={searchTerm}
        />
      </div>

      {movieList.length > 0 && (
        <ul className="movie-dropdown">
          {movieList.map((movie) => (
            <li
              key={movie.imdbID}
              onClick={() => handleMovieSelect(movie.imdbID)}
            >
              {movie.Title} ({movie.Year})
            </li>
          ))}
        </ul>
      )}

      {selectedMovie && (
        <div className="movie">
          <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
          <div className="desc">
            <h1>{selectedMovie.Title}</h1>
            <p>
              <span className="heading">Year:</span> {selectedMovie.Year}{' '}
              <span className="rating">Ratings: {selectedMovie.Rated}</span>{' '}
              <span>Released: {selectedMovie.Released}</span>
            </p>
            <p className="genre">
              <span className="heading">Genre:</span> {selectedMovie.Genre}
            </p>
            <p>
              <span className="heading">Writer:</span> {selectedMovie.Writer}
            </p>
            <p>
              <span className="heading">Actors:</span> {selectedMovie.Actors}
            </p>
            <p>
              <span className="heading">Plot:</span> {selectedMovie.Plot}
            </p>
            <p className="language">
              <span className="heading">Language:</span> {selectedMovie.Language}
            </p>
            <p className="won">
              <span className="icon">
                <GiAchievement />
              </span>
              {selectedMovie.Awards}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCorn;

