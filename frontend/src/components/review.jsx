import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Modal, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Review(props) {
    const user = useSelector((state) => state.userReducer);
    const [modalShow, setModal] = useState(false); // modal state
    const toggleModal = () => {
        // modal toggle
        setModal(!modalShow);
    };
    const history = useHistory();
    const date = new Date(props.review.DateCreated);

    // determine review level based off score value
    // to be used for color coding
    function getReviewValue() {
        if (props.review.Value[0] >= 7) {
            return 'high';
        } else if (props.review.Value[0] <= 6 && props.review.Value[0] >= 4) {
            return 'medium';
        } else if (props.review.Value[0] == 1 && props.review.Value[1] == 0) {
            return 'high';
        } else {
            return 'low';
        }
    }

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames='fade'
            unmountOnExit>
            <div className='container rounded'>
                <small className='mt-2 ml-3 text-secondary position-absolute'>
                    {date.toLocaleString()}
                </small>
                <div className='d-flex justify-content-between align-items-start p-3 mb-2 review'>
                    <div className='d-flex flex-column justify-content-between w-100 mt-4 text-white'>
                        <h5 class='w-100'>
                            {props.removeCallback ? (
                                <span
                                    className='text-info pointer'
                                    onClick={() => {
                                        history.push(
                                            '/user/' + props.review.Source
                                        );
                                    }}>
                                    {props.review.Source}
                                </span>
                            ) : (
                                <span
                                    className='text-info pointer'
                                    onClick={() => {
                                        history.push(
                                            '/movie/' + props.review.Movie
                                        );
                                    }}>
                                    {props.review.MovieName}
                                </span>
                            )}
                            {props.review.Title && (
                                <span>
                                    {' - '}
                                    <span
                                        className={
                                            getReviewValue() == 'high'
                                                ? 'text-success'
                                                : getReviewValue() == 'medium'
                                                ? 'text-warning'
                                                : 'text-danger'
                                        }>
                                        {props.review.Title}
                                    </span>
                                </span>
                            )}
                        </h5>
                        {props.review.Body && (
                            <div className='d-flex justify-content-center w-100'>
                                <textarea
                                    className='w-100'
                                    value={props.review.Body}
                                    readOnly
                                />
                            </div>
                        )}
                    </div>

                    <div className='m-1 d-flex justify-content-between align-items-center w-auto ml-3'>
                        <h4 className='m-1'>
                            <span
                                className={
                                    getReviewValue() == 'high'
                                        ? 'p-2 badge badge-success'
                                        : getReviewValue() == 'medium'
                                        ? 'p-2 badge badge-warning'
                                        : 'p-2 badge badge-danger'
                                }>
                                {props.review.Value}
                            </span>
                        </h4>{' '}
                        {props.removeCallback &&
                            user.currentUser &&
                            user.currentUser.Username ==
                                props.review.Source && (
                                <button
                                    className='btn btn-secondary-danger p-2 m-1'
                                    onClick={() => {
                                        toggleModal();
                                    }}>
                                    <svg
                                        width='1.4em'
                                        height='1.4em'
                                        viewBox='0 0 16 16'
                                        class='bi bi-trash'
                                        fill='currentColor'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                                        <path
                                            fill-rule='evenodd'
                                            d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
                                        />
                                    </svg>
                                </button>
                            )}
                    </div>
                    <Modal show={modalShow} onClose={toggleModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Deleting this review is permanent, and cannot be
                            undone.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant='secondary'
                                onClick={() => {
                                    toggleModal();
                                }}>
                                Cancel
                            </Button>
                            <Button
                                variant='danger'
                                onClick={() => {
                                    toggleModal();
                                    props.removeCallback(props.review);
                                }}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </CSSTransition>
    );
}
