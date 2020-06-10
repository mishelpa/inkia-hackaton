import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import firebase from '../services/firebase';
import MaterialTable from 'material-table'

const DetailsBudgets = () => {
	const { id } = useParams();
	console.log(id)
	const [budget, setBudget] = useState([])

	
	
	useEffect(() => {
		// firebase.firestore()
		// 	.collection('budgets').doc(id).get()
		// 	.then(doc => {
		// 		setBudget(doc.data())
		// 	});

		firebase.firestore().collection('budgets').onSnapshot((querySnapshot) => {
			const array = [];
			querySnapshot.forEach((doc) => {
				array.push({ id: doc.id, ...doc.data() });
			});
			setBudget(array);
		})
	}, [])


		return (
		<div style={{ maxWidth: '100%' }}>
			<MaterialTable
				columns={[
					{ title: 'Adı', field: 'provider' },
					{ title: 'Soyadı', field: 'concept' },
					{ title: 'Doğum Yılı', field: 'subject'},
					{ title: 'Doğum Yeri', field: 'company'}
				]}
				data={budget}
				title="Demo Title"
			/>
		</div>
	)
	


}

export default DetailsBudgets;