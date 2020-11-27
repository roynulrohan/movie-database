import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { Dropdown } from 'react-bootstrap/';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../actions';

import axios from 'axios';

import { getFromStorage } from '../utils/storage';

export default function Nav() {
    const user = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const history = useHistory();
    const profileOnClick = () => {history.push('/user/' + user.currentUser._id)};

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
                    } else {
                        dispatch(setUser());
                    }
                });
        }
    }, []);

    // logout request
    function logout() {
        const obj = getFromStorage('not_imdb_roynulrohan');

        if (obj && obj.token) {
            const { token } = obj;

            axios
                .post('http://localhost:4000/api/account/logout?token=' + token)
                .then((res) => {
                    if (res.data.success) {
                        // remove user from redux store
                        dispatch(setUser());
                        window.location.reload(false);
                    }
                });
        }
    }

    // dropdown menu if users logged in
    function dropdownMenu() {
        return (
            // used Dropdown from React Bootstrap because for some reason the native one wouldn't work
            <Dropdown className="w-100" key="dropdown-menu">
                <Dropdown.Toggle
                    variant="warning"
                    id="dropdown"
                    className="profile-dropdown"
                >
                    {user.currentUser.Username}
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100" align="right">
                    <Dropdown.Header>{user.currentUser.Name}</Dropdown.Header>
                    <Dropdown.Item onClick={() => profileOnClick()}>
                        My Profile
                    </Dropdown.Item>
                    <Dropdown.Item>Collection</Dropdown.Item>
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Item
                        onClick={() => logout()}
                        className="logout-btn"
                    >
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-darken-4">
            <Link to="/" className="navbar-brand ml-5 pt-1 pb-1">
                <h3>
                    <span className="badge">Not</span>
                    <span className="badge badge-warning">IMDb</span>
                </h3>
            </Link>

            <div className="navbar-nav ml-auto mr-5 pt-1 pb-1">
                {user.currentUser ? (
                    dropdownMenu()
                ) : (
                    <CSSTransition
                        in={true}
                        appear={true}
                        timeout={600}
                        classNames="fade"
                        unmountOnExit
                    >
                        <Link to="/login" key="login-button">
                            <button className="btn btn-dark-yellow">
                                Login
                            </button>
                        </Link>
                    </CSSTransition>
                )}
            </div>
        </nav>
    );
}
