import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export default function MovieCard(props) {
    const history = useHistory();
    const handleOnClick = () => history.push('/movie/' + props.movie._id);

    return (
        <div className="movie-card" onClick={handleOnClick}>
            <Card text="white">
                <Card.Header>
                    <Card.Img variant="top" src={props.movie.Poster}/>
                </Card.Header>
                <Card.Body>
                    <Card.Title className="poster-title">
                        {props.movie.Title}
                    </Card.Title>
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex justify-content-between">
                        <Button variant="outline-info">+ Watchlist</Button>
                        <Button variant="outline-danger ">Like </Button>
                    </div>
                </Card.Footer>
            </Card>
        </div>
    );
}
