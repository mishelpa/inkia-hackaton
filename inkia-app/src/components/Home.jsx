import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Nav from './Nav';
import firebase from '../services/firebase';
import '../css/Home.css';
const Home = (props) => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const signOut = () => {
		firebase.auth().signOut().then(() => {
			props.history.push('/')
		}).catch((error) => {
			console.log(error);
		})
	}

	return (
		<div>

			<div className="modales">
				<Modal className="modales" show={show}  onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Cerrar Sesión</Modal.Title>
					</Modal.Header>
					<Modal.Body>¿Estás seguro de cerrar sesión?</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={signOut}>
							Cerrar 
			  </Button>
					</Modal.Footer>
				</Modal>
			</div>
				<Nav close={handleShow} />
		</div>


	)
}

export default Home;