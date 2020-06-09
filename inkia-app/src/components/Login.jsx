import React, { useState, useCallback, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import firebase from '../services/firebase';
import { withRouter, Redirect } from 'react-router-dom';
import { AuthContext } from './Auth';

const Login = ({ history }) => {
	const [email, setEmail] = useState('')
	const [pass, setPass] = useState('')

	const handleLogin = useCallback(
		async event => {
			event.preventDefault();
			try {
				await firebase
					.auth()
					.signInWithEmailAndPassword(email, pass);
				history.push("/");
			} catch (error) {
				alert(error);
			}
		},
		[email, pass, history]
	);

	const { currentUser } = useContext(AuthContext);

	if (currentUser) {
		return <Redirect to="/Home" />;
	}

	return (
		<Form onSubmit={handleLogin}>
			<Form.Group controlId="formBasicEmail">
				<Form.Label>Correo Electrónico</Form.Label>
				<Form.Control
					onChange={e => setEmail(e.target.value)}
					value={email}
					type="email" placeholder="Enter email" />
				<Form.Text className="text-muted">
					We'll never share your email with anyone else.
				</Form.Text>
			</Form.Group>
			<Form.Group controlId="formBasicPassword">
				<Form.Label>Contraseña</Form.Label>
				<Form.Control
					type="password"
					value={pass}
					onChange={e => setPass(e.target.value)}
					placeholder="Password" />
			</Form.Group>
			<Form.Group controlId="formBasicCheckbox">
				<Form.Check type="checkbox" label="Check me out" />
			</Form.Group>
			<Button variant="primary" type="submit">
				Ingresar
			</Button>
		</Form>
	);
};

export default withRouter(Login)
