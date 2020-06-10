import React, {useState, useEffect} from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Companies from './components/Companies';
import { AuthProvider } from './components/Auth';
import PrivateRoute from './components/PrivateRoute';
import Facturacion from './components/Facturacion.jsx';
import Provider from './components/Provider';
import DetailsProvider from './components/DetailsProvider';
import DetailsBudgets from './components/DetailsBudgets';
import DetailsFacturacion from './components/DetailsFacturacion';

import firebase from './services/firebase';
import Budgets from './components/Budgets';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

function App() {
	const [usuario, setUsuario] = useState('')
	const [provider, setProvider] = useState([])
	firebase.auth().onAuthStateChanged((user)=> {
		setUsuario(user.email) ;	
	});
const theme = createMuiTheme({
	palette:{
		primary:{
       main: '#212121'
		},
		secondary:{
       main: '#ffc127'
		}
	}
})
	/*const getprovider = () => {
			let obj = [];
		firebase.firestore()
			.collection('provider')
			.get().then(info => {
				const findProvider = info.find(item => item.data().emailProvider === usuario)
				setProvider(findProvider)
				})
			}*/
	
	
	return (
		<ThemeProvider theme={theme}>
		<AuthProvider>
			<HashRouter>
				<Switch>
					<Route exact path="/" component={Login} />
					<PrivateRoute exact path="/provider/:id" component={DetailsProvider} />
					<PrivateRoute exact path="/provider" component={Provider}/>
					<PrivateRoute exact path="/companies" component={Companies}/>
					<PrivateRoute exact path="/facturacion" component={Facturacion}/>
					<PrivateRoute exact path="/facturacion/:id" component={Facturacion}/>

					<PrivateRoute exact path="/budgets" component={Budgets} />
					<PrivateRoute exact path="/budgets/:id" component={DetailsBudgets} />
					<PrivateRoute exact path="/home" component={Home} />
				</Switch>
			</HashRouter>
		</AuthProvider>
		</ThemeProvider>
	)
}

export default App;
