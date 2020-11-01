import React, { Component } from 'react';
import axios from 'axios';

class MoviePage extends Component {
    constructor(props) {
        super(props);

        this.state = { movie: {} };
    }

    componentDidMount() {
        axios
            .get('http://localhost:4000/movie/' + this.props._id)
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
                            <span className="badge badge-secondary mr-1">
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
            <div className="container bg-dark p-3 text-white">
                <div className="d-flex">
                    <img className="mr-4" src={this.state.movie.Poster}></img>
                    <div className="d-flex flex-column justify-content-between">
                        <div className="p-2">
                            <div className="d-flex justify-content-between">
                                <div className="w-75">
                                    <h3>
                                        {this.state.movie.Title} (
                                        {this.state.movie.Year})
                                    </h3>
                                    <h5>
                                        <span className="badge badge-warning mr-1">
                                            Rated: {this.state.movie.Rated}
                                        </span>
                                        <span className="badge badge-primary m-1">
                                            {this.state.movie.Runtime}
                                        </span>
                                        <span className="badge badge-danger m-1">
                                            {this.state.movie.Released}
                                        </span>
                                        <span className="badge badge-success m-1">
                                            {this.state.movie.Language}
                                        </span>
                                    </h5>

                                    <div>
                                        {this.getGenres(this.state.movie.Genre)}
                                    </div>
                                </div>

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

                            <p className="w-75">{this.state.movie.Plot}</p>
                        </div>

                        <h5 className="p-2">
                            <span class="badge badge-secondary">Awards</span>{' '}
                            <small>: {this.state.movie.Awards}</small>
                        </h5>

                        <div className="p-2">
                            <h5>
                                <span class="badge badge-secondary">
                                    Director
                                </span>{' '}
                                <small>: {this.state.movie.Director}</small>
                            </h5>
                            <h5>
                                <span class="badge badge-secondary">
                                    Writer
                                </span>{' '}
                                <small>: {this.state.movie.Writer}</small>
                            </h5>
                            <h5>
                                <span class="badge badge-secondary">Cast</span>{' '}
                                <small>: {this.state.movie.Actors}</small>
                            </h5>
                            <h5>
                                <span class="badge badge-secondary">
                                    Production
                                </span>{' '}
                                <small>: {this.state.movie.Production}</small>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MoviePage;
