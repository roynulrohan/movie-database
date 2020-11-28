import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import MovieCard from './movie-card';
import axios from 'axios';

export default function BrowsePage() {
    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            axios
                .get('http://localhost:4000/movies', {
                    params: { search: search },
                })
                .then((response) => {
                    setMovies(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames="fade"
            unmountOnExit
        >
            <div className="d-flex flex-column pt-4">
                <div className="container rounded p-3 d-flex flex-column align-items-center">
                    <div className="d-flex align-items-center justify-content-around w-100">
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
