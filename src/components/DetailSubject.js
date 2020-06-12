import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import firebase from '../services/firebase';

const DetailsSubject = () => {

    const {id} = useParams();

    const [subject, setSubject] = useState({})
    const [budget, setBudget] = useState([])

    useEffect(()=> {
        firebase.firestore()
        .collection('subject').doc(id).get()
        .then(item => {
            setSubject(item.data())}) 
    }, [])

    useEffect(()=> {
        firebase.firestore().collection('subject').doc(id).collection('budgets')
        .onSnapshot((querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
            });
            setBudget(data)
        });
    }, [])



    console.log(budget);


    return (
        <div>
            <h2> {subject.subject}</h2>
            <p>{subject.responsibleSubject}</p>
            <div> Presupuestos </div>
            {budget.map((item) => (
                <div key={item.id}>
                    <p>{item.provider}</p>
                    <span> {item.total} {item.currency}</span>
                </div>
            ))}
        </div>

    )
}

export default DetailsSubject