import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

const { default: MovieRow } = require('./movie-row');

// row parameters as objects
const rows = [
    { title: 'For you', params: { random: true } },
    { title: 'Tom Cruise', params: { random: true, actor: 'Tom Cruise' } },
    { title: 'TV Shows', params: { random: true, type: 'series' } },
    { title: '2015', params: { random: true, year: '2015' } },
    { title: 'Horror', params: { random: true, genre: 'Horror' } },
];

export default function HomePage() {
    useEffect(() => {
        document.title = 'Home | Not IMDb';
    }, []);

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames="fade"
            unmountOnExit
        >
            <div>
                <div className="pt-4">
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
            </div>
        </CSSTransition>
    );
}
