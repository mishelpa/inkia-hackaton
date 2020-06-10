import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import firebase from '../services/firebase';

const DetailsFacturacion = () => {

    const {id} = useParams();

    const [factura, setFacturacion] = useState({})

    useEffect(() => {
		firebase.firestore().collection('budgets').onSnapshot((querySnapshot) => {
			const array = [];
			querySnapshot.forEach((doc) => {
				array.push({ id: doc.id, ...doc.data() });
			});
			setFacturacion(array);
		})
	}, [])
    return (
        <div>
            <h3>{factura.company}</h3>
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