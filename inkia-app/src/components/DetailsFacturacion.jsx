import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import firebase from '../services/firebase';
import { Card, Button} from 'react-bootstrap';
import { Functions } from '../services/Functions';
import BillBudget from './BillBudget';

const DetailsFacturacion = () => {
	const { id } = useParams();
	console.log(id)
	const [facturacion, setFacturacion] = useState([])

	const updateState = () => {
		Functions.updateData('budgets', id, {estado: 'pendiente de aprobacion'})
	}
	const addFactura = () =>{
		console.log('listo');
	}

	useEffect(() => {
		firebase.firestore()
			.collection('budgets').doc(id).get()
			.then(doc => {
				setFacturacion(doc.data())
			});
	}, [])


	return (
		<div className="detail-budget">
			<Card style={{ width: '50rem' }}>
				<Card.Header className="d-flex justify-content-between">
					<div>Asunto: {facturacion.subject}</div>
					<div>Responsable: {facturacion.corporative}</div>
				</Card.Header>
				<Card.Body>
					<div className="d-flex justify-content-between">
						<div className="d-flex flex-column">
							<div>Empresa:</div>
							<div>{facturacion.company}</div>
						</div>
						<div className="d-flex flex-column">
							<div>Proveedor:</div>
							<div>{facturacion.provider}</div>
						</div>
						<div className="d-flex flex-column">
							<div>Tipo de proveedor:</div>
							<div>{facturacion.type_provider}</div>
						</div>
					</div>
					<div>Moneda: {facturacion.currency}</div>
					<div>Monto Total Aprox: {facturacion.total}</div>
					<div>Tipo de cobro: {facturacion.form_cobro}</div>
					<div>Concepto: {facturacion.concept}</div>
				</Card.Body>
			</Card>
			
		</div >
	)



}

export default DetailsFacturacion;