import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Nav from '../components/Nav';

import firebase from '../services/firebase';

const Home = (props) => {

	const signOut = () => {
		firebase.auth().signOut().then(() => {
			props.history.push('/')
		}).catch((error) => {
			console.log(error);
		})
	}

	return (
		<div>

		<Modal.Dialog>
			<Modal.Header closeButton>
				<Modal.Title>Modal title</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<p>Modal body text goes here.</p>
			</Modal.Body>

			<Modal.Footer>
				<Button onClick={signOut}
					variant="secondary">Close</Button>
				<Button variant="primary">Save changes</Button>
			</Modal.Footer>
		</Modal.Dialog>
		<Nav />
		</div>

	)
}

export default Home;