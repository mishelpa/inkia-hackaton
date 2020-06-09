import React, {useState, useEffect} from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Companies from './components/Companies';
import { AuthProvider } from './components/Auth';
import PrivateRoute from './components/PrivateRoute';
import Facturacion from './components/Facturacion';
import Provider from './components/Provider';
import firebase from './services/firebase';
import Budgets from './components/Budgets';


function App() {
	const [usuario, setUsuario] = useState('')
	const [provider, setProvider] = useState([])
	firebase.auth().onAuthStateChanged((user)=> {
		setUsuario(user.email) ;	
	});

	const getprovider = () => {
			let obj = [];
		firebase.firestore()
			.collection('provider')
			.get().then(info => {
				info.forEach(item => {
					obj.push(item.data().emailProvider)
				})
			})
			setProvider(obj)
	}

	
	return (
		<AuthProvider>
			<HashRouter>
				<Switch>
					<Route exact path="/" component={Login} />
					<PrivateRoute exact path="/provider" component={Provider}/>
					<PrivateRoute exact path="/companies" component={Companies}/>
					<PrivateRoute exact path="/facturacion" component={Facturacion}/>
					<Route exact path="/budgets" component={Budgets} />
					<PrivateRoute exact path="/home" component={Home} />
				</Switch>
			</HashRouter>
		</AuthProvider>
	)
}

export default App;
