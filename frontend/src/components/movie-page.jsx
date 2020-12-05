import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReviewSection from './review-section';

export default function MoviePage(props) {
    const history = useHistory();
    const user = useSelector((state) => state.userReducer);
    const [isWL, setisWL] = useState(null);
    const [isLiked, setisLiked] = useState(null);
    const [movie, setMovie] = useState({});

    useEffect(() => {
        // get movie request
        axios
            .get('http://localhost:4000/movies/movie/' + props._id)
            .then((response) => {
                setMovie(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (movie.Title) {
            document.title = movie.Title + ' | Not IMDb';
        }

        if (user.currentUser) {
            if (user.currentUser.Liked.find((item) => item == movie._id)) {
                setisLiked(true);
            }

            if (user.currentUser.WatchList.find((item) => item == movie._id)) {
                setisWL(true);
            }
        }
    }, [movie, user]);

    function watchListClick() {
        let params = {};

        if (isWL) {
            setisWL(false);

            params = {
                id: user.currentUser._id,
                removeWL: movie._id,
            };
        } else {
            setisWL(true);

            params = {
                id: user.currentUser._id,
                addWL: movie._id,
            };
        }

        // Post request to backend
        axios({
            method: 'put',
            url: 'http://localhost:4000/api/account/updateLists',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(params),
        }).then((res) => {
            console.log(res);
        });
    }

    function likedClick() {
        let params = {};

        if (isLiked) {
            setisLiked(false);

            params = {
                id: user.currentUser._id,
                removeLiked: movie._id,
            };
        } else {
            setisLiked(true);

            params = {
                id: user.currentUser._id,
                addLiked: movie._id,
            };
        }

        // Post request to backend
        axios({
            method: 'put',
            url: 'http://localhost:4000/api/account/updateLists',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(params),
        }).then((res) => {
            console.log(res);
        });
    }

    // map genres into elements
    function getGenres(string) {
        if (string) {
            return (
                <h5>
                    {string.split(',').map((genre) => {
                        return (
                            <span className="badge badge-secondary m-1">
                                {genre}
                            </span>
                        );
                    })}
                </h5>
            );
        }
    }

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames="fade"
            unmountOnExit
        >
            <div className="movie-page mt-3">
                <div className="position-relative">
                    <img className="background-custom" src={movie.Poster}></img>
                    <div className="background-cover opacity-80"></div>

                    <div className="container rounded p-3 text-white bg-transparent movie-page-container">
                        <img className="mr-4 poster" src={movie.Poster}></img>
                        <div className="d-flex flex-column align-items-start mr-2">
                            <div>
                                <h2 className="m-1">
                                    {movie.Title} - {movie.Year}
                                </h2>
                                <h5>
                                    <span className="badge badge-info m-1">
                                        {movie.Type
                                            ? movie.Type.charAt(
                                                  0
                                              ).toUpperCase() +
                                              movie.Type.slice(1)
                                            : ''}
                                    </span>
                                    <span className="badge badge-warning m-1">
                                        Rated: {movie.Rated}
                                    </span>
                                    <span className="badge badge-primary m-1">
                                        {movie.Runtime}
                                    </span>
                                    <span className="badge badge-danger m-1">
                                        {movie.Released}
                                    </span>
                                    <span className="badge badge-success m-1">
                                        {movie.Language}
                                    </span>
                                </h5>

                                <div>{getGenres(movie.Genre)}</div>
                            </div>
                            <div className="d-flex flex-column justify-content-center w-75 p-1 mt-2">
                                <p>{movie.Plot}</p>
                            </div>
                        </div>

                        <div className="d-flex flex-column justify-content-between align-items-end w-25 mb-3">
                            <h3 className="d-flex justify-content-center">
                                <span className="badge badge-warning m-1">
                                    {movie.imdbRating}
                                    <br />
                                    <small>IMDb</small>
                                </span>
                                <span
                                    className={'badge m-1'.concat(
                                        movie.Metascore < 50
                                            ? ' badge-danger'
                                            : ' badge-success'
                                    )}
                                >
                                    {movie.Metascore}
                                    <br />
                                    <small>Metascore</small>
                                </span>
                            </h3>

                            <div className="d-flex flex-column w-100">
                                <button
                                    className={
                                        isWL == true
                                            ? 'btn btn-success'
                                            : 'btn btn-outline-info'
                                    }
                                    onClick={() => {
                                        if (user.currentUser) {
                                            watchListClick();
                                        } else {
                                            history.push('/login');
                                        }
                                    }}
                                >
                                    {isWL == true ? '✓ Saved' : '+ For Later'}
                                </button>

                                <br />
                                <button
                                    className={
                                        isLiked == true
                                            ? 'btn btn-danger'
                                            : 'btn btn-outline-danger'
                                    }
                                    onClick={() => {
                                        if (user.currentUser) {
                                            likedClick();
                                        } else {
                                            history.push('/login');
                                        }
                                    }}
                                >
                                    {isLiked == true ? 'Liked' : 'Like'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container rounded p-3 text-white bg-transparent">
                    <h2>Info</h2>
                    <hr />
                    <div>
                        <h5 className="d-flex">
                            <b className="text-info w-20">Director</b>
                            <span className="w-75 ml-2">{movie.Director}</span>
                        </h5>
                        <br />
                        <h5 className="d-flex">
                            <b className="text-info w-20">Writer</b>
                            <span className="w-75 ml-2"> {movie.Writer}</span>
                        </h5>
                        <br />
                        <h5 className="d-flex">
                            <b className="text-info w-20">Cast</b>
                            <span className="w-75 ml-2"> {movie.Actors}</span>
                        </h5>
                        <br />
                        <h5 className="d-flex">
                            <b className="text-info w-20">Production</b>
                            <span className="w-75 ml-2">
                                {movie.Production}
                            </span>
                        </h5>
                        <br />
                        <h5 className="d-flex">
                            <b className="text-info w-20">Awards</b>
                            <span className="w-75 ml-2"> {movie.Awards}</span>
                        </h5>
                    </div>
                </div>

                <ReviewSection movie={movie} />
            </div>
        </CSSTransition>
    );
}
