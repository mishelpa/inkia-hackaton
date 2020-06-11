import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Functions } from '../services/Functions';
import firebase from '../services/firebase';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import AddBillBudget from './AddBillBudget';
import Example from './example';
import Concept from './Concept';
import '../css/BillBudget.css';
const BillBudget = (props) => {

  const [user, setUser] = useState(null);
  const [dataFactura, setDataFactura] = useState([]);
  const [factura, setFactura] = useState({});
  const [id, setId] = useState('');
  const [modalShow, setModalShow] = React.useState(false);

const header =  [
  { title: 'N° DE FACTURA', field: 'numFactura' },
  { title: 'FECHA', field: 'dateFactura' }
]

  useEffect(() => {
    firebase.firestore()
      .collection('factura').where('idBudget', '==', props.idBudget)
      .onSnapshot(onSnapshot => {
        const newObj = onSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }))
        setDataFactura(newObj)
      })
  }, [])

  useEffect(() => {
    if (firebase.auth().currentUser) {
      setUser(firebase.auth().currentUser)
    }
    else {
      props.history.push('/login')
    }
  }, [props.history])

 
  return (

    <div className="container">
      <div>
      <div className="divButton d-flexjustify-content-end">
          <button className="mt-4 button pull-right btnMain" onClick={() => setModalShow(true)}>
            Agregar Facturas
          </button>
        </div>
        <AddBillBudget
          show={modalShow}
          budget = {props.budget}
          idBudget= {props.idBudget}
          factura = {factura}
          onHide={() => setModalShow(false)}
        />
      </div>

    {dataFactura.map((ele) => (     
      <div key={ele.id}>
        <h3> N° de Factura:{ele.numFactura}</h3>
        <Example factura={ele}/>
        <Concept idFactura={ele.id}/>
      </div>
    ))}
    </div>

  )
}
export default BillBudget;