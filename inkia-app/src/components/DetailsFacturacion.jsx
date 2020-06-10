import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import firebase from '../services/firebase';

const DetailsFacturacion = () => {

    const {id} = useParams();

    const [factura, setFacturacion] = useState({})

    useEffect(()=> {
      firebase.firestore()
        .collection('factura').doc(id).get()
        .then(item => {
            setFacturacion(item.data())}) 
    }, [])

    return (
        <div>
            <h3>{factura.subject}</h3>
            <ul>
                <li>{factura.responsible}</li>
                <li>{factura.company}</li>
                <li>{factura.provider}</li>
                <li>{factura.amount}</li>
                <li>{factura.typecharge}</li>
                <li>{factura.concept}</li>
            </ul>
            
        </div>
    )
}

export default DetailsFacturacion;