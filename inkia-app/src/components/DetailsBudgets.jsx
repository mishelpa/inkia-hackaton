import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import firebase from '../services/firebase';
import { Card, Button } from 'react-bootstrap';
import { Functions } from '../services/Functions';
import Facturacion from '../components/Facturacion';
import { HashRouter, Link } from 'react-router-dom';


const DetailsBudgets = () => {
	const { id } = useParams();
	console.log(id)
	const [budget, setBudget] = useState([])

	const updateState = () => {
		Functions.updateData('budgets', id, {estado: 'pendiente de aprobacion'})
	}
const hi = () => {

}
useEffect(() => {
	firebase.firestore()
		.collection('budgets').doc(id).get()
		.then(doc => {
			setBudget(doc.data())
		});
		hi()
	}, [])


	return (
		<div style={{ maxWidth: '100%' }}>
			<h1>{budget.provider}</h1>
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
			<Link hi={hi} onClick={updateState()}type="button" className="navTitle btn btn-dark" to="/Facturacion"> ENVIAR FAC</Link>
			

			
		</div >
	)



}

export default DetailsBudgets;