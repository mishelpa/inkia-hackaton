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
		console.log(e.target.value)
    setBudgetsNew(e.target.value);
	}
	
	const addBudget = (data, event) => {
		event.preventDefault();
		console.log(data);
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
								<Form.Control size="sm" as="select" defaultValue="Choose..." ref={register} name="service" id="service" onChange={handleChange} value={budgetsNew.service}>
									<option>Agente residente</option>
									<option>Controversia</option>
									<option>Financiamiento</option>
									<option>Notaria</option>
									<option>Otro</option>
								</Form.Control>
							</Form.Group>
						</Form.Row>

						<Form.Group controlId="formGridContactProvider">
							<Form.Label>Contacto de proveedor</Form.Label>
							<Form.Control size="sm" placeholder="" onChange={handleChange}/>
						</Form.Group>

						<Form.Group controlId="formGridSubject">
							<Form.Label>Subject</Form.Label>
							<Form.Control size="sm" placeholder="" onChange={handleChange}/>
						</Form.Group>

						<Form.Row>
							<Form.Group as={Col} controlId="formGridConcept">
								<Form.Label>Concepto</Form.Label>
								<Form.Control size="sm" onChange={handleChange}/>
							</Form.Group>

							<Form.Group as={Col} controlId="formGridCurrency">
								<Form.Label>Moneda</Form.Label>
								<Form.Control size="sm" as="select" defaultValue="Choose..." onChange={handleChange}>
									<option>Soles</option>
									<option>Euros</option>
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col} controlId="formGridTotal" onChange={handleChange}>
								<Form.Label>Monto</Form.Label>
								<Form.Control size="sm" />
							</Form.Group>
						</Form.Row>

						<Form.Group as={Col} controlId="formGridPayment">
							<Form.Label>Tipo de cobro</Form.Label>
							<Form.Control size="sm" as="select" defaultValue="Choose..." onChange={handleChange}>
								<option>Fijo</option>
								<option>Trimestral</option>
								<option>Exito</option>
							</Form.Control>
						</Form.Group>

						<Form.Group as={Col} controlId="formGridFormPayment">
							<Form.Label>Forma de pago</Form.Label>
							<Form.Control size="sm" as="select" defaultValue="Choose..." onChange={handleChange}>
								<option>Anual</option>
								<option>Mensual</option>
								<option>Por hito</option>
							</Form.Control>
						</Form.Group>
						<Form.Group as={Col} controlId="formGridCompany">
							<Form.Label>Empresa contratante</Form.Label>
							<Form.Control size="sm" onChange={handleChange}/>
						</Form.Group>
						<Form.Group as={Col} controlId="formGridResponsible">
							<Form.Label>Responsable en Inkia</Form.Label>
							<Form.Control size="sm" onChange={handleChange}/>
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
