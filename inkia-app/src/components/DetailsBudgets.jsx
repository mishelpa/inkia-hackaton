import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import firebase from '../services/firebase';
import { Card, Button} from 'react-bootstrap';
import { Functions } from '../services/Functions';
import BillBudget from './BillBudget';
import '../css/DetailBudget.css';

const DetailsBudgets = () => {
	const { id } = useParams();
	console.log(id)
	const [budget, setBudget] = useState([])

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
				setBudget(doc.data())
			});
	}, [])


	return (
		<div className="container-fluid mt-5">
			<Card style={{ width: '100%' }} className="mb-5">
				<Card.Header className="d-flex justify-content-between name">
					<div>Asunto: {budget.subject}</div>
					<div>Responsable: {budget.corporative}</div>
				</Card.Header>
				<Card.Body className="body">
					<div className="row text-center">
						<div className="col-3 vl text-center">
							<div>Empresa</div>
							<div>{budget.company}</div>
						</div>
						<div className="col-3 vl ">
							<div>Proveedor</div>
							<div>{budget.provider}</div>
						</div>
						<div className="col-3 vl">
							<div>Tipo de proveedor</div>
							<div>{budget.type_provider}</div>
						</div>
						<div className="col-3">
							<div>Monto</div>
							<div>{budget.total} {budget.currency}</div>
						</div>
						</div>	
						</Card.Body>			
			</Card>
			<div className="d-flex justify-content-end">
					{budget.estado !== "pendiente de aprobacion" ? (
				<Button onClick={() => updateState()} className="btnAprobar">Aprobar</Button>
			) : <BillBudget budget = {budget} idBudget={id}/>}
			</div>
		
		</div>
	)



}

export default DetailsBudgets;