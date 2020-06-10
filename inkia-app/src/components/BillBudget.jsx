import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Functions } from '../services/Functions';
import firebase from '../services/firebase';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import AddBillBudget from './AddBillBudget';

const BillBudget = (props) => {

  const [user, setUser] = useState(null);
  const [dataFactura, setDataFactura] = useState([]);
  const [factura, setFactura] = useState({});
  const [id, setId] = useState('');
  const [modalShow, setModalShow] = React.useState(false);

const header =  [
  { title: 'CONCEPTO', field: 'concept' },
  { title: 'TIPO DE COBRO', field: 'form_cobro' },
  { title: 'FORMA DE PAGO', field: 'form_payment' },
  { title: 'MONTO', field: 'amountBill' }
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

 
  const handleClick = (id) => {
    props.history.push(`subject/${id}`);
    console.log('ya');
  }

  return (

    <div className="container">
      <div>
      <div className="divButton">
          <button className="mt-4 button pull-right" onClick={() => setModalShow(true)}>
          Crear Factura
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
      <div className="container">
        <MaterialTable
        title=""
        columns={header}
        data={dataFactura}
        onRowClick={((evt, selectedRow) => handleClick(selectedRow.id))}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                Functions.updateData('factura', oldData.id, newData);
              }, 300);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                Functions.deleteData('factura', oldData.id)
              }, 300);
            }),
          }}
          options={{
            actionsColumnIndex: -1
          }}
        />
      </div>
    </div>
  )
}
export default BillBudget;