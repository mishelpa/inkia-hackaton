import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import firebase from '../services/firebase';
import MaterialTableDemo from './example';

const DetailsSubject = () => {

    const {id} = useParams();

    const [subject, setSubject] = useState({})

    useEffect(()=> {
        firebase.firestore()
        .collection('subject').doc(id).get()
        .then(item => {
            setSubject(item.data())}) 
    }, [])

    return (
        <div>
           hello
        </div>
    )
}

export default DetailsSubject