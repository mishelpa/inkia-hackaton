import React, {useState, useEffect} from 'react';
import firebase from '../services/firebase';
import MaterialTable from 'material-table';
import { Functions } from '../services/Functions';

export default function MaterialTableDemo() {
 
  const [dataSubject, setDataSubject] = useState([]);
  
  const header =  [
      { title: 'ASUNTO', field: 'nameSubject' },
      { title: 'EMPRESA QUE VA A FACTURAR', field: 'billSubject' },
      { title: 'RESPONSABLE DE INKIA', field: 'responsibleSubject' }
    ]

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

  return (
    <MaterialTable
      title="Asuntos"
      columns={header}
      data={dataSubject}
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
    />
  );
}