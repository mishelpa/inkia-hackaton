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
  const [sumConcepto, setSumConcepto] = React.useState(0);


  useEffect(() => {
    firebase.firestore()
      .collection('concepto').where('idBudget', '==', props.idBudget)
      .onSnapshot(onSnapshot => {

        
        if (onSnapshot.docs.length>0){
          const newArr = onSnapshot.docs.map((item) => parseInt(item.data().total)).reduce((a,b) => a+b)
          setSumConcepto(newArr);
        }
        console.log(sumConcepto);
        
      })
  }, [])

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
            <div>{props.totalbudget}</div>
        </div>
        <div className="col-4">
          <div>Monto Facturado</div>
            <div>{sumConcepto}</div>
        </div>
        <div className="col-4">
          <div>Diferencia</div>
          <div className={(props.totalbudget - sumConcepto)<0 ? 'text-danger font-weight-bold' : 'text-success font-weight-bold'}>{props.totalbudget - sumConcepto}</div>
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
        <img src="https://img.icons8.com/fluent/48/000000/pdf.png" alt="pdf" onClick={()=> window.open(ele.pdf)}/>
        
        {/* <span>PDF: {ele.pdf}</span> */}
        <Example factura={ele}/>
      </Card>
      <Concept className="container-fluid" idFactura={ele.id} substatus= {ele.substatus} statusFactura={ele.status} idBudget={props.idBudget}/>
    </div> 
    
  ))}
  </div>

  )
}
export default BillBudget;