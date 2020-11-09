import React, { Component } from 'react';

import axios from 'axios';
import MovieCard from './movie-card';

export default class MovieRow extends Component {
    constructor(props) {
        super(props);
        this.scrollable = React.createRef();
        this.state = { movies: [], width: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        // make movies request with givem params and setstate
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
        // scrollable Ref is null on mount so getting current width would be impossible.
        // that's why I added mousemove listener which for some reason gets Ref
        window.addEventListener('mousemove', this.updateWindowDimensions);
        // resize event listener to get width of row
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.removeEventListener('mousemove', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        if (this.scrollable.current) {
            // removes mouse event listener if scrollable is not null
            window.removeEventListener(
                'mousemove',
                this.updateWindowDimensions
            );

            this.setState({ width: this.scrollable.current.clientWidth });
        }
    }

    // scroll function for row
    scroll(offset) {
        this.updateWindowDimensions();
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
        if (this.state.movies.length !== 0) {
            return (
                <div className="movie-list-section">
                    <div className="p-3">
                        <h2
                            className="w-75 text-warning"
                            onClick={() => {
                                this.setScroll(0);
                            }}
                        >
                            {this.props.title}
                        </h2>

                        <div className="d-flex">
                            <button
                                className="btn mr-2 arrow btn-dark-yellow"
                                onClick={() => {
                                    this.scroll(-this.state.width);
                                }}
                            >
                                {'<'}
                            </button>
                            <div ref={this.scrollable} className="movie-list">
                                {this.state.movies.map(function (
                                    currentMovie,
                                    i
                                ) {
                                    return (
                                        <MovieCard
                                            movie={currentMovie}
                                            key={currentMovie._id}
                                        />
                                    );
                                })}
                            </div>
                            <button
                                className="btn ml-2 arrow btn-dark-yellow"
                                onClick={() => {
                                    this.scroll(this.state.width);
                                }}
                            >
                                {'>'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}
