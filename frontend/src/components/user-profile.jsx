import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { setUser } from '../actions';

import axios from 'axios';

import MovieRow from './movie-row';

export default function UserProfile(props) {
    const currentUser = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const [user, setUserState] = useState('');
    const [likedQuery, setLikedQuery] = useState(''); // liked list query
    const [savedQuery, setSavedQuery] = useState(''); // saved list query

    useEffect(() => {
        // get user and update state on props change
        axios.get('/api/account/user/' + props._id).then((res) => {
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
    }, [props._id]);

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames="fade"
            unmountOnExit
        >
            <div>
                <div className="container rounded p-4 mt-4 text-white">
                    <div className="d-flex flex-column justify-content-between mr-4 overflow-hidden">
                        {user &&
                            Object.keys(user).map(function (key) {
                                return <p>{key + ': ' + user[key]}</p>;
                            })}
                    </div>
                </div>
                <div>
                    {likedQuery && (
                        <MovieRow
                            key={'Liked'}
                            title={'Liked'}
                            movies={likedQuery}
                        ></MovieRow>
                    )}
                    {savedQuery && (
                        <MovieRow
                            key={'Saved for Later'}
                            title={'Saved for Later'}
                            movies={savedQuery}
                        ></MovieRow>
                    )}
                </div>
            </div>
        </CSSTransition>
    );
}
