import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import firebase from '../services/firebase';

const DetailsProvider = () => {

    // console.log(useParams())
    const {id} = useParams();
    // console.log(id)

    const [provider, setProvider] = useState({})

    useEffect(()=> {
        firebase.firestore()
        .collection('provider').doc(id).get()
        .then(item => {
           setProvider(item.data())}) 
    }, [])

    return (
        <div>
            <h3>{provider.socialProvider}</h3>
            <ul>
                <li>{provider.typeProvider}</li>
                <li>{provider.countryProvider}</li>
                <li>{provider.emailProvider}</li>
            </ul>
        </div>
    )
}

export default DetailsProvider