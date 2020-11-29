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
                        className="btn mr-2 arrow btn-dark-yellow p-1"
                        onClick={() => {
                            scroll(-width);
                        }}
                    >
                        <svg
                            width="1.8em"
                            height="1.5em"
                            viewBox="0 0 16 16"
                            class="bi bi-chevron-left"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                            />
                        </svg>
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
                        className="btn ml-2 arrow btn-dark-yellow p-1"
                        onClick={() => {
                            scroll(width);
                        }}
                    >
                        <svg
                            width="1.8em"
                            height="1.5em"
                            viewBox="0 0 16 16"
                            class="bi bi-chevron-right"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
