import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Companies from './components/Companies';
import { AuthProvider } from './components/Auth';
import PrivateRoute from './components/PrivateRoute';
import Facturacion from './components/Facturacion';
import TableProvider from './components/TableProvider';


function App() {
	return (
		<AuthProvider>
			<HashRouter>
				<Switch>
					<Route exact path="/" component={Login} />
					<PrivateRoute exact path="/provider" component={TableProvider}/>
					<PrivateRoute exact path="/companies" component={Companies}/>
					<PrivateRoute exact path="/facturacion" component={Facturacion}/>
					{/* <Route exact path="/login" component={Login} /> */}
					<PrivateRoute exact path="/home" component={Home} />
				</Switch>
			</HashRouter>
		</AuthProvider>
	)
}

export default App;
