
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
	const [dataFactura, setDataFactura] = useState([]);
	const [modalShow, setModalShow] = React.useState(false);

	const header = [
    { title: 'N° DE FACTURA', field: 'numFactura' },
    { title: 'ASUNTO', field: 'subject' },
    { title: 'PROVEEDOR', field: 'provider' },
    { title: 'RESPONSABLE', field: 'corporative' },
	{ title: 'ESTADO',  field: 'substatus'}, 
	// render: rowData => <button style={rowData.substatus === 'PAGADA' ? {backgroundColor: '#8cff0069', width: '60%', fontSize: '11px', padding:'10px', cursor: 'initial'}:{backgroundColor:'#ffcd0094' , width: '60%', fontSize: '11px', cursor: 'initial'}}>{rowData.substatus}</button>},
  ]

	useEffect(() => {
		firebase.firestore()
			.collection('factura')
			.onSnapshot(onSnapshot => {
				const newObj = onSnapshot.docs.map((item) => ({
					id: item.id,
					...item.data()
				}))
				setDataFactura(newObj)
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
				<Header className={classes.toolbar} path="facturas"></Header>
				<div className="container-subject">
					<MaterialTable
						title=""
						columns={header}
						data={dataFactura}
						editable={{
							onRowAdd: (newData) =>
								new Promise((resolve) => {
									setTimeout(() => {
										resolve();
										Functions.createData('factura', newData)
									}, 300);
								}),
							onRowUpdate: (newData, oldData) =>
								new Promise((resolve) => {
									setTimeout(() => {
										resolve();
										Functions.updateData('factura', oldData.id, newData);
									}, 300);
								}),
							onRowDelete: (oldData) =>
								new Promise((resolve) => {
									setTimeout(() => {
										resolve();
										Functions.deleteData('factura', oldData.id)
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
				</div>
			</div>
		</div>


	)
}

export default Provider