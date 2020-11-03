import React, { Component } from 'react';

import axios from 'axios';
import MovieCard from './movie-card';

export default class MovieRow extends Component {
    constructor(props) {
        super(props);
        this.scrollable = React.createRef();
        this.state = { movies: [], width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        axios
            .get('http://localhost:4000/movies', {
                params: this.props.params,
            })
            .then((response) => {
                this.setState({ movies: response.data });
            })
            .catch(function (error) {
                console.log(error);
            });

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    scroll(offset) {
        if (this.scrollable.current) {
            this.scrollable.current.scrollLeft += offset;
        }
    }

    setScroll(offset) {
        if (this.scrollable.current) {
            this.scrollable.current.scrollLeft = offset;
        }
    }

    render() {
        return (
            <div className="movie-list-section">
                <h2
                    onClick={() => {
                        this.setScroll(0);
                    }}
                >
                    {this.props.title}
                </h2>

                <div style={{ display: 'flex' }}>
                    <button
                        className="btn btn-dark mr-2 arrow"
                        onClick={() => {
                            this.scroll(400 - this.state.width);
                        }}
                    >
                        {'<'}
                    </button>
                    <div ref={this.scrollable} className="movie-list">
                        {this.state.movies.map(function (currentMovie, i) {
                            return (
                                <MovieCard
                                    movie={currentMovie}
                                    key={currentMovie._id}
                                />
                            );
                        })}
                    </div>
                    <button
                        className="btn btn-dark ml-2 arrow"
                        onClick={() => {
                            this.scroll(this.state.width - 400);
                        }}
                    >
                        {'>'}
                    </button>
                </div>
            </div>
        );
    }
}
