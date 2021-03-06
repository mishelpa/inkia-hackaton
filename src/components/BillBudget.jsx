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


        if (onSnapshot.docs.length > 0) {
          const newArr = onSnapshot.docs.map((item) => parseInt(item.data().total)).reduce((a, b) => a + b)
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
            <div ><span className="bold">Monto Inicial</span></div>
            <div style={{fontSize: '20px'}}>{props.totalbudget}</div>
          </div>
          <div className="col-4">
            <div><span className="bold">Monto Facturado</span></div>
            <div style={{fontSize: '20px'}}>{sumConcepto}</div>
          </div>
          <div className="col-4">
            <div><span className="bold">Diferencia</span></div>
            <div className={(props.totalbudget - sumConcepto) < 0 ? 'text-danger font-weight-bold fontBill' : 'text-success font-weight-bold fontBill'}>{props.totalbudget - sumConcepto}</div>
          </div>
        </Card>
        <AddBillBudget
          show={modalShow}
          budget={props.budget}
          idBudget={props.idBudget}
          factura={factura}
          onHide={() => setModalShow(false)}
        />
      </div>

      {dataFactura.map((ele) => (
        <div key={ele.id} style={{marginBottom: '3%'}}>
          <Card className="row py-2 d-flex justify-content-between align-items-center mb-1 px-4 factura">
            <span className="width"><span className="bold">N° de factura:</span> {ele.numFactura}</span>
            <span className="width"><span className="bold">Fecha: </span>{ele.dateFactura}</span>
            <span className="width"><span className="bold">PDF:</span> <img style={{cursor: 'pointer'}} src="https://img.icons8.com/fluent/48/000000/pdf.png" alt="pdf" onClick={() => window.open(ele.pdf)} /></span>

            {/* <span>PDF: {ele.pdf}</span> */}
            <Example factura={ele} />
          </Card>
          <Concept className="container-fluid" idFactura={ele.id} statusFactura={ele.status} substatus= {ele.substatus} idBudget={props.idBudget} />
        </div>

      ))}
    </div>
  )
}
export default BillBudget;