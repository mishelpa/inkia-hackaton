import React, { useState, useCallback, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import firebase from '../services/firebase';
import { withRouter, Redirect } from 'react-router-dom';
import { AuthContext } from './Auth';
import '../css/Login.css';
import Logo from '../img/Logo.svg'

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
		<div className="Form-Login">


			<Form className="form-style" onSubmit={handleLogin}>
				<img className="Logo" src={Logo} alt="Logo" />
				<Form.Group controlId="formBasicEmail">
					<div className="email">

						<Form.Control
							className="input-style email-form"
							onChange={e => setEmail(e.target.value)}
							value={email}
							type="email" placeholder="Usuario" />
					</div>
				</Form.Group>
				<Form.Group controlId="formBasicPassword">
					<div className="password">

						<Form.Control
							className="input-style password"
							type="password"
							value={pass}
							onChange={e => setPass(e.target.value)}
							placeholder="Contraseña" />
					</div>
				</Form.Group>
				<div>

					<button className="Button-enter" type="submit">
						<p className="Text-Enter"> Login </p>
					</button>
				</div>
			</Form>
		</div>
	);
};

export default withRouter(Login)
