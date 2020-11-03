import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Dropdown } from 'react-bootstrap/';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../actions';

import axios from 'axios';

import { getFromStorage } from '../utils/storage';

export default function Nav() {
    const user = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const history = useHistory();
    const profileOnClick = () => history.push('/user/' + user.currentUser._id);

    useEffect(() => {
        const obj = getFromStorage('movie_database_roynulrohan');

        if (obj && obj.token) {
            const { token } = obj;
            // Verify token
            axios
                .get('http://localhost:4000/api/account/verify?token=' + token)
                .then((res) => {
                    if (res.data.success) {
                        dispatch(setUser(res.data.user));
                    }
                });
        }
    }, []);
    

    function logout() {
        const obj = getFromStorage('movie_database_roynulrohan');

        if (obj && obj.token) {
            const { token } = obj;

            axios
                .post('http://localhost:4000/api/account/logout?token=' + token)
                .then((res) => {
                    console.log(res.data);
                    if (res.data.success) {
                        dispatch(setUser());
                    }
                });
        }
    }

    function dropdownMenu() {
        return (
            <Dropdown className="w-100">
                <Dropdown.Toggle variant="info" id="dropdown">
                    {user.currentUser.Email}
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-darken-4 pr-5">
            <a className="navbar-brand" target="_blank"></a>
            <Link to="/" className="navbar-brand ml-5">
                MERN-Stack App
            </Link>
            <div className="navbar-nav ml-auto mr-5">
                {user.currentUser ? (
                    dropdownMenu()
                ) : (
                    <Link to="/login" className="nav-link">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
