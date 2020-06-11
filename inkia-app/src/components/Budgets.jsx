import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import MaterialTable from 'material-table'
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import firebase from '../services/firebase';
import { Form, Col, Card, Modal } from 'react-bootstrap';
import { Functions } from '../services/Functions';
import { ButtonGroup, Accordion } from 'react-bootstrap';
import '../css/Budget.css';

const Budgets = (props) => {
	const { register, handleSubmit } = useForm();
	const [subjects, setSubjects] = React.useState([]);
	const [budgetsNew, setBudgetsNew] = React.useState({});
	const [idBudget, setIdBudget] = React.useState('');
	const [edition, setEdition] = React.useState('noedit');
	const [budgets, setBudgets] = React.useState([]);
	const [show, setShow] = React.useState(false);

	const [formCobro, setFormCobro] = React.useState([]);
	const [payment, setPayment] = React.useState([]);
	const [hito, setHito] = React.useState([]);
	const [concept, setConcept] = React.useState();
	const [arrayConcept, setArrayConcept] = React.useState();

	const [clicked, setClicked] = React.useState('button1');

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleChange = (e) => {
		if (e.target.name === 'num_concept') {
			setConcept(e.target.value)
		}
		setBudgetsNew(e.target.value);
	}

	/* CRUD Budgets */
	const addBudget = (data, event) => {
		console.log(data);
		event.preventDefault();
		data['estado'] = 'pendiente';
		// Functions.createData('budgets', data);
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

	const handleView = (e) => {
		if (e.target.name.includes('form_cobro')) {
			setFormCobro(formCobro.concat(e.target.value))
		}
		if (e.target.name.includes('form_payment')) {
			setPayment(payment.concat(e.target.value))
		}
		if (e.target.name.includes('num_hitos')) {
			setHito(hito.concat(e.target.value))
		}
		console.log(formCobro);
		console.log(e.target.name, e.target.value)
		setArrayConcept(e.target.value);
	}

	const formElements = [];
	for (let i = 0; i < hito; i++) {
		formElements.push(<Form.Label>Hito ${i + 1}</Form.Label>,
			<Form.Control size="sm" ref={register} name={'hito' + i} id={'hito' + i} onChange={handleChange} />
		);
	}

	// const Form = () => <p>my form</p>;
	const formConcepts = [];
	for (let i = 0; i < concept; i++) {
		formConcepts.push(<div className="concept"><Form.Label>Concepto ${i + 1}</Form.Label>, <Form.Control size="sm" ref={register} name={'concepto' + i} id={'concepto' + i} onChange={handleView} />,
			<Form.Row>
				<Form.Group as={Col}>
					<Form.Label>Tipo de honorario</Form.Label>
					<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name={"form_cobro"} id={"form_cobro"+i} onChange={handleView}>
						<option>Choose...</option>
						<option>Fijo</option>
						<option>Fijo + exito</option>
						<option>Horas</option>
					</Form.Control>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Label>Forma de pago</Form.Label>
					<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name={"form_payment"+i} id={"form_payment"+i} onChange={handleView}>
						<option>Choose...</option>
						<option>Hitos</option>
						<option>Mensual</option>
						<option>Bimestral</option>
						<option>Trimestral</option>
						<option>Semestral</option>
						<option>Anual</option>
					</Form.Control>
				</Form.Group>
			</Form.Row></div>,
		);
		if (formCobro[i] === 'Fijo') {
			formConcepts.push(<Form.Group as={Col}>
				<Form.Label>Monto</Form.Label>
				<Form.Control size="sm" ref={register} name={"total"+i} id={"total"+i} onChange={handleView} />
			</Form.Group>)
		}
		if (formCobro[i]==='Fijo + exito') {
			formConcepts.push(<div>
				<Form.Group as={Col}>
					<Form.Label>Monto</Form.Label>
					<Form.Control size="sm" ref={register} name={"total"+i} id={"total"+i} onChange={handleView} />
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Label>Definicion de éxito</Form.Label>
					<Form.Control size="sm" ref={register} name={"descripcion"+i} id={"descripcion"+i} onChange={handleView} />
				</Form.Group>
			</div>)

		}
		if (formCobro[i] === 'Horas') {
			formConcepts.push(<div>
				<Form.Group as={Col}>
					<Form.Label>Tarifa horaria</Form.Label>
					<Form.Control size="sm" ref={register} name={"tarifa_hora"+i} id={"tarifa_hora"+i} onChange={handleView}/>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Label>Horas estimadas</Form.Label>
					<Form.Control size="sm" ref={register} name={"hora_estimada"+i} id={"hora_estimada"+i} onChange={handleView}/>
				</Form.Group>
			</div>)
		}
		if (payment === 'Hitos') {
			formConcepts.push(<div>
				<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name={"num_hitos"} id={"num_hitos"+i} onChange={handleView}>
					<option>Choose...</option>
					{[...Array(5)].map((e, i) => (
						<option>{i + 1}</option>
					))}
				</Form.Control>
				{hito !== undefined && formElements}
			</div>)
		}
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
				<Card style={{ width: '35rem' }}>
					<Card.Body>
						<Form onSubmit={edition === 'edit' ? handleSubmit(saveUpdatedBudget) : handleSubmit(addBudget)}>
							<div className="width-90">
								<h5>Contacto del proveedor</h5>
								<hr />
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Proveedor</Form.Label>
										<Form.Control size="sm" type="text" placeholder="" ref={register} name="provider" id="provider" onChange={handleChange} value={budgetsNew.provider} />
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Tipo de servicio</Form.Label>
										<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="type_service" id="type_service" onChange={handleChange} value={budgetsNew.type_service}>
											<option>Choose...</option>
											<option>Agente residente</option>
											<option>Controversia</option>
											<option>Financiamiento/proyecto</option>
											<option>Notaria</option>
											<option>Otro</option>
										</Form.Control>
									</Form.Group>
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Nombre</Form.Label>
										<Form.Control size="sm" placeholder="" ref={register} name="name" id="name" onChange={handleChange} value={budgetsNew.name} />
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Celular</Form.Label>
										<Form.Control size="sm" placeholder="" ref={register} name="celular" id="celular" onChange={handleChange} value={budgetsNew.celular} />
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Email</Form.Label>
										<Form.Control type="email" size="sm" placeholder="" ref={register} name="email" id="email" onChange={handleChange} value={budgetsNew.email} />
									</Form.Group>
								</Form.Row>
							</div>
							<div className="width-90">
								<h5>Conceptos</h5>
								<hr />
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Asunto</Form.Label>
										<Form.Control type="email" size="sm" placeholder="" ref={register} name="subject" id="subject" onChange={handleChange} value={budgetsNew.subject} />
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Concepto</Form.Label>
										<Form.Control size="sm" ref={register} name="num_concept" id="num_concept" onChange={handleChange} value={budgetsNew.num_concept} />
									</Form.Group>
									{concept !== undefined && formConcepts}
								</Form.Row>
								<Form.Group>
									<Form.Label>Alcance del encargo</Form.Label>
									<Form.Control as="textarea" rows="3" ref={register} name="alcance" id="alcance" onChange={handleChange} value={budgetsNew.alcance} />
								</Form.Group>
							</div>
							<div className="width-90">
								<h5>Honorarios</h5>
								<hr />
								<Form.Group as={Col}>
									<Form.Label>Moneda</Form.Label>
									<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="currency" id="currency" onChange={handleView} value={budgetsNew.currency}>
										<option>Choose...</option>
										<option>Soles</option>
										<option>Euros</option>
										<option>Dolares</option>
										<option>Libras esterlinas</option>
									</Form.Control>
								</Form.Group>


							</div>
							<div className="width-90">
								<h5>Empresa contratante</h5>
								<hr />
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Empresa contratante</Form.Label>
										<Form.Control size="sm" ref={register} name="company" id="company" onChange={handleChange} value={budgetsNew.company} />
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Responsable en Inkia</Form.Label>
										<Form.Control size="sm" ref={register} name="corporative" id="corporative" onChange={handleChange} value={budgetsNew.corporative} />
									</Form.Group>
								</Form.Row>
							</div>
							<Button className="button-save" size="large" variant="outlined" type="submit">
								{edition === 'edit' ? 'EDIT' : 'SAVE'}
							</Button>
						</Form>
					</Card.Body>
				</Card>
			</Modal>
			<div style={{ width: '100%' }}>
				<MaterialTable
				
					columns={[
						{ title: 'ASUNTO', field: 'subject'},
						{ title: 'PROVEEDOR', field: 'provider' },
						{ title: 'TIPO DE PROVEEDOR', field: 'type-provider' },
						{ title: 'RESPONSABLE', field: 'corporative' }
					]}
					data={budgets}
					onRowClick={((evt, selectedRow) => handleClick(selectedRow.id))}
					title=""
				/>
			</div>
			<button type="buttom" className="newButton" onClick={handleShow}>Nuevo</button>
		</div >
	);
}

export default withRouter(Budgets);
