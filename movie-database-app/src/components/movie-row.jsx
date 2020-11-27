import React, { useState, useEffect } from 'react';

import axios from 'axios';
import MovieCard from './movie-card';
import { useSelector, useDispatch } from 'react-redux';

export default function MovieRow(props) {
    const user = useSelector((state) => state.userReducer);
    const scrollable = React.createRef();
    const [movies, setMovies] = useState([]);
    const [width, setwidth] = useState(0);

    useEffect(() => {
        if (props.movies) {
            // make movies request with given movie ids and setstate
            axios
                .get('http://localhost:4000/movies/' + props.movies)
                .then((response) => {
                    setMovies(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            // make movies request with given params and setstate
            axios
                .get('http://localhost:4000/movies', {
                    params: props.params,
                })
                .then((response) => {
                    setMovies(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        updateWindowDimensions();

        // resize event listener to get width of row
        window.addEventListener('resize', updateWindowDimensions);

        return () => {
            window.removeEventListener('resize', updateWindowDimensions);
        };
    }, [props.movies]);

    useEffect(() => {
        setwidth(scrollable.current.clientWidth);
    }, [scrollable]);

    function updateWindowDimensions() {
        if (scrollable.current) {
            setwidth(scrollable.current.clientWidth);
        }
    }

    // scroll function for row
    function scroll(offset) {
        updateWindowDimensions();
        if (scrollable.current) {
            scrollable.current.scrollLeft += offset;
        }
    }

    function setScroll(offset) {
        if (scrollable.current) {
            scrollable.current.scrollLeft = offset;
        }
    }

    return (
        <div className="movie-list-section">
            <div className="p-3">
                <h2
                    className="w-75 text-warning"
                    onClick={() => {
                        setScroll(0);
                    }}
                >
                    {props.title}
                </h2>

                <div className="d-flex align-items-center justify-content-between movie-list-container">
                    <button
                        className="btn mr-2 arrow btn-dark-yellow"
                        onClick={() => {
                            scroll(-width);
                        }}
                    >
                        {'<'}
                    </button>
                    <div ref={scrollable} className="movie-list pb-4">
                        {movies.map(function (currentMovie, i) {
                            return (
                                <MovieCard
                                    movie={currentMovie}
                                    key={props.title + currentMovie._id}
                                />
                            );
                        })}
                    </div>
                    <button
                        className="btn ml-2 arrow btn-dark-yellow"
                        onClick={() => {
                            scroll(width);
                        }}
                    >
                        {'>'}
                    </button>
                </div>
            </div>
        </div>
    );
}
