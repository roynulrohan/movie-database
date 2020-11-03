import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { setInStorage, getFromStorage } from '../utils/storage';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../actions';

function Login() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('Regular');
    const [error, setError] = useState('');
    const [register, setMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.userReducer);
    const history = useHistory();

    const dispatch = useDispatch();
    const redirect = () => history.push('/');

    function onSignUp() {
        setLoading(true);
        // Post request to backend
        axios({
            method: 'post',
            url: 'http://localhost:4000/api/account/register',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                name: name,
                email: email,
                password: password,
                type: type,
            }),
        }).then((res) => {
            if (res.data.success) {
                setInStorage('movie_database_roynulrohan', {
                    token: res.data.token,
                });
                setLoading(false);
                dispatch(setUser(res.data.user));
                setTimeout(redirect, 1500);
            } else {
                setError(res.data.message);
            }
            setLoading(false);
        });
    }

    function onSignIn() {
        setLoading(true);
        // Post request to backend
        axios({
            method: 'post',
            url: 'http://localhost:4000/api/account/login',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                email: email,
                password: password,
            }),
        }).then((res) => {
            if (res.data.success) {
                console.log(res.data);
                setInStorage('movie_database_roynulrohan', {
                    token: res.data.token,
                });

                setLoading(false);
                dispatch(setUser(res.data.user));
                setTimeout(redirect, 1500);
            } else {
                setError(res.data.message);
            }

            setLoading(false);
        });
    }

    function signIn() {
        return (
            <div className="container rounded bg-dark p-4 pt-5 text-white h-100 d-flex flex-column justify-content-between">
                <div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            class="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                {error ? (
                    <small class="form-text text-danger">{error}</small>
                ) : (
                    ''
                )}
                <div>
                    <div class="form-group">
                        <small class="form-text text-muted">
                            Don't have an account?
                            <a
                                class="text-primary"
                                onClick={() => {
                                    setMode(true);
                                    setError();
                                }}
                            >
                                {' '}
                                Sign up
                            </a>
                        </small>
                    </div>{' '}
                    <button
                        onClick={() => onSignIn()}
                        class="btn btn-primary w-100"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    function signUp() {
        return (
            <div className="container rounded bg-dark p-4 text-white h-100 d-flex flex-column justify-content-between">
                <div class="form-group">
                    <label>Name</label>
                    <input
                        type="name"
                        class="form-control"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        class="form-control"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        class="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div class="form-group">
                    <label>Account Type</label>
                    <br />
                    <div class="form-check form-check-inline">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadio1"
                            value="Regular"
                            onClick={(e) => setType(e.target.value)}
                            checked
                        />
                        <label class="form-check-label">Regular</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadio2"
                            value="Contributing"
                            onClick={(e) => setType(e.target.value)}
                        />
                        <label class="form-check-label">Contributing</label>
                    </div>
                </div>

                {error ? (
                    <small class="form-text text-danger">{error}</small>
                ) : (
                    ''
                )}

                <div class="form-group">
                    <small class="form-text text-muted">
                        Already have an account?
                        <a
                            class="text-primary"
                            onClick={() => {
                                setMode(false);
                                setError();
                            }}
                        >
                            {' '}
                            Login here
                        </a>
                    </small>
                </div>

                <button onClick={() => onSignUp()} class="btn btn-primary">
                    Sign Up
                </button>
            </div>
        );
    }

    function getContainer() {
        if (loading) {
            return (
                <div className="container rounded bg-dark p-4 text-white h-100 d-flex flex-column justify-content-center align-items-center">
                    <h5>Loading...</h5>
                </div>
            );
        } else {
            if (user.currentUser) {
                return (
                    <div className="container rounded bg-dark p-4 text-white h-100 d-flex flex-column justify-content-center align-items-center">
                        <h5>You're logged in</h5>
                        <br />
                        <h3>✔️</h3>
                    </div>
                );
            } else {
                if (register) {
                    return signUp();
                } else {
                    return signIn();
                }
            }
        }
    }

    return <div className="login-container">{getContainer()}</div>;
}

export default Login;
