import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../actions';

export default function MovieCard(props) {
    const history = useHistory();
    const user = useSelector((state) => state.userReducer);
    const [isWL, setisWL] = useState(null);
    const [isLiked, setisLiked] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user.currentUser) {
            if (
                user.currentUser.Liked.find((item) => item == props.movie._id)
            ) {
                setisLiked(true);
            }

            if (
                user.currentUser.WatchList.find(
                    (item) => item == props.movie._id
                )
            ) {
                setisWL(true);
            }
        }
    }, [user]);

    function cardOnClick() {
        history.push('/movie/' + props.movie._id);
    }

    function watchListClick() {
        let params = {};

        if (isWL) {
            setisWL(false);
            params = {
                id: user.currentUser._id,
                removeWL: props.movie._id,
            };
        } else {
            setisWL(true);
            params = {
                id: user.currentUser._id,
                addWL: props.movie._id,
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
                removeLiked: props.movie._id,
            };
        } else {
            setisLiked(true);

            params = {
                id: user.currentUser._id,
                addLiked: props.movie._id,
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

    return props.movie ? (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames="fade"
            unmountOnExit
        >
            <div className="movie-card">
                <Card text="white">
                    <div
                        onClick={() => {
                            cardOnClick();
                        }}
                    >
                        <Card.Header>
                            <Card.Img variant="top" src={props.movie.Poster} />
                        </Card.Header>
                        <Card.Body>
                            <Card.Title className="poster-title" title={props.movie.Title}>
                                {props.movie.Title}
                            </Card.Title>

                            <h5 className="card-text d-flex justify-content-between">
                                <span className="badge badge-warning h-100 badge-pill w-25" title="IMDb Rating">
                                    {props.movie.imdbRating}
                                </span>{' '}
                                {props.movie.Metascore != 'N/A' ? (
                                    <span className="badge badge-success h-100 badge-pill w-25" title="Metascore">
                                        {props.movie.Metascore}
                                    </span>
                                ) : (
                                    ''
                                )}
                            </h5>
                        </Card.Body>
                    </div>
                    <Card.Footer>
                        <div className="d-flex justify-content-between">
                            <button
                                className={
                                    isWL == true
                                        ? 'btn btn-info'
                                        : 'btn btn-outline-info'
                                }
                                onClick={() => {
                                    if (user.currentUser) {
                                        watchListClick();
                                    } else {
                                        history.push({
                                            pathname: '/login',
                                            state: {
                                                redirectID: props.movie._id,
                                            },
                                        });
                                    }
                                }}
                            >
                                {isWL == true ? '✓ Saved' : '+ For Later'}
                            </button>
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
                                        history.push({
                                            pathname: '/login',
                                            state: {
                                                redirectID: props.movie._id,
                                            },
                                        });
                                    }
                                }}
                            >
                                {isLiked == true ? 'Liked' : 'Like'}
                            </button>
                        </div>
                    </Card.Footer>
                </Card>
            </div>
        </CSSTransition>
    ) : (
        <div></div>
    );
}
