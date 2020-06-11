import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import firebase from '../services/firebase'
import '../css/Header.css';

const Header = (props) => {
    const [user, setUser] = useState();
    let location = useLocation();
    useEffect(() => {
        setUser(firebase.auth().currentUser)
    });
    return (
        <div className="container-header">
            <div className="location">{location.pathname.substr(1, location.pathname.length - 1).toUpperCase()}</div>
            <div className="d-flex align-items-center">

                <div>{user ? user.email : ''}</div>
                <img src="https://img.icons8.com/cotton/64/000000/gender-neutral-user--v3.png" alt="avatar" />
            </div>

        </div>
    )
}
export default Header;
