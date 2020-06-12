import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import firebase from '../services/firebase';
import { Form, Col, Card, Modal } from 'react-bootstrap';
import { Functions } from '../services/Functions';
import '../css/Budget.css';
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import '../css/Example.css';

const Example = (props) => {
	const { register, handleSubmit } = useForm();
	const [budgetsNew, setBudgetsNew] = React.useState({});
	const [idBudget, setIdBudget] = React.useState('');
	const [edition, setEdition] = React.useState('noedit');
	const [show, setShow] = React.useState(false);

	const [formCobro, setFormCobro] = React.useState();
	const [payment, setPayment] = React.useState();
	const [hito, setHito] = React.useState();
	const [arrConcepto, setArrConcepto] = React.useState([]);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleChange = (e) => {
		if (e.target.name === 'form_cobro') {
			setFormCobro(e.target.value)
		}
		if (e.target.name === 'form_payment') {
			setPayment(e.target.value)
		}
		if (e.target.name === 'num_hitos') {
			setHito(e.target.value)
		}
		setBudgetsNew(e.target.value);
	}

	useEffect(() => {
		firebase.firestore()
			.collection('budgets').doc(props.factura.idBudget).get()
			.then(doc => {
				const arr = Object.keys(doc.data()).map((key) => {
					if (key.substr(0, 8) === "concepto") {
						return doc.data()[key]
					} else return ""
				}).filter((item) => item !== "")
				setArrConcepto(arr)
			});
	}, [])

	/* CRUD Budgets */
	const addBudget = (data, event) => {
		if(data.hora_estimada && data.tarifa_hora){
			data.total = parseInt(data.hora_estimada) * parseInt(data.tarifa_hora)
		}
		const newData = { idBudget: props.factura.idBudget, idFactura: props.factura.id, ...data }
		event.preventDefault();
		firebase.firestore().collection('concepto').add(newData)
	};


	const saveUpdatedBudget = (data, event) => {
		event.preventDefault();
		data['estado'] = 'PENDIENTE';
		setEdition('noedit');
		Functions.updateData('budgets', idBudget, data);
	}

	// const Form = () => <p>my form</p>;
	const formElements = [];
	for (let i = 0; i < hito; i++) {
		formElements.push(
			<Form.Row>
				<Form.Group as={Col}>
					<Form.Label>Monto del hito {i + 1}</Form.Label>
					<Form.Control size="sm" ref={register} name={'hito' + i} id={'hito' + i} onChange={handleChange} />
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Label>Descripcion del hito {i + 1}</Form.Label>
					<Form.Control size="sm" ref={register} name={'hito_desc' + i} id={'hito_desc' + i} onChange={handleChange} />
				</Form.Group>
			</Form.Row>
		);
	}


	return (
		<div className="d-flex flex-column align-items-center">
			<Modal show={show} onHide={handleClose}>
				<Card style={{ width: '30rem' }}>
					<Card.Body>
						<Form onSubmit={edition === 'edit' ? handleSubmit(saveUpdatedBudget) : handleSubmit(addBudget)}>
							<div>
								<h5>AGREGAR CONCEPTO</h5>
								<hr />
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Concepto</Form.Label>
										<Form.Control size="sm" as="select" selectedValue="Choose..." ref={register} name="concept" id="concept" onChange={handleChange} value={budgetsNew.concept}>
											<option>Choose ...</option>
											{arrConcepto.map((item) => (
												<option key={item}>{item}</option>
											))}
										</Form.Control>
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Moneda</Form.Label>
										<Form.Control size="sm" as="select" ref={register} selectedValue="Choose..." name="currency" id="currency" onChange={handleChange} value={budgetsNew.currency}>
											<option>Choose ...</option>
											<option>Soles</option>
											<option>Dolares</option>
											<option>Euros</option>
											<option>Libras esterlinas</option>
										</Form.Control>
									</Form.Group>
								</Form.Row>
							</div>
							<div style={{ width: '90%' }}>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Tipo de honorario</Form.Label>
										<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="form_cobro" id="form_cobro" onChange={handleChange} value={budgetsNew.form_cobro}>
											<option>Choose ...</option>
											<option>Fijo</option>
											<option>Exito</option>
											<option>Horas</option>
										</Form.Control>
									</Form.Group>

								</Form.Row>
								{formCobro === 'Fijo' &&
									<Form.Group>
										<Form.Label>Monto</Form.Label>
										<Form.Control size="sm" ref={register} name="total" id="total" onChange={handleChange} value={budgetsNew.total} />
									</Form.Group>}
								{formCobro === 'Exito' &&
									<Form.Row>
										<Form.Group as={Col}>
											<Form.Label>Monto</Form.Label>
											<Form.Control size="sm" ref={register} name="total" id="total" onChange={handleChange} value={budgetsNew.total} />
										</Form.Group>
										<Form.Group as={Col}>
											<Form.Label>Definicion de éxito</Form.Label>
											<Form.Control size="sm" ref={register} name="descripcion" id="descripcion" onChange={handleChange} value={budgetsNew.descripcion} />
										</Form.Group>
									</Form.Row>}
								{formCobro === 'Horas' &&
									<Form.Row>
										<Form.Group as={Col}>
											<Form.Label>Tarifa horaria</Form.Label>
											<Form.Control size="sm" ref={register} name="tarifa_hora" id="tarifa_hora" onChange={handleChange} value={budgetsNew.tarifa_hora} />
										</Form.Group>
										<Form.Group as={Col}>
											<Form.Label>Horas</Form.Label>
											<Form.Control size="sm" ref={register} name="hora_estimada" id="hora_estimada" onChange={handleChange} value={budgetsNew.hora_estimada} />
										</Form.Group>
									</Form.Row>}
								<div style={{ width: '100%' }}>
									<Form.Group>
										<Form.Label>Forma de pago</Form.Label>
										<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="form_payment" id="form_payment" onChange={handleChange} value={budgetsNew.form_payment}>
										<option>Choose ...</option>

											<option>Hitos</option>
											<option>Mensual</option>
											<option>Bimestral</option>
											<option>Trimestral</option>
											<option>Semestral</option>
											<option>Anual</option>
										</Form.Control>
									</Form.Group>
									{payment === 'Hitos' &&
										<Form.Group>
											<Form.Label>Número de hitos</Form.Label>
											<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="num_hitos" id="num_hitos" onChange={handleChange} value={budgetsNew.num_hitos}>
											<option>Choose ...</option>
												{[...Array(5)].map((e, i) => (
													<option>{i + 1}</option>
												))}
											</Form.Control>
											{hito !== undefined && formElements}
										</Form.Group>
									}
								</div>
							</div>
							<Button className="newButtonExample" size="large" variant="outlined" type="submit">
								{edition === 'edit' ? 'EDIT' : 'SAVE'}
							</Button>
						</Form>
					</Card.Body>
				</Card>
			</Modal>
			<Button className="concepto" onClick={handleShow}>Agregar Concepto</Button>
		</div >
	);
}

export default withRouter(Example);
