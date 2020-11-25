import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function MoviePage(props) {
    const history = useHistory();
    const user = useSelector((state) => state.userReducer);
    const [isWL, setisWL] = useState(null);
    const [isLiked, setisLiked] = useState(null);
    const [movie, setmovie] = useState({});

    useEffect(() => {
        // get movie request
        axios
            .get('http://localhost:4000/movies/movie/' + props._id)
            .then((response) => {
                setmovie(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (user.currentUser) {
            if (user.currentUser.Liked.find((item) => item == movie._id)) {
                setisLiked(true);
            }

            if (user.currentUser.WatchList.find((item) => item == movie._id)) {
                setisWL(true);
            }
        }
    }, [movie,user]);

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
                <p>
                    {string.split(',').map((genre) => {
                        return (
                            <span className="badge badge-secondary m-1">
                                {genre}
                            </span>
                        );
                    })}
                </p>
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
            <div className="position-relative">
                <img className="background-custom" src={movie.Poster}></img>
                <div className="background-cover opacity-80"></div>

                <div className="p-4">
                    <div className="container rounded p-3 text-white">
                        <div className="d-flex">
                            <img
                                className="mr-4 poster"
                                src={movie.Poster}
                            ></img>
                            <div className="d-flex flex-column justify-content-between mr-4">
                                <div className="p-2">
                                    <div className="d-flex justify-content-between">
                                        <div className="w-70">
                                            <h3 className="m-1">
                                                {movie.Title} ({movie.Year})
                                            </h3>
                                            <h5 className="badge badge-info m-1">
                                                {movie.Type
                                                    ? movie.Type.charAt(
                                                          0
                                                      ).toUpperCase() +
                                                      movie.Type.slice(1)
                                                    : ''}
                                            </h5>
                                            <h5 className="badge badge-warning m-1">
                                                Rated: {movie.Rated}
                                            </h5>
                                            <h5 className="badge badge-primary m-1">
                                                {movie.Runtime}
                                            </h5>
                                            <h5 className="badge badge-danger m-1">
                                                {movie.Released}
                                            </h5>
                                            <h5 className="badge badge-success m-1">
                                                {movie.Language}
                                            </h5>

                                            <div>{getGenres(movie.Genre)}</div>

                                            <p className="m-1">{movie.Plot}</p>
                                        </div>

                                        <div className="w-auto mr-1">
                                            <h3>
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
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <div className="p-2 m-1 w-75">
                                        <h5>
                                            <span className="badge bg-secondary">
                                                Director
                                            </span>{' '}
                                            <small>: {movie.Director}</small>
                                        </h5>
                                        <h5>
                                            <span className="badge badge-secondary">
                                                Writer
                                            </span>{' '}
                                            <small>: {movie.Writer}</small>
                                        </h5>
                                        <h5>
                                            <span className="badge badge-secondary">
                                                Cast
                                            </span>{' '}
                                            <small>: {movie.Actors}</small>
                                        </h5>
                                        <h5>
                                            <span className="badge badge-secondary">
                                                Production
                                            </span>{' '}
                                            <small>: {movie.Production}</small>
                                        </h5>
                                        <h5>
                                            <span className="badge badge-secondary">
                                                Awards
                                            </span>{' '}
                                            <small>: {movie.Awards}</small>
                                        </h5>
                                    </div>

                                    <div className="d-flex flex-column justify-content-center w-25 ml-5">
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
                                            {isWL == true
                                                ? '✓ Saved'
                                                : '+ For Later'}
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
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}
