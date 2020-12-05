import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';

import Review from './review';

export default function ReviewSection(props) {
    const user = useSelector((state) => state.userReducer);
    const history = useHistory();
    const [reviews, setReviews] = useState([]);
    const [reviewHidden, setReviewHidden] = useState(true);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewScore, setReviewScore] = useState('0');
    const [reviewBody, setReviewBody] = useState('');

    useEffect(() => {
        if (props.movie.Ratings) {
            setReviews(props.movie.Ratings);
        }
    }, [props.movie]);

    function submitReview() {
        let params = {
            id: props.movie._id,
            addReview: {
                Source: user.currentUser.Username,
                Value: reviewScore,
                Title: reviewTitle,
                Body: reviewBody,
            },
        };

        // Post request to backend
        axios({
            method: 'put',
            url: 'http://localhost:4000/movies/update',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(params),
        }).then((res) => {
            console.log(res);
            if (res.data.success) {
                setReviewTitle('');
                setReviewBody('');
                setReviewScore('0');
                setReviewHidden(true);
                setReviews([]);
                setReviews(res.data.updated.Ratings);
            }
        });
    }

    function removeReview(review) {
        let params = {
            id: props.movie._id,
            removeReview: {
                Source: user.currentUser.Username,
                Value: review.Value,
                Title: review.Title,
                Body: review.Body,
            },
        };

        // Post request to backend
        axios({
            method: 'put',
            url: 'http://localhost:4000/movies/update',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(params),
        }).then((res) => {
            console.log(res);
            setReviews([]);
            setReviews(res.data.updated.Ratings);
        });
    }
    function getReviewBox() {
        return (
            <div class="container rounded input-group d-flex flex-column w-100 mb-3 review-container p-2">
                <div className="d-flex justify-content-between">
                    <div class="input-group m-1 w-75">
                        <div class="input-group-prepend">
                            <button
                                class="btn btn-dark-info"
                                type="button"
                                onClick={() => {
                                    setReviewTitle('');
                                }}
                            >
                                Title
                            </button>
                        </div>

                        <input
                            type="text"
                            class="form-control"
                            placeholder="Title..."
                            value={reviewTitle}
                            onChange={(e) => {
                                setReviewTitle(e.target.value);
                            }}
                        />
                    </div>
                    <div class="input-group m-1 w-auto">
                        <div class="input-group-prepend">
                            <button
                                class="btn btn-dark-info"
                                type="button"
                                onClick={() => {
                                    setReviewScore('0');
                                }}
                            >
                                Score
                            </button>
                        </div>

                        <input
                            type="number"
                            min="0"
                            max="10"
                            dir="rtl"
                            class="form-control"
                            placeholder="Score..."
                            value={reviewScore}
                            onChange={(e) => {
                                setReviewScore(e.target.value);
                            }}
                        />

                        <div class="input-group-append">
                            <span class="input-group-text text-info">/10</span>
                        </div>
                    </div>
                </div>
                <div class="review-body m-1">
                    <textarea
                        type="text"
                        class="form-control"
                        maxLength="300"
                        placeholder="Review..."
                        value={reviewBody}
                        onChange={(e) => {
                            setReviewBody(e.target.value);
                        }}
                    />
                </div>
                <div class="m-1 mt-3 d-flex justify-content-end">
                    <button
                        class="btn btn-warning"
                        disabled={!(reviewTitle && reviewBody)}
                        onClick={() => {
                            submitReview();
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="container rounded p-3 text-white bg-transparent">
            <div className="d-flex justify-content-between">
                <h2>Reviews</h2>
                <button
                    className="btn btn-info"
                    onClick={() => {
                        if (user.currentUser) {
                            if (reviewHidden) {
                                setReviewHidden(false);
                            } else {
                                setReviewHidden(true);
                            }
                        } else {
                            history.push('/login');
                        }
                    }}
                >
                    Write a Review
                </button>
            </div>
            <hr />
            {!reviewHidden && (
                <CSSTransition
                    in={true}
                    appear={true}
                    timeout={600}
                    classNames="fade"
                    unmountOnExit
                >
                    {getReviewBox()}
                </CSSTransition>
            )}
            {reviews &&
                reviews.map(function (rating, i) {
                    return (
                        <Review
                            review={rating}
                            removeCallback={removeReview}
                            key={props.movie._id + 'review' + i}
                        />
                    );
                })}
        </div>
    );
}
