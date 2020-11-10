import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';

const { default: MovieRow } = require('./movie-row');

// row parameters as objects
const rows = [
    { title: 'Tom Cruise', params: { actor: 'Tom Cruise' } },
    { title: 'TV Shows', params: { type: 'series' } },
    { title: '2015', params: { year: '2015' } },
];

class HomePage extends Component {
    render() {
        return (
            <CSSTransition
                in={true}
                appear={true}
                timeout={600}
                classNames="fade"
                unmountOnExit
            >
                <div className="pt-3">
                    {/* map rows */}
                    {rows.map(({ title, params }) => {
                        return (
                            <MovieRow
                                key={title}
                                title={title}
                                params={params}
                            ></MovieRow>
                        );
                    })}
                </div>
            </CSSTransition>
        );
    }
}

export default HomePage;
