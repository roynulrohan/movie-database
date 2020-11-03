import React, { Component } from 'react';
import { useLocation, BrowserRouter as Router, Route } from 'react-router-dom';

import './sass/App.scss';

import HomePage from './components/home-page';
import MoviePage from './components/movie-page';
import Login from './components/login-page';
import Nav from './components/navbar';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Nav />
                    <br />
                    <Route path="/" exact component={HomePage} />
                    <Route
                        path="/movie"
                        component={() => (
                            <MoviePage
                                _id={useLocation().pathname.replace(
                                    '/movie/',
                                    ''
                                )}
                            />
                        )}
                    />
                    <Route path="/login" component={Login}></Route>
                </Router>
            </div>
        );
    }
}

export default App;
