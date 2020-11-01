import React, { Component } from 'react';

const { default: MovieRow } = require('./movie-row');

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <MovieRow key="All" title="All Movies"></MovieRow>
                <MovieRow
                    key="Animated"
                    title="Animated"
                    genre="animation"
                ></MovieRow>
                <MovieRow key="Horror" title="Horror" genre="horror"></MovieRow>
                <MovieRow key="Action" title="Action" genre="action"></MovieRow>
            </div>
        );
    }
}

export default HomePage;
