import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button'
import firebase from '../services/firebase';
import { Form, Col, Card } from 'react-bootstrap';
import { Functions } from '../services/Functions';

const useStyles = makeStyles({
	root: {
		width: '100%',
	},
	container: {
		maxHeight: 440,
	},
});

const Budgets = () => {
	const { register, handleSubmit, setValue } = useForm();
	const [budgetsNew, setBudgetsNew] = React.useState({});
	const [budgets, setBudgets] = React.useState([]);

	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChange = (e) => {
    setBudgetsNew(e.target.value);
	}
	
	const addBudget = (data, event) => {
		event.preventDefault();
		Functions.createData('budgets', data);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	useEffect(() => {
		firebase.firestore().collection('budgets').onSnapshot((querySnapshot) => {
			const array = [];
			querySnapshot.forEach((doc) => {
				array.push({ id: doc.id, ...doc.data() });
			});
			setBudgets(array);
		})
	})

	return (
		<div className="d-flex flex-column align-items-center">
			<Card style={{ width: '50rem' }}>
				<Card.Body>
					<Form onSubmit={handleSubmit(addBudget)}>
						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Proveedor</Form.Label>
								<Form.Control size="sm" type="text" placeholder="" ref={register} name="provider" id="provider" onChange={handleChange} value={budgetsNew.provider}/>
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

						<Form.Group>
							<Form.Label>Contacto de proveedor</Form.Label>
							<Form.Control size="sm" placeholder="" ref={register} name="contact" id="contact" onChange={handleChange} value={budgetsNew.contact}/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Subject</Form.Label>
							<Form.Control size="sm" placeholder="" ref={register} name="subject" id="subject" onChange={handleChange} value={budgetsNew.subject}/>
						</Form.Group>

						<Form.Row>
							<Form.Group as={Col}>
								<Form.Label>Concepto</Form.Label>
								<Form.Control size="sm" ref={register} name="concept" id="concept" onChange={handleChange} value={budgetsNew.concept}/>
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Moneda</Form.Label>
								<Form.Control size="sm" as="select" ref={register} name="currency" id="currency" onChange={handleChange} value={budgetsNew.currency}>
									<option>Soles</option>
									<option>Euros</option>
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label>Monto</Form.Label>
								<Form.Control size="sm" ref={register} name="total" id="total" onChange={handleChange} value={budgetsNew.total} />
							</Form.Group>
						</Form.Row>

						<Form.Group as={Col}>
							<Form.Label>Tipo de cobro</Form.Label>
							<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="form_cobro" id="form_cobro" onChange={handleChange} value={budgetsNew.form_cobro}>
								<option>Fijo</option>
								<option>Trimestral</option>
								<option>Exito</option>
							</Form.Control>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>Forma de pago</Form.Label>
							<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="form_payment" id="form_payment" onChange={handleChange} value={budgetsNew.form_payment}>
								<option>Anual</option>
								<option>Mensual</option>
								<option>Por hito</option>
							</Form.Control>
						</Form.Group>
						<Form.Group as={Col}>
							<Form.Label>Empresa contratante</Form.Label>
							<Form.Control size="sm" ref={register} name="company" id="company" onChange={handleChange} value={budgetsNew.company}/>
						</Form.Group>
						<Form.Group as={Col}>
							<Form.Label>Responsable en Inkia</Form.Label>
							<Form.Control size="sm" ref={register} name="corporative" id="corporative" onChange={handleChange} value={budgetsNew.corporative}/>
						</Form.Group>
						<Button size="large" variant="outlined" type="submit">
							Submit
					</Button>
					</Form>
				</Card.Body>
			</Card>
			<h1>PRESUPUESTOS</h1>
			<Paper className={classes.root}>
				<TableContainer className={classes.container}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell>PROVIDER</TableCell>
								<TableCell align="right">SUBJECT</TableCell>
								<TableCell align="right">CONCEPT</TableCell>
								<TableCell align="right">CURRENCY</TableCell>
								<TableCell align="right">TOTAL</TableCell>
								<TableCell align="right">STATE</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{budgets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((budget, index) => (

								<TableRow key={index}>
									<TableCell component="th" scope="row">
										{budget.provider}
									</TableCell>
									<TableCell style={{ width: 160 }} align="right">
										{budget.subject}
									</TableCell>
									<TableCell style={{ width: 160 }} align="right">
										{budget.concept}
									</TableCell>
									<TableCell style={{ width: 160 }} align="right">
										{budget.currency}
									</TableCell>
									<TableCell style={{ width: 160 }} align="right">
										{budget.total}
									</TableCell>
									<TableCell style={{ width: 160 }} align="right">
										<Button variant="outlined" color="secondary" onClick={(e) => alert(budget.provider)}>{budget.estado}</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 15, 50]}
					component="div"
					count={budgets.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}

export default Budgets;
