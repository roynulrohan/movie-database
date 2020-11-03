import React, { Component } from 'react';
import axios from 'axios';

class MoviePage extends Component {
    constructor(props) {
        super(props);

        this.state = { movie: {} };
    }

    componentDidMount() {
        axios
            .get('http://localhost:4000/movies/' + this.props._id)
            .then((response) => {
                this.setState({ movie: response.data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getGenres(string) {
        if (string) {
            return (
                <p>
                    {string.split(',').map((genre) => {
                        return (
                            <span className="badge badge-secondary m-1">
                                {genre}
                            </span>
                        );
                    })}
                </p>
            );
        }
    }

    render() {
        return (
            <div className="container rounded bg-dark p-3 text-white">
                <div className="d-flex">
                    <img
                        className="mr-4 poster"
                        src={this.state.movie.Poster}
                    ></img>
                    <div className="d-flex flex-column justify-content-between mr-4">
                        <div className="p-2">
                            <div className="d-flex justify-content-between">
                                <div className="w-70">
                                    <h3 className="m-1">
                                        {this.state.movie.Title} (
                                        {this.state.movie.Year})
                                    </h3>

                                    <h5 className="badge badge-warning m-1">
                                        Rated: {this.state.movie.Rated}
                                    </h5>
                                    <h5 className="badge badge-primary m-1">
                                        {this.state.movie.Runtime}
                                    </h5>
                                    <h5 className="badge badge-danger m-1">
                                        {this.state.movie.Released}
                                    </h5>
                                    <h5 className="badge badge-success m-1">
                                        {this.state.movie.Language}
                                    </h5>

                                    <div>
                                        {this.getGenres(this.state.movie.Genre)}
                                    </div>

                                    <p className="m-1">
                                        {this.state.movie.Plot}
                                    </p>
                                </div>

                                <div className="w-auto mr-1">
                                    <h3>
                                        <span className="badge badge-warning m-1">
                                            {this.state.movie.imdbRating}
                                            <br />
                                            <small>IMDb</small>
                                        </span>
                                        <span
                                            className={'badge m-1'.concat(
                                                this.state.movie.Metascore < 50
                                                    ? ' badge-danger'
                                                    : ' badge-success'
                                            )}
                                        >
                                            {this.state.movie.Metascore}
                                            <br />
                                            <small>Metascore</small>
                                        </span>
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="p-2 m-1">
                            <h5>
                                <span className="badge bg-secondary">
                                    Director
                                </span>{' '}
                                <small>: {this.state.movie.Director}</small>
                            </h5>
                            <h5>
                                <span className="badge badge-secondary">
                                    Writer
                                </span>{' '}
                                <small>: {this.state.movie.Writer}</small>
                            </h5>
                            <h5>
                                <span className="badge badge-secondary">
                                    Cast
                                </span>{' '}
                                <small>: {this.state.movie.Actors}</small>
                            </h5>
                            <h5>
                                <span className="badge badge-secondary">
                                    Production
                                </span>{' '}
                                <small>: {this.state.movie.Production}</small>
                            </h5>
                            <h5>
                                <span className="badge badge-secondary">
                                    Awards
                                </span>{' '}
                                <small>: {this.state.movie.Awards}</small>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MoviePage;
