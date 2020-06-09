import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Companies from './components/Companies';
import { AuthProvider } from './components/Auth';
import PrivateRoute from './components/PrivateRoute';
import Facturacion from './components/Facturacion';
import Provider from './components/Provider';

import Budgets from './components/Budgets';


function App() {
	return (
		<AuthProvider>
			<HashRouter>
				<Switch>
					<Route exact path="/" component={Login} />
					<PrivateRoute exact path="/provider" component={Provider}/>
					<PrivateRoute exact path="/companies" component={Companies}/>
					<PrivateRoute exact path="/facturacion" component={Facturacion}/>
					{/* <Route exact path="/login" component={Login} /> */}
					<Route exact path="/budgets" component={Budgets} />
					<PrivateRoute exact path="/home" component={Home} />
				</Switch>
			</HashRouter>
		</AuthProvider>
	)
}

export default App;
