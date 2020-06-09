import React, { useEffect } from 'react';
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

const useStyles = makeStyles({
	root: {
		width: '100%',
	},
	container: {
		maxHeight: 440,
	},
});

const Budgets = () => {
	const [budgets, setBudgets] = React.useState([]);

	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
		<div>
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
