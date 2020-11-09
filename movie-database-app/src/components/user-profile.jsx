import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function UserProfile() {
    const user = useSelector((state) => state.userReducer);

    return (
        <div className="container rounded p-4 mt-4 text-white">
            <div className="d-flex flex-column justify-content-between mr-4">
                <h3>{user.currentUser.Name}</h3>
                <h3>{user.currentUser.Username}</h3>
                <h3>{user.currentUser.Type}</h3>
                <h3>{user.currentUser.DateCreated}</h3>
            </div>
        </div>
    );
}
