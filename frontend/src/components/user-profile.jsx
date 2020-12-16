import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { setUser } from '../actions';

import axios from 'axios';

import MovieRow from './movie-row';
import Review from './review';

export default function UserProfile(props) {
    const currentUser = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const [user, setUserState] = useState(undefined);
    const [likedQuery, setLikedQuery] = useState(''); // liked list query
    const [savedQuery, setSavedQuery] = useState(''); // saved list query
    const [reviews, setReviews] = useState(undefined);

    useEffect(() => {
        // get user and update state on props change
        axios.get('/account/user/' + props._id).then((res) => {
            if (res.data) {
                // set user state
                setUserState(res.data);

                // set document title
                document.title = res.data.Username + ' | Not IMDb';

                // add movie ids to query
                if (res.data.Liked) {
                    let query = '';

                    res.data.Liked.forEach((id) => {
                        query += id + ',';
                    });

                    setLikedQuery(query);
                }

                if (res.data.Saved) {
                    let query = '';

                    res.data.Saved.forEach((id) => {
                        query += id + ',';
                    });

                    setSavedQuery(query);
                }
            }
        });

        // get reviews related to user
        axios
            .get('/reviews', {
                params: {
                    source: props._id,
                },
            })
            .then((response) => {
                setReviews(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [props._id]);

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames='fade'
            unmountOnExit>
            <div>
                {user && reviews && (
                    <div>
                        <div className='container rounded p-4 mt-4 text-white'>
                            <div className='d-flex flex-column w-50 justify-content-between mr-4'>
                                <div className='d-flex m-1'>
                                    <h4 className='w-20 m-0'>
                                        <span className='badge badge-primary mr-3'>
                                            Name
                                        </span>
                                    </h4>
                                    <h3 className='m-0'>{user.Name}</h3>
                                </div>
                                <div className='d-flex m-1'>
                                    <h4 className='w-20 m-0'>
                                        <span className='badge badge-primary mr-3'>
                                            @
                                        </span>
                                    </h4>
                                    <h3 className='m-0'>{user.Username}</h3>
                                </div>

                                <br />
                                <div className='d-flex m-1'>
                                    <h5 className='w-20 m-0'>
                                        <span className='badge badge-success p-2 mr-3'>
                                            Type
                                        </span>
                                    </h5>
                                    <h5>
                                        <span className='badge badge-info p-2 mr-3'>
                                            {user.Type}
                                        </span>
                                    </h5>
                                </div>
                                <div className='d-flex m-1'>
                                    <h5 className='w-20 m-0'>
                                        <span className='badge badge-warning p-2 mr-3'>
                                            Joined
                                        </span>
                                    </h5>
                                    <h5>
                                        <span className='badge badge-secondary p-2 mr-3'>
                                            {new Date(
                                                user.DateCreated
                                            ).toLocaleString()}
                                        </span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className='container bg-transparent d-flex flex-column align-items-center mt-4 p-0'>
                            {reviews && reviews.length > 0 && (
                                <h2 className='text-warning d-flex align-content-center'>
                                    <span>Reviews Given</span>

                                    <span className='badge badge-pill badge-warning ml-3'>
                                        {reviews.length}
                                    </span>
                                </h2>
                            )}
                            <br />
                            <div className='w-100'>
                                {reviews &&
                                    reviews.map(function (rating, i) {
                                        return <Review review={rating} />;
                                    })}
                            </div>
                        </div>
                        <div className='mt-5'>
                            {likedQuery && (
                                <MovieRow
                                    key={'Liked'}
                                    title={'Liked List'}
                                    shouldCount='true'
                                    movies={likedQuery}></MovieRow>
                            )}
                            {savedQuery && (
                                <MovieRow
                                    key={'Saved for Later'}
                                    title={'Saved for Later'}
                                    shouldCount='true'
                                    movies={savedQuery}></MovieRow>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </CSSTransition>
    );
}
