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

	/* CRUD Budgets */
	const addBudget = (data, event) => {
		event.preventDefault();
    firebase.firestore().collection('factura').doc(props.factura.id).collection('concepto').add(data);
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
		formElements.push(<Form.Label>Hito ${i + 1}</Form.Label>,
			<Form.Control size="sm" ref={register} name={'hito' + i} id={'hito' + i} onChange={handleChange} />
		);
	}


	return (
		<div className="d-flex flex-column align-items-center container-budget">
			<Modal show={show} onHide={handleClose}>
				<Card style={{ width: '50rem' }}>
					<Card.Body>
						<Form onSubmit={edition === 'edit' ? handleSubmit(saveUpdatedBudget) : handleSubmit(addBudget)}>
							<div>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Concepto</Form.Label>
										<Form.Control size="sm" ref={register} name="concept" id="concept" onChange={handleChange} value={budgetsNew.concept} />
									</Form.Group>
								</Form.Row>
							</div>
							<div>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Moneda</Form.Label>
										<Form.Control size="sm" as="select" ref={register} name="currency" id="currency" onChange={handleChange} value={budgetsNew.currency}>
											<option>Soles</option>
                      <option>Dolares</option>
											<option>Euros</option>
											<option>Libras esterlinas</option>
										</Form.Control>
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Tipo de honorario</Form.Label>
										<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="form_cobro" id="form_cobro" onChange={handleChange} value={budgetsNew.form_cobro}>
                      <option>Horas</option>
                      <option>Fijo</option>
											<option>Exito</option>
											<option>Horas</option>
										</Form.Control>
									</Form.Group>
								</Form.Row>
								{formCobro === 'Fijo' &&
									<Form.Group as={Col}>
										<Form.Label>Monto</Form.Label>
										<Form.Control size="sm" ref={register} name="total" id="total" onChange={handleChange} value={budgetsNew.total} />
									</Form.Group>}
								{formCobro === 'Exito' &&
									<div>
										<Form.Group as={Col}>
											<Form.Label>Monto</Form.Label>
											<Form.Control size="sm" ref={register} name="total" id="total" onChange={handleChange} value={budgetsNew.total} />
										</Form.Group>
										<Form.Group as={Col}>
											<Form.Label>Definicion de éxito</Form.Label>
											<Form.Control size="sm" ref={register} name="descripcion" id="descripcion" onChange={handleChange} value={budgetsNew.descripcion} />
										</Form.Group>
									</div>}
								{formCobro === 'Horas' &&
									<div>
										<Form.Group as={Col}>
											<Form.Label>Tarifa horaria</Form.Label>
											<Form.Control size="sm" ref={register} name="tarifa_hora" id="tarifa_hora" onChange={handleChange} value={budgetsNew.tarifa_hora} />
										</Form.Group>
										<Form.Group as={Col}>
											<Form.Label>Horas</Form.Label>
											<Form.Control size="sm" ref={register} name="hora_estimada" id="hora_estimada" onChange={handleChange} value={budgetsNew.hora_estimada} />
										</Form.Group>
									</div>}
								<Form.Group as={Col}>
									<Form.Label>Forma de pago</Form.Label>
									<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="form_payment" id="form_payment" onChange={handleChange} value={budgetsNew.form_payment}>
										<option>Hitos</option>
										<option>Mensual</option>
										<option>Bimestral</option>
										<option>Trimestral</option>
										<option>Semestral</option>
										<option>Anual</option>
									</Form.Control>
								</Form.Group>
								{payment === 'Hitos' &&
									<div>
										<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="num_hitos" id="num_hitos" onChange={handleChange} value={budgetsNew.num_hitos}>
											{[...Array(5)].map((e, i) => (
												<option>{i + 1}</option>
											))}
										</Form.Control>
										{hito !== undefined && formElements}
									</div>
								}

							</div>


							<hr />
							<Button size="large" variant="outlined" type="submit">
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
