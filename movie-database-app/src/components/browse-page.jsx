import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import MovieCard from './movie-card';
import axios from 'axios';

export default function BrowsePage() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        // make movies request with given params and setstate
        axios
            .get('http://localhost:4000/movies')
            .then((response) => {
                setMovies(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames="fade"
            unmountOnExit
        >
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
        </CSSTransition>
    );
}
