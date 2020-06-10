import React, { useState, useEffect } from 'react';
import firebase from '../services/firebase';
import MaterialTable from 'material-table';
import { Link } from "react-router-dom";
import AddSubject from './AddSubject';
import '../css/Subject.css';
import { Functions } from '../services/Functions';

const Subject = (props) => {

  const [user, setUser] = useState(null);
  const [dataSubject, setDataSubject] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  
  const header =  [
      { title: 'ASUNTO', field: 'nameSubject' },
      { title: 'EMPRESA QUE VA A FACTURAR', field: 'billSubject' },
      { title: 'RESPONSABLE DE INKIA', field: 'responsibleSubject' }
    ]

  const handleClick = (id) => {
      props.history.push(`subject/${id}`);
  }

  useEffect(()=> {
    firebase.firestore()
      .collection('subject')
      .onSnapshot(onSnapshot => {
        const newObj= onSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }))
        setDataSubject(newObj)
      })
  }, [])

  useEffect(()=> {
    if(firebase.auth().currentUser){
      setUser(firebase.auth().currentUser)
    }
    else {
      props.history.push('/login')
    }
  }, [props.history])

  return (
    <div className="container">
      <div className="container">
        <MaterialTable
        title=""
        columns={header}
        data={dataSubject}
        onRowClick={((evt, selectedRow) => handleClick(selectedRow.id))}
        editable={{
          onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            Functions.createData('subject', newData)
          }, 300);
        }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                Functions.updateData('subject', oldData.id, newData);
              }, 300);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                Functions.deleteData('subject', oldData.id)
              }, 300);
            }),
          }}
          options={{
            actionsColumnIndex: -1
          }}
        />
        <div className="divButton">
          <button className="mt-4 button pull-right" onClick={() => setModalShow(true)}>
          Crear un asunto
        </button>
        </div>
        <AddSubject
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
    </div>
  )
} 

export default Subject