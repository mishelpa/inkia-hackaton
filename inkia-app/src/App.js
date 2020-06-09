import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import { AuthProvider } from './components/Auth';
import PrivateRoute from './components/PrivateRoute';
import Budgets from './components/Bugets';

function App() {
	return (
		<AuthProvider>
			<HashRouter>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route exact path="/budgets" component={Budgets} />
					<PrivateRoute exact path="/home" component={Home} />
				</Switch>
			</HashRouter>
		</AuthProvider>
	)
}

export default App;
