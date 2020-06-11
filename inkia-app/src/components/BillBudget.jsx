import React, { useState, useEffect } from 'react';
import firebase from '../services/firebase';
import AddBillBudget from './AddBillBudget';
import Example from './example';
import Concept from './Concept';
import '../css/BillBudget.css';
import { Card } from '@material-ui/core';
const BillBudget = (props) => {

  const [user, setUser] = useState(null);
  const [dataFactura, setDataFactura] = useState([]);
  const [factura, setFactura] = useState({});
  const [id, setId] = useState('');
  const [modalShow, setModalShow] = React.useState(false);


  useEffect(() => {
    firebase.firestore()
      .collection('factura').where('idBudget', '==', props.idBudget)
      .onSnapshot(onSnapshot => {
        const newObj = onSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }))
        setDataFactura(newObj)
        console.log(props.idBudget);
        
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

  <div className="container-fluid">
    <div>
      <div className="divButton d-flex justify-content-end mb-4">
        <button className="mt-4button pull-right btnMain" onClick={() => setModalShow(true)}>
          Agregar Facturas
        </button>
      </div>
      <Card className="row mb-4 py-2 text-center ">
        <div className="col-4">
          <div>Monto Inicial</div>
            <div>{props.budget.total}</div>
        </div>
        <div className="col-4">
          <div>Monto Facturado</div>
          <div></div>
        </div>
        <div className="col-4">
          <div>Diferencia</div>
          <div></div>
        </div>
      </Card>
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
      <Card className="row py-2 d-flex justify-content-between mb-2 px-4 factura">
        <span>N° de factura: {ele.numFactura}</span>
        <span>Fecha: {ele.dateFactura}</span>
        <Example factura={ele}/>
      </Card>
      <Concept className="container-fluid" idFactura={ele.id}/>
    </div> 
    
  ))}
  </div>

  )
}
export default BillBudget;