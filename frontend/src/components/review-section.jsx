import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';

import Review from './review';

export default function ReviewSection(props) {
    const user = useSelector((state) => state.userReducer);
    const history = useHistory();
    const [reviews, setReviews] = useState([]); // reviews
    const [reviewHidden, setReviewHidden] = useState(true); // hidden state of review writing box
    // review params state
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewScore, setReviewScore] = useState('0');
    const [reviewBody, setReviewBody] = useState('');

    useEffect(() => {
        axios
            .get('/reviews', {
                params: {
                    movie: props.movie._id,
                },
            })
            .then((response) => {
                setReviews(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [props.movie]);

    // submit review request
    function submitReview() {
        let params = {
            movieName: props.movie.Title,
            movie: props.movie._id,
            source: user.currentUser.Username,
            value: reviewScore + '/10',
            title: reviewTitle,
            body: reviewBody,
        };

        // Post request to backend
        axios({
            method: 'post',
            url: '/reviews/new',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(params),
        }).then((res) => {
            if (res.data.success) {
                // reset params
                setReviewTitle('');
                setReviewBody('');
                setReviewScore('0');
                setReviewHidden(true);
                // set new reviews
                setReviews([]);
                setReviews(res.data.updated);
            }
        });
    }

    // remove review function to be passed as callback to each review
    function removeReview(review) {
        // Post request to backend
        axios({
            method: 'post',
            url: '/reviews/delete',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ id: review._id, movie: review.Movie }),
        }).then((res) => {
            setReviews([]);
            setReviews(res.data.updated);
        });
    }

    // review writing box
    function getReviewBox() {
        return (
            <div class='container rounded d-flex flex-column w-100 mb-3 review-container p-3'>
                <div className='d-flex justify-content-between align-items-center m-1'>
                    <div class='input-group w-75'>
                        <div class='input-group-prepend'>
                            <button
                                class='btn btn-dark-info'
                                type='button'
                                onClick={() => {
                                    setReviewTitle('');
                                }}>
                                Title
                            </button>
                        </div>

                        <input
                            type='text'
                            class='form-control'
                            placeholder='Title...'
                            value={reviewTitle}
                            onChange={(e) => {
                                setReviewTitle(e.target.value);
                            }}
                        />
                    </div>
                    <div class='input-group ml-3 w-25'>
                        <div class='input-group-prepend'>
                            <button
                                class='btn btn-dark-info'
                                type='button'
                                onClick={() => {
                                    setReviewScore('0');
                                }}>
                                Score
                            </button>
                        </div>
                        <select
                            class={
                                reviewScore == '0'
                                    ? 'custom-select text-secondary'
                                    : 'custom-select text-white'
                            }
                            id='scoreSelect'
                            value={reviewScore}
                            onChange={(e) => {
                                setReviewScore(e.target.value);
                            }}>
                            <option
                                value='0'
                                selected
                                className='text-secondary'>
                                0
                            </option>

                            <option value='1' className='text-danger'>
                                1
                            </option>
                            <option value='2' className='text-danger'>
                                2
                            </option>
                            <option value='3' className='text-danger'>
                                3
                            </option>
                            <option value='4' className='text-warning'>
                                4
                            </option>
                            <option value='5' className='text-warning'>
                                5
                            </option>
                            <option value='6' className='text-warning'>
                                6
                            </option>
                            <option value='7' className='text-success'>
                                7
                            </option>
                            <option value='8' className='text-success'>
                                8
                            </option>
                            <option value='9' className='text-success'>
                                9
                            </option>
                            <option value='10' className='text-success'>
                                10
                            </option>
                        </select>
                        <div class='input-group-append'>
                            <span class='input-group-text text-info'>/ 10</span>
                        </div>
                    </div>
                </div>
                <div class='review-body ml-1 mr-1 mt-3 mb-3'>
                    <textarea
                        type='text'
                        class='form-control'
                        maxLength='600'
                        placeholder='Review...'
                        value={reviewBody}
                        onChange={(e) => {
                            setReviewBody(e.target.value);
                        }}
                    />
                </div>
                <div className='d-flex justify-content-end'>
                    <div class='m-1 mt-3 d-flex justify-content-end'>
                        <button
                            class='btn btn-info'
                            disabled={!(reviewScore > 0 && reviewScore <= 10)}
                            onClick={() => {
                                submitReview();
                            }}>
                            Submit
                        </button>
                    </div>
                    <div class='m-1 mt-3'>
                        <button
                            class='btn btn-outline-danger'
                            onClick={() => {
                                setReviewHidden(true);
                            }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='container rounded p-3 text-white bg-transparent'>
            <div className='d-flex justify-content-between'>
                <h2>Reviews</h2>
                <button
                    className='btn btn-info'
                    onClick={() => {
                        if (user.currentUser) {
                            setReviewHidden(false);
                        } else {
                            history.push('/login');
                        }
                    }}>
                    Write a Review
                </button>
            </div>
            <hr />
            {!reviewHidden && (
                <CSSTransition
                    in={true}
                    appear={true}
                    timeout={600}
                    classNames='fade'
                    unmountOnExit>
                    {getReviewBox()}
                </CSSTransition>
            )}
            {reviews.length !== 0 ? (
                reviews.map(function (rating, i) {
                    return (
                        <Review
                            review={rating}
                            removeCallback={removeReview}
                            key={props.movie._id + 'review' + i}
                        />
                    );
                })
            ) : (
                <div className='container rounded p-3'>No reviews</div>
            )}
        </div>
    );
}
