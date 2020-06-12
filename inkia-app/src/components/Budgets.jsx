import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import MaterialTable from 'material-table'
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import firebase from '../services/firebase';
import { Form, Col, Card, Modal } from 'react-bootstrap';
import { Functions } from '../services/Functions';
import { ButtonGroup } from 'react-bootstrap';
import Nav from './Nav';
import Header from './Header';
import '../css/Budget.css';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	toolbar: theme.mixins.toolbar,
}))
const Budgets = (props) => {
	const classes = useStyles();
	const theme = useTheme();

	const { register, handleSubmit } = useForm();
	const [subjects, setSubjects] = React.useState([]);
	const [budgetsNew, setBudgetsNew] = React.useState({});
	const [idBudget, setIdBudget] = React.useState('');
	const [edition, setEdition] = React.useState('noedit');
	const [budgets, setBudgets] = React.useState([]);
	const [show, setShow] = React.useState(false);
	const [facturas, setFacturas] = React.useState([]);
	const [formCobro, setFormCobro] = React.useState([]);
	const [payment, setPayment] = React.useState([]);
	const [hito, setHito] = React.useState([]);
	const [concept, setConcept] = React.useState();
	const [modoBudget, setModoBudget] = React.useState(true);

	const [clicked, setClicked] = React.useState('button1');
	const [file, setFile] = React.useState();
	const [total, setTotal] = React.useState([]);
	const [totalHora, setTotalHora] = React.useState([]);
	const [totalEstimado, setTotalEstimado] = React.useState([]);
	// const [montoTotal, setMontoTotal] = React.useState();
	const [companies, setCompanies] = React.useState([]);

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
		setModoBudget(true)
		setClicked(id_btn)
		firebase.firestore().collection('budgets').where('estado', '==', state).onSnapshot((querySnapshot) => {
			const array = [];
			querySnapshot.forEach((doc) => {
				array.push({ id: doc.id, ...doc.data() });
			});
			setBudgets(array);
		})
	}

	const filterFacturas = (id_btn, state) => {
		setModoBudget(false)
		setClicked(id_btn)
		firebase.firestore().collection('factura').where('status', '==', state).onSnapshot((querySnapshot) => {
			const array = [];
			querySnapshot.forEach((doc) => {
				array.push({ id: doc.id, ...doc.data() });
			});
			setFacturas(array);
		})
	}

	let tmpCobro = Array(concept).fill(0);
	let tmpPayment = Array(concept).fill(0);
	let tmpHito = Array(concept).fill(0);
	let tmpTotal = Array(concept).fill(0);
	let tmpHora = Array(concept).fill(0);
	let tmpEstimado = Array(concept).fill(0);
	const handleView = (e) => {
		console.log(e.target.value);
		const index = e.target.dataset.index;
		tmpCobro = [...formCobro];
		tmpPayment = [...payment];
		tmpHito = [...hito];
		tmpTotal = [...total];
		tmpHora = [...totalHora];
		tmpEstimado = [...totalEstimado];
		if (e.target.name.includes('form_cobro')) {
			tmpCobro[index] = e.target.value;
			setFormCobro(tmpCobro);
		}
		if (e.target.name.includes('form_payment')) {
			tmpPayment[index] = e.target.value;
			setPayment(tmpPayment);
		}
		if (e.target.name.includes('num_hitos')) {
			tmpHito[index] = e.target.value;
			setHito(tmpHito);
		}
		if (e.target.name.includes('total')) {
			tmpTotal[index] = e.target.value;
			setTotal(tmpTotal)
		}
		if (e.target.name.includes('tarifa_hora')) {
			tmpHora[index] = e.target.value;
			setTotalHora(tmpHora)
		}
		if (e.target.name.includes('hora_estimada')) {
			tmpEstimado[index] = e.target.value;
			setTotalEstimado(tmpEstimado)
		}
	}

	const sumArray = (array) => {
		console.log(array, 'array');
		array = array.map(v => (v === undefined || isNaN(v)) ? 0 : v);
		return array.reduce((a, b) => parseInt(a) + parseInt(b), 0)
	}

	const multiplyArray = (array1, array2) => {
		return array1.map((x, index) => {
			x = isNaN(x) ? 0 : x;
			return parseInt(x) * parseInt(array2[index]);
		});
	}


	const formConcepts = [];
	for (let i = 0; i < concept; i++) {
		formConcepts.push(<div><div className="title-concept">Concepto {i + 1}</div><Form.Group><Form.Label>Descripción</Form.Label><Form.Control size="sm" ref={register} name={'concepto' + i} id={'concepto' + i} onChange={handleView} /></Form.Group>
			<Form.Row>
				<Form.Group as={Col}>
					<Form.Label>Tipo de cobro</Form.Label>
					<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} data-index={i} name={"form_cobro" + i} id={"form_cobro" + i} onChange={handleView}>
						<option>Choose...</option>
						<option>Fijo</option>
						<option>Fijo + exito</option>
						<option>Horas</option>
					</Form.Control>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Label>Forma de pago</Form.Label>
					<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} data-index={i} name={"form_payment" + i} id={"form_payment" + i} onChange={handleView}>
						<option>Choose...</option>
						<option>Hitos</option>
						<option>Mensual</option>
						<option>Bimestral</option>
						<option>Trimestral</option>
						<option>Semestral</option>
						<option>Anual</option>
					</Form.Control>
				</Form.Group>
			</Form.Row></div>
		);
		if (formCobro[i] === 'Fijo') {
			formConcepts.push(<Form.Group>
				<Form.Label>Monto</Form.Label>
				<Form.Control size="sm" ref={register} name={"total" + i} data-index={i} id={"total" + i} onChange={handleView} />
			</Form.Group>,
				<p ref={register} name={"subtotal" + i} data-index={i} id={"subtotal" + i} onChange={handleView}>SubTotal {total[i]}</p>
			)
		}
		if (formCobro[i] === 'Fijo + exito') {
			formConcepts.push(<div>
				<Form.Group>
					<Form.Label>Monto</Form.Label>
					<Form.Control size="sm" ref={register} name={"total" + i} data-index={i} id={"total" + i} onChange={handleView} />
				</Form.Group>
				<Form.Group>
					<Form.Label>Definicion de éxito</Form.Label>
					<Form.Control size="sm" ref={register} name={"descripcion" + i} id={"descripcion" + i} onChange={handleView} />
				</Form.Group>
				<p ref={register} name={"subtotal" + i} data-index={i} id={"subtotal" + i} onChange={handleView}>SubTotal {total[i]}</p>
			</div>)

		}
		if (formCobro[i] === 'Horas') {
			formConcepts.push(<div>
				<Form.Group as={Col}>
					<Form.Label>Tarifa horaria</Form.Label>
					<Form.Control size="sm" ref={register} name={"tarifa_hora" + i} data-index={i} id={"tarifa_hora" + i} onChange={handleView} />
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Label>Horas estimadas</Form.Label>
					<Form.Control size="sm" ref={register} name={"hora_estimada" + i} data-index={i} id={"hora_estimada" + i} onChange={handleView} />
				</Form.Group>,
				<p>SubTotal {parseInt(totalHora[i]) * parseInt(totalEstimado[i])}</p>
			</div>)
		}
		if (payment[i] === 'Hitos') {
			formConcepts.push(<div>
				<Form.Label>Número de hitos:</Form.Label>
				<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} data-index={i} name={"num_hitos" + i} id={"num_hitos" + i} onChange={handleView}>
					<option>Choose...</option>
					{[...Array(5)].map((e, i) => (
						<option>{i + 1}</option>
					))}
				</Form.Control>
			</div>);
			if (hito[i]) {
				console.log(hito[i], 'i');
				formConcepts.push(<div>
					{[...Array(parseInt(hito[i]))].map((hit, k) => (
						// <Form.Label>Hito {i}</Form.Label>,
						<div>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Monto del hito {k + 1}</Form.Label>
									<Form.Control size="sm" ref={register} name={'hito_monto' + i + k} id={'hito_monto' + i + k} onChange={handleView} />
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>Descripcion del hito {k + 1}</Form.Label>
									<Form.Control size="sm" ref={register} name={'hito_desc' + i + k} id={'hito_desc' + i + k} onChange={handleView} />
								</Form.Group>
							</Form.Row>
						</div>
					)
					)}</div>)
			}
		}
	}

	const handleClick = (id) => {
		props.history.push(`/budgets/${id}`);
	}

	useEffect(() => {
		firebase.firestore().collection('budgets').where('estado', '==', 'pendiente').onSnapshot((querySnapshot) => {
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

	useEffect(() => {
		firebase.firestore().collection('companies').onSnapshot((querySnapshot) => {
			const array = [];
			querySnapshot.forEach((doc) => {
				array.push({ id: doc.id, ...doc.data() });
			});
			setCompanies(array);
		})
	}, [])

	return (
		<div className={classes.root}>
			<Nav />
			<div style={{ width: '100%' }}>
				<Header className={classes.toolbar} path="inicio"></Header>
				<div className="d-flex flex-column align-items-center container-budget">
					<ButtonGroup className="btn-group">
						<Button id="button1" onClick={e => filterData("button1", 'pendiente')} className={clicked === 'button1' ? 'active' : "btn-budget"}>Presupuestos por aprobar</Button>
						<Button id="button2" onClick={e => filterData("button2", 'pendiente de aprobacion')} className={clicked === 'button2' ? 'active' : "btn-budget"}>Presupuestos aprobados</Button>
						<Button id="button3" onClick={e => filterFacturas("button3", 'pendiente')} className={clicked === 'button3' ? 'active' : "btn-budget"}>Facturas por aprobar</Button>
						<Button id="button4" onClick={e => filterFacturas("button4", 'aprobada')} className={clicked === 'button4' ? 'active' : "btn-budget"}>Facturas aprobadas</Button>
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
													{/* <option>Financiamiento/proyecto</option> */}
													<option>Notaria</option>
													<option>Otro</option>
												</Form.Control>
											</Form.Group>
										</Form.Row>
										<Form.Row>
											<Form.Group as={Col}>
												<Form.Label>Contacto del proveedor</Form.Label>
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
												<Form.Control type="text" size="sm" placeholder="" ref={register} name="subject" id="subject" onChange={handleChange} value={budgetsNew.subject} />
											</Form.Group>
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
											<Form.Group as={Col}>
												<Form.Label>Número de conceptos:</Form.Label>
												<Form.Control size="sm" ref={register} name="num_concept" id="num_concept" onChange={handleChange} value={budgetsNew.num_concept} />
											</Form.Group>
										</Form.Row>
										<div className="container-concepts">
											{concept && formConcepts}
											{concept && <p>Monto total {sumArray(multiplyArray(totalHora, totalEstimado)) + sumArray(total)}</p>}
										</div>
										<Form.Group>
											<Form.Label>Alcance del encargo</Form.Label>
											<Form.Control as="textarea" rows="3" ref={register} name="alcance" id="alcance" onChange={handleChange} value={budgetsNew.alcance} />
										</Form.Group>
									</div>
									<div className="width-90">
										<h5>Empresa contratante</h5>
										<hr />
										<Form.Row>
											<Form.Group as={Col}>
												<Form.Label>Empresa contratante</Form.Label>
												<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="company" id="company" onChange={handleChange} value={budgetsNew.company}>
													<option>Choose...</option>
													{companies.map((company) => (
														<option>{company.nameCompany}</option>
													))}
												</Form.Control>
											</Form.Group>
											{/* <Form.Group as={Col}>
												<Form.Label>Empresa contratante</Form.Label>
												<Form.Control size="sm" ref={register} name="company" id="company" onChange={handleChange} value={budgetsNew.company} />
											</Form.Group> */}
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
						{
							modoBudget ? (
								<MaterialTable

									columns={[
										{ title: 'ASUNTO', field: 'subject' },
										{ title: 'PROVEEDOR', field: 'provider' },
										{ title: 'TIPO DE PROVEEDOR', field: 'type_service' },
										{ title: 'RESPONSABLE', field: 'corporative' }
									]}
									data={budgets}
									onRowClick={((evt, selectedRow) => handleClick(selectedRow.id))}
									title=""
									options={{
										headerStyle: {
											backgroundColor: '#9e8ca9',
											color: '#000'
										}
									}}
								/>
							) : (
									<MaterialTable
										columns={[
											{ title: 'N° DE FACTURA', field: 'numFactura' },
											{ title: 'ASUNTO', field: 'subject' },
											{ title: 'PROVEEDOR', field: 'provider' },
											{ title: 'RESPONSABLE', field: 'corporative' },
											{
												title: 'Estado',
												field: 'substatus',
											}
										]}
										data={facturas}
										onRowClick={((evt, selectedRow) => handleClick(selectedRow.idBudget))}
										title=""
										options={{
											headerStyle: {
												backgroundColor: '#9e8ca9',
												color: '#000'
											}
										}}
									/>
								)
						}
					</div>
					<button type="buttom" className="newButton" onClick={handleShow}>Nuevo</button>
				</div >
			</div>
		</div>
	);
}

export default withRouter(Budgets);
