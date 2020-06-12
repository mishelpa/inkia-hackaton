import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import firebase from '../services/firebase';
import { Card, Button } from 'react-bootstrap';
import { Functions } from '../services/Functions';
import BillBudget from './BillBudget';
import Nav from './Nav';
import Header from './Header';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import '../css/DetailBudget.css';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	toolbar: theme.mixins.toolbar,
}))


const DetailsBudgets = (props) => {
	const classes = useStyles();
	const theme = useTheme();

	const { id } = useParams();
	const [budget, setBudget] = useState([])
	const [totalBudget, setTotalBudget] = useState(0)

	const updateState = () => {
		Functions.updateData('budgets', id, { estado: 'pendiente de aprobacion' })
		props.history.push('/budgets')
	}
	const addFactura = () => {
		console.log('listo');
	}

	useEffect(() => {
		firebase.firestore()
			.collection('budgets').doc(id).get()
			.then(doc => {
				const allTotal = Object.keys(doc.data()).map((key)=>{
          if(key.substr(0,5)==="total"){
            return parseInt(doc.data()[key])
					} else return 0
				}).reduce((a,b) => a+b)
				setTotalBudget(allTotal);
				setBudget(doc.data())
			});
	}, [])

	return (
		<div className={classes.root}>
			<Nav />
			<div style={{ width: '100%' }}>
				<Header className={classes.toolbar} path="presupuesto por aprobar"></Header>
				<div className="container-details">
					<Card style={{ width: '100%' }} className="mb-4">
						<Card.Header className="d-flex justify-content-between name">
							<div><span className="bold">Asunto:</span> {budget.subject}</div>
							<div><span className="bold">Responsable:</span> {budget.corporative}</div>
						</Card.Header>
						<Card.Body className="body">
							<div className="row text-center">
								<div className="col-3 vl text-center">
									<div><span className="bold">Empresa</span></div>
									<div>{budget.company}</div>
								</div>
								<div className="col-3 vl ">
									<div><span className="bold">Proveedor</span></div>
									<div>{budget.provider}</div>
								</div>
								<div className="col-3 vl">
									<div><span className="bold">Tipo de proveedor</span></div>
									<div>{budget.type_service}</div>
								</div>
								<div className="col-3">
									<div><span className="bold">Monto</span></div>
									<div>{budget.montoTotal} {budget.currency}</div>
								</div>
							</div>
						</Card.Body>
					</Card>
					<div className="d-flex justify-content-end">
						{budget.estado !== "pendiente de aprobacion" ? (
							<Button onClick={() => updateState()} className="btnAprobar">Aprobar</Button>
						) : <BillBudget budget={budget} idBudget={id} totalbudget={budget.montoTotal}/>}
					</div>
				</div>
			</div>
		</div>
	)



}

export default DetailsBudgets;