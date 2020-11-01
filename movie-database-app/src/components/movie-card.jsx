import React, { useCallback } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export default function MovieCard(props) {
    const history = useHistory();
    const handleOnClick = () => history.push('/movie/' + props.movie._id);

    return (
        <div className="movie-card" onClick={handleOnClick}>
            <Card bg="dark" text="white">
                <Card.Header>
                    <Card.Img variant="top" src={props.movie.Poster} />
                </Card.Header>
                <Card.Body>
                    <Card.Title className="poster-title">
                        {props.movie.Title}
                    </Card.Title>
                </Card.Body>
                <Card.Footer>
                    <Button variant="warning">Learn More</Button>
                </Card.Footer>
            </Card>
        </div>
    );
}
