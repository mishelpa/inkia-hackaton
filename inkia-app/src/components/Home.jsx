import React, {useState} from 'react';
import { Modal, Button } from 'react-bootstrap';
import Nav from './Nav';
import firebase from '../services/firebase';

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
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={signOut}>
						Close
          </Button>
					<Button variant="primary" onClick={handleClose}>
						Save Changes
          </Button>
				</Modal.Footer>
			</Modal>
			<Nav close={handleShow} />
		</div>


	)
}

export default Home;