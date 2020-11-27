import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { setUser } from '../actions';

import axios from 'axios';

import { getFromStorage } from '../utils/storage';
import MovieRow from './movie-row';

export default function UserProfile(props) {
    const currentUser = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const [user, setUserState] = useState('');
    const [likedQuery, setLikedQuery] = useState('');
    const [wlQuery, setWLQuery] = useState('');

    useEffect(() => {
        const obj = getFromStorage('not_imdb_roynulrohan');

        if (obj && obj.token) {
            const { token } = obj;
            // Verify user on mount
            axios
                .get('http://localhost:4000/api/account/verify?token=' + token)
                .then((res) => {
                    if (res.data.success) {
                        // write user to redux store
                        dispatch(setUser(res.data.user));
                    }
                });
        }

        axios
            .get('http://localhost:4000/api/account/user/' + props._id)
            .then((res) => {
                setUserState(res.data);

                if (res.data.Username) {
                    document.title = res.data.Username + ' | Not IMDb';
                }

                if (res.data.Liked) {
                    let query = '';

                    res.data.Liked.forEach((id) => {
                        query += id + ',';
                    });

                    setLikedQuery(query);
                }

                if (res.data.WatchList) {
                    let query = '';

                    res.data.WatchList.forEach((id) => {
                        query += id + ',';
                    });

                    setWLQuery(query);
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
                    {wlQuery && (
                        <MovieRow
                            key={'Saved for Later'}
                            title={'Saved for Later'}
                            movies={wlQuery}
                        ></MovieRow>
                    )}
                </div>
            </div>
        </CSSTransition>
    );
}
