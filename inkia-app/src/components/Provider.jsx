
import React, { useState, useEffect } from 'react';
import firebase from '../services/firebase';
import MaterialTable from 'material-table';
import AddSubject from './AddSubject';
import '../css/Subject.css';
import { Functions } from '../services/Functions';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Nav from './Nav';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	toolbar: theme.mixins.toolbar,
}))

const Provider = (props) => {
	const classes = useStyles();
	const theme = useTheme();
	const [user, setUser] = useState(null);
	const [dataProvider, setDataProvider] = useState([]);
	const [modalShow, setModalShow] = React.useState(false);

	const header = [
		{ title: 'RAZÓN SOCIAL', field: 'socialProvider' },
		{ title: 'TIPO DE SERVICIO', field: 'typeProvider' },
    { title: 'PAÍS', field: 'countryProvider' },
    { title: 'CORREO ELECTRÓNICO', field: 'emailProvider' }
	]

	useEffect(() => {
		firebase.firestore()
			.collection('provider')
			.onSnapshot(onSnapshot => {
				const newObj = onSnapshot.docs.map((item) => ({
					id: item.id,
					...item.data()
				}))
				setDataProvider(newObj)
			})
	}, [])

	useEffect(() => {
		if (firebase.auth().currentUser) {
			setUser(firebase.auth().currentUser)
		}
		else {
			props.history.push('/login')
		}
	}, [props.history])

	return (
		<div className={classes.root}>
			<Nav />
			<div style={{ width: '100%' }}>
				<Header className={classes.toolbar} path="proveedores"></Header>
				<div className="container-subject">
					<MaterialTable
						title=""
						// className={classes.header}
						columns={header}
						data={dataProvider}
						editable={{
							onRowAdd: (newData) =>
								new Promise((resolve) => {
									setTimeout(() => {
										resolve();
										Functions.createData('provider', newData)
									}, 300);
								}),
							onRowUpdate: (newData, oldData) =>
								new Promise((resolve) => {
									setTimeout(() => {
										resolve();
										Functions.updateData('provider', oldData.id, newData);
									}, 300);
								}),
							onRowDelete: (oldData) =>
								new Promise((resolve) => {
									setTimeout(() => {
										resolve();
										Functions.deleteData('provider', oldData.id)
									}, 300);
								}),
						}}
						options={{
							actionsColumnIndex: -1,
							headerStyle: {
								backgroundColor: '#9e8ca9',
								color: '#000'
							},
							rowStyle: {
								padding: '0 !important',
							}
						}}
					/>
					<AddSubject
						show={modalShow}
						onHide={() => setModalShow(false)}
					/>
				</div>
			</div>
		</div>


	)
}

export default Provider