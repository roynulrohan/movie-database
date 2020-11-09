import React, { Component } from 'react';
import {
    useLocation,
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import './sass/App.scss';

import HomePage from './components/home-page';
import MoviePage from './components/movie-page';
import Login from './components/login-page';
import Nav from './components/navbar';
import UserProfile from './components/user-profile';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Nav />
                    <Route path="/" exact component={HomePage} />
                    <Route
                        path="/movie"
                        component={() => (
                            <MoviePage
                                // passing id from
                                _id={useLocation().pathname.replace(
                                    '/movie/',
                                    ''
                                )}
                            />
                        )}
                    />
                    <Route path="/user" component={UserProfile}></Route>
                    <Route path="/login" component={Login}></Route>
                </div>
            </Router>
        );
    }
}

export default App;
