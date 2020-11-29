import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import MovieCard from './movie-card';
import axios from 'axios';

const genres = [
    'Action',
    'Comedy',
    'Horror',
    'Romance',
    'Drama',
    'Animation',
    'Fantasy',
    'Sci-Fi',
    'Thriller',
    'Family',
    'Adventure',
    'Crime',
    'Mystery',
    'War',
    'Music',
    'Musical',
    'Western',
    'History',
    'Biography',
    'Sport',
];

export default function BrowsePage() {
    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            axios
                .get('http://localhost:4000/movies', {
                    params: { search: search, genre: genre, year: year },
                })
                .then((response) => {
                    setMovies(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }, 250);

        return () => clearTimeout(delayDebounceFn);
    }, [search, genre, year]);

    function resetFilters() {
        setGenre('');
        setYear('');
    }

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames="fade"
            unmountOnExit
        >
            <div className="d-flex flex-column align-items-center pt-4">
                <div className="mb-3 text-info">
                    <h1>Movies</h1>
                </div>
                <div className="container rounded p-3 mb-4 d-flex align-items-center justify-content-around w-100">
                    <input
                        className="browse-search w-75"
                        placeholder="Search... "
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    ></input>
                </div>
                <div className="d-flex justify-content-around align-items-center">
                    <div class="input-group m-1">
                        <div class="input-group-prepend">
                            <button
                                class="btn btn-dark-info"
                                type="button"
                                onClick={() => {
                                    setGenre('');
                                }}
                            >
                                Genre
                            </button>
                        </div>
                        <select
                            class="custom-select"
                            id="genreSelect"
                            value={genre}
                            onChange={(e) => {
                                setGenre(e.target.value);
                            }}
                        >
                            <option selected></option>
                            {genres.map((genre) => {
                                return <option value={genre}>{genre}</option>;
                            })}
                        </select>
                    </div>
                    <div class="input-group m-1">
                        <div class="input-group-prepend">
                            <button
                                class="btn btn-dark-info"
                                type="button"
                                onClick={() => {
                                    setYear('');
                                }}
                            >
                                Year
                            </button>
                        </div>

                        <input
                            type="text"
                            class="form-control"
                            maxLength="4"
                            value={year}
                            onChange={(e) => {
                                setYear(e.target.value);
                            }}
                        />
                    </div>{' '}
                    <div class="input-group m-1">
                        <button
                            class="btn btn-dark-danger"
                            type="button"
                            onClick={() => {
                                resetFilters();
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
                <div className="browse-grid">
                    {movies.map(function (currentMovie, i) {
                        return (
                            <MovieCard
                                movie={currentMovie}
                                key={currentMovie._id}
                            />
                        );
                    })}
                </div>
            </div>
        </CSSTransition>
    );
}
