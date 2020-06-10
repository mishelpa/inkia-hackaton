import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import MaterialTable from 'material-table'
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import firebase from '../services/firebase';
import { Form, Col, Card, Modal } from 'react-bootstrap';
import { Functions } from '../services/Functions';
import { ButtonGroup } from 'react-bootstrap';
import '../css/Budget.css';

const Budgets = (props) => {
	const { register, handleSubmit } = useForm();
	const [subjects, setSubjects] = React.useState([]);
	const [budgetsNew, setBudgetsNew] = React.useState({});
	const [idBudget, setIdBudget] = React.useState('');
	const [edition, setEdition] = React.useState('noedit');
	const [budgets, setBudgets] = React.useState([]);
	const [show, setShow] = React.useState(false);

	const [formCobro, setFormCobro] = React.useState();
	const [payment, setPayment] = React.useState();
	const [hito, setHito] = React.useState();
	const [select, setSelect] = React.useState();

	const [clicked, setClicked] = React.useState('button1');

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
		data['estado'] = 'pendiente';
		Functions.createData('budgets', data);
	};
	const saveUpdatedBudget = (data, event) => {
		event.preventDefault();
		data['estado'] = 'PENDIENTE';
		setEdition('noedit');
		Functions.updateData('budgets', idBudget, data);
	}
	/* Filter data*/
	const filterData = (id_btn, state) => {
		setClicked(id_btn)
		firebase.firestore().collection('budgets').where('estado', '==', state).onSnapshot((querySnapshot) => {
			const array = [];
			querySnapshot.forEach((doc) => {
				array.push({ id: doc.id, ...doc.data() });
			});
			setBudgets(array);
		})
	}



	// const Form = () => <p>my form</p>;
	const formElements = [];
	for (let i = 0; i < hito; i++) {
		formElements.push(<Form.Label>Hito ${i + 1}</Form.Label>,
			<Form.Control size="sm" ref={register} name={'hito' + i} id={'hito' + i} onChange={handleChange} />
		);
	}


	const handleClick = (id) => {
		props.history.push(`budgets/${id}`);
	}
	useEffect(() => {
		firebase.firestore().collection('budgets').onSnapshot((querySnapshot) => {
			const array = [];
			querySnapshot.forEach((doc) => {
				array.push({ id: doc.id, ...doc.data() });
			});
			setBudgets(array);
		})
	}, [])

	useEffect(() => {
		firebase.firestore().collection('subject').onSnapshot((querySnapshot) => {
			const array = [];
			querySnapshot.forEach((doc) => {
				array.push({ id: doc.id, ...doc.data() });
			});
			setSubjects(array);
		})
	}, [])
	return (
		<div className="d-flex flex-column align-items-center container-budget">
			<ButtonGroup className="btn-group">
				<Button id="button1" onClick={e => filterData("button1", 'pendiente')} className={clicked === 'button1' ? 'active' : "btn-budget"}>PRESUPUESTO</Button>
				<Button id="button2" onClick={e => filterData("button2", 'pendiente de aprobacion')} className={clicked === 'button2' ? 'active' : "btn-budget"}>PENDIENTE DE APROBACIÓN</Button>
				<Button id="button3" onClick={e => filterData("button3", 'pendiente de pago')} className={clicked === 'button3' ? 'active' : "btn-budget"}>PENDIENTE DE PAGO</Button>
				<Button id="button4" onClick={e => filterData("button4", 'pagada')} className={clicked === 'button4' ? 'active' : "btn-budget"}>PAGADAS</Button>
			</ButtonGroup>
			<Modal show={show} onHide={handleClose}>
				<Card style={{ width: '50rem' }}>
					<Card.Body>
						<Form onSubmit={edition === 'edit' ? handleSubmit(saveUpdatedBudget) : handleSubmit(addBudget)}>
							<div>
								<h3>Contacto del proveedor</h3>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Proveedor</Form.Label>
										<Form.Control size="sm" type="text" placeholder="" ref={register} name="provider" id="provider" onChange={handleChange} value={budgetsNew.provider} />
									</Form.Group>

									<Form.Group as={Col}>
										<Form.Label>Tipo de servicio</Form.Label>
										<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="type_service" id="type_service" onChange={handleChange} value={budgetsNew.type_service}>
											<option>Agente residente</option>
											<option>Controversia</option>
											<option>Financiamiento</option>
											<option>Notaria</option>
											<option>Otro</option>
										</Form.Control>
									</Form.Group>
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Celular</Form.Label>
										<Form.Control size="sm" placeholder="" ref={register} name="celular" id="celular" onChange={handleChange} value={budgetsNew.celular} />
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Email</Form.Label>
										<Form.Control size="sm" placeholder="" ref={register} name="email" id="email" onChange={handleChange} value={budgetsNew.email} />
									</Form.Group>
								</Form.Row>
							</div>
							<div>
								<h3>Datos del asunto</h3>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Asunto</Form.Label>
										<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="subject" id="subject" onChange={handleChange} value={budgetsNew.subject}>
											{subjects.map(el => (
												<option key={el.id}>{el.nameSubject}</option>
											))}

										</Form.Control>
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Concepto</Form.Label>
										<Form.Control size="sm" ref={register} name="concept" id="concept" onChange={handleChange} value={budgetsNew.concept} />
									</Form.Group>
								</Form.Row>
								<Form.Group>
									<Form.Label>Alcance del encargo</Form.Label>
									<Form.Control as="textarea" rows="3" ref={register} name="alcance" id="alcance" onChange={handleChange} value={budgetsNew.alcance} />
								</Form.Group>
							</div>

							<div>
								<h3>Honorarios</h3>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Moneda</Form.Label>
										<Form.Control size="sm" as="select" ref={register} name="currency" id="currency" onChange={handleChange} value={budgetsNew.currency}>
											<option>Soles</option>
											<option>Euros</option>
											<option>Libras esterlinas</option>
										</Form.Control>
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Tipo de honorario</Form.Label>
										<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="form_cobro" id="form_cobro" onChange={handleChange} value={budgetsNew.form_cobro}>
											<option>Fijo</option>
											<option>Fijo + exito</option>
											<option>Horas</option>
										</Form.Control>
									</Form.Group>
								</Form.Row>
								{formCobro === 'Fijo' &&
									<Form.Group as={Col}>
										<Form.Label>Monto</Form.Label>
										<Form.Control size="sm" ref={register} name="total" id="total" onChange={handleChange} value={budgetsNew.total} />
									</Form.Group>}
								{formCobro === 'Fijo + exito' &&
									<div>
										<Form.Group as={Col}>
											<Form.Label>Monto</Form.Label>
											<Form.Control size="sm" ref={register} name="total" id="total" onChange={handleChange} value={budgetsNew.total} />
										</Form.Group>
										<Form.Group as={Col}>
											<Form.Label>% exito</Form.Label>
											<Form.Control size="sm" ref={register} name="exito" id="exito" onChange={handleChange} value={budgetsNew.exito} />
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
											<Form.Label>Horas estimadas</Form.Label>
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

							<Form.Group as={Col}>
								<Form.Label>Empresa contratante</Form.Label>
								<Form.Control size="sm" ref={register} name="company" id="company" onChange={handleChange} value={budgetsNew.company} />
							</Form.Group>
							<Form.Group as={Col}>
								<Form.Label>Responsable en Inkia</Form.Label>
								<Form.Control size="sm" ref={register} name="corporative" id="corporative" onChange={handleChange} value={budgetsNew.corporative} />
							</Form.Group>
							<Button size="large" variant="outlined" type="submit">
								{edition === 'edit' ? 'EDIT' : 'SAVE'}
							</Button>
						</Form>
					</Card.Body>
				</Card>
			</Modal>
			<Button onClick={handleShow}>Nuevo</Button>
			<div style={{ width: '100%' }}>
				<MaterialTable
					columns={[
						{ title: 'ASUNTO', field: 'subject' },
						{ title: 'PROVEEDOR', field: 'provider' },
						{ title: 'TIPO DE PROVEEDOR', field: 'type-provider' },
						{ title: 'RESPONSABLE', field: 'corporative' }
					]}
					data={budgets}
					onRowClick={((evt, selectedRow) => handleClick(selectedRow.id))}
					title=""
				/>
			</div>
		</div >
	);
}

export default withRouter(Budgets);
