import React, { Component } from 'react';
import {
    useLocation,
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.scss';
import HomePage from './components/home-page';
import MoviePage from './components/movie-page';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-darken-4">
                        <a className="navbar-brand" target="_blank"></a>
                        <Link to="/" className="navbar-brand ml-5">
                            MERN-Stack App
                        </Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav ml-auto mr-5">
                                <li className="navbar-item">
                                    <Link to="/login" className="nav-link">
                                        Login
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
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
                </Router>
            </div>
        );
    }
}

export default App;
