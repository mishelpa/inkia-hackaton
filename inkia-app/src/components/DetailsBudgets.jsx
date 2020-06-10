import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import firebase from '../services/firebase';
import { Card, Button} from 'react-bootstrap';
import { Functions } from '../services/Functions';
import '../css/DetailBudget.css'

const DetailsBudgets = () => {
	const { id } = useParams();
	console.log(id)
	const [budget, setBudget] = useState([])

	const updateState = () => {
		Functions.updateData('budgets', id, {estado: 'pendiente de aprobacion'})
	}

	useEffect(() => {
		firebase.firestore()
			.collection('budgets').doc(id).get()
			.then(doc => {
				setBudget(doc.data())
			});
	}, [])


	return (
		<div className="detail-budget">
			{/* <h1>{budget.provider}</h1> */}
			<Card style={{ width: '50rem' }}>
				<Card.Header className="d-flex justify-content-between">
					<div>Asunto: {budget.subject}</div>
					<div>Responsable: {budget.corporative}</div>
				</Card.Header>
				<Card.Body>
					<div className="d-flex justify-content-between">
						<div className="d-flex flex-column">
							<div>Empresa:</div>
							<div>{budget.company}</div>
						</div>
						<div className="d-flex flex-column">
							<div>Proveedor:</div>
							<div>{budget.provider}</div>
						</div>
						<div className="d-flex flex-column">
							<div>Tipo de proveedor:</div>
							<div>{budget.type_provider}</div>
						</div>
					</div>
					<div>Concepto: {budget.concept}</div>
					<div>Moneda: {budget.currency}</div>
					<div>Monto: {budget.total}</div>
					<div>Tipo de cobro: {budget.type_charge}</div>
				</Card.Body>
			</Card>
			<Button onClick={updateState()}>Enviar a factura</Button>
		</div >
	)



}

export default DetailsBudgets;