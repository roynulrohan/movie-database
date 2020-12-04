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
    const profileOnClick = () => {
        history.push('/user/' + user.currentUser.Username);
    };

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

    function browseClick() {
        history.push('/browse');
    }

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
    function userDropdown() {
        return (
            // used Dropdown from React Bootstrap because for some reason the native one wouldn't work
            <Dropdown className="w-100" key="user-dropdown">
                <Dropdown.Toggle
                    variant="warning"
                    id="dropdown"
                    className="profile-dropdown no-caret"
                >
                    <div className="d-flex justify-content-around pl-3">
                        {user.currentUser.Username}
                        <div>
                            <svg
                                width="1.2em"
                                height="1.2em"
                                viewBox="0 0 16 16"
                                class="bi bi-chevron-down"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                />
                            </svg>
                        </div>
                    </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100" align="right">
                    <Dropdown.Header>{user.currentUser.Name}</Dropdown.Header>
                    <Dropdown.Item onClick={() => profileOnClick()}>
                        My Profile
                    </Dropdown.Item>
                    <Dropdown.Item>Settings</Dropdown.Item>
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Item
                        onClick={() => logout()}
                        className="text-danger"
                    >
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    function browseDropdown() {
        return (
            // used Dropdown from React Bootstrap because for some reason the native one wouldn't work
            <Dropdown key="browse-dropdown">
                <Dropdown.Toggle
                    id="dropdown"
                    variant=""
                    className="btn browse-dropdown no-caret btn-dark-yellow"
                >
                    <svg
                        width="1.2em"
                        height="1.2em"
                        viewBox="0 0 16 16"
                        class="bi bi-list"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                        />
                    </svg>{' '}
                    Browse
                </Dropdown.Toggle>

                <Dropdown.Menu
                    className="w-100 text-center"
                    align="left"
                    variant="dark"
                >
                    <Dropdown.Header className="text-info">
                        Explore
                    </Dropdown.Header>
                    <Dropdown.Item onClick={() => browseClick()}>
                        Movies
                    </Dropdown.Item>
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Item onClick={() => browseClick()}>
                        Users
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
            <div className="navbar-nav mr-5 ml-2 pb-1">{browseDropdown()}</div>


            <div className="navbar-nav ml-auto mr-5 pt-1 pb-1">
                {user.currentUser ? (
                    userDropdown()
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
