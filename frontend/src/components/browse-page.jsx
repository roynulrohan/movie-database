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
            <div className="d-flex flex-column justify-content-center align-items-center pt-4">
                <div className="mb-3 text-info">
                    <h1>Movies</h1>
                </div>
                <div className="container rounded p-3 mb-4 d-flex align-items-center justify-content-around w-100 position-relative">
                    <input
                        className="browse-search w-75"
                        placeholder="Search... "
                        type="text"
                        spellcheck="false"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    ></input>
                    <svg
                        onClick={() => {
                            setSearch('');
                        }}
                        display={search ? '' : 'none'}
                        width="2em"
                        height="2em"
                        viewBox="0 0 16 16"
                        class="bi bi-backspace-fill backspace"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M15.683 3a2 2 0 0 0-2-2h-7.08a2 2 0 0 0-1.519.698L.241 7.35a1 1 0 0 0 0 1.302l4.843 5.65A2 2 0 0 0 6.603 15h7.08a2 2 0 0 0 2-2V3zM5.829 5.854a.5.5 0 1 1 .707-.708l2.147 2.147 2.146-2.147a.5.5 0 1 1 .707.708L9.39 8l2.146 2.146a.5.5 0 0 1-.707.708L8.683 8.707l-2.147 2.147a.5.5 0 0 1-.707-.708L7.976 8 5.829 5.854z"
                        />
                    </svg>
                </div>
                <div className="d-flex justify-content-center align-items-center">
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
                            class={
                                genre == ''
                                    ? 'custom-select text-secondary'
                                    : 'custom-select text-white'
                            }
                            id="genreSelect"
                            value={genre}
                            onChange={(e) => {
                                setGenre(e.target.value);
                            }}
                        >
                            <option
                                value=""
                                selected
                                className="text-secondary"
                            >
                                Genre
                            </option>
                            {genres.map((genre) => {
                                return (
                                    <option
                                        value={genre}
                                        className="text-white"
                                    >
                                        {genre}
                                    </option>
                                );
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
                            placeholder="Year"
                            value={year}
                            onChange={(e) => {
                                setYear(e.target.value);
                            }}
                        />
                    </div>
                    <div class="input-group-clear m-1">
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
