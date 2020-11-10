import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { setUser } from '../actions';

import axios from 'axios';

import { getFromStorage } from '../utils/storage';

export default function UserProfile(props) {
    const currentUser = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const [user, setUserState] = useState('');

    useEffect(() => {
        const obj = getFromStorage('movie_database_roynulrohan');

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
            });
    }, []);

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames="fade"
            unmountOnExit
        >
            <div className="container rounded p-4 mt-4 text-white">
                <div className="d-flex flex-column justify-content-between mr-4">
                    {user &&
                        Object.keys(user).map(function (key) {
                            return <div>{key + ': ' + user[key]}</div>;
                        })}
                </div>
            </div>
        </CSSTransition>
    );
}
