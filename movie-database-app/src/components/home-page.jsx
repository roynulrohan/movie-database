import React, { Component } from 'react';

const { default: MovieRow } = require('./movie-row');

class HomePage extends Component {
    render() {
        return (
            <div>
                <MovieRow key="For you" title="For you"></MovieRow>
                <MovieRow
                    key="Tom Cruise"
                    title="Tom Cruise Movies"
                    params={{ actor: 'Tom Cruise' }}
                ></MovieRow>
                <MovieRow
                    key="Leonardo Dicaprio"
                    title="Leonardo Dicaprio Movies"
                    params={{ actor: 'Leonardo Dicaprio' }}
                ></MovieRow>
                <MovieRow
                    title="Test"
                    params={{ actor: 'Sylvester Stallone' }}
                ></MovieRow>
            </div>
        );
    }
}

export default HomePage;
