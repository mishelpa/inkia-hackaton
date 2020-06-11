import React, { useState, useEffect } from 'react';
import firebase from '../services/firebase';
import MaterialTable from 'material-table';
import AddSubject from './AddSubject';
import '../css/Subject.css';
import { Functions } from '../services/Functions';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Nav from './Nav';
import Header from './Header';
import Logo from '../img/Logo.svg'


const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	toolbar: theme.mixins.toolbar,
}))

const Subject = (props) => {
	const classes = useStyles();
	const theme = useTheme();
	const [user, setUser] = useState(null);
	const [dataSubject, setDataSubject] = useState([]);
	const [modalShow, setModalShow] = React.useState(false);

	const header = [
		{ title: 'ASUNTO', field: 'nameSubject' },
		{ title: 'EMPRESA QUE VA A FACTURAR', field: 'billSubject' },
		{ title: 'RESPONSABLE DE INKIA', field: 'responsibleSubject' }
	]

	const handleClick = (id) => {
		props.history.push(`subject/${id}`);
	}

	useEffect(() => {
		firebase.firestore()
			.collection('subject')
			.onSnapshot(onSnapshot => {
				const newObj = onSnapshot.docs.map((item) => ({
					id: item.id,
					...item.data()
				}))
				setDataSubject(newObj)
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
				<Header className={classes.toolbar} path="asunto"></Header>
				<div className="container-subject">
					<div className="divButton">
						<button tyoe="buttom" className="addSubject" onClick={() => setModalShow(true)}>
							Crear un asunto
        			</button>
					</div>
					<MaterialTable
						title=""
						// className={classes.header}
						columns={header}
						data={dataSubject}
						onRowClick={((evt, selectedRow) => handleClick(selectedRow.id))}
						editable={{
							onRowAdd: (newData) =>
								new Promise((resolve) => {
									setTimeout(() => {
										resolve();
										Functions.createData('subject', newData)
									}, 300);
								}),
							onRowUpdate: (newData, oldData) =>
								new Promise((resolve) => {
									setTimeout(() => {
										resolve();
										Functions.updateData('subject', oldData.id, newData);
									}, 300);
								}),
							onRowDelete: (oldData) =>
								new Promise((resolve) => {
									setTimeout(() => {
										resolve();
										Functions.deleteData('subject', oldData.id)
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

export default Subject