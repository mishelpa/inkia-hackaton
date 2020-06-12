import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Functions } from '../services/Functions';
import { useForm } from "react-hook-form";
import firebase from '../services/firebase';
import '../css/AddBillBudget.css';

const AddBillBudget = (props) => {

  const [company, setCompany] = useState([]);
  const [subject, setSubject] = useState({});
  const { register, handleSubmit, errors } = useForm();
  const [file, setFile] = React.useState();


  //upload pdf
  const uploadImage = (file) => {
    const postImageRef = firebase.storage().ref().child(`images/${file.name}`);
    return postImageRef.put(file)
      .then(snapshot => snapshot.ref.getDownloadURL());
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    const allData = { ...props.budget, ...data, idBudget: props.idBudget, status: 'pendiente', substatus: 'Requiere revisión' }
    uploadImage(file[0]).then((url) => {
      allData['pdf'] = url;
      console.log(url);
      Functions.createData('factura', allData)
    })
    console.log(allData);
    e.target.reset();
  }

  const handleInputChange = (e) => {
    setSubject(e.target.value)
  }

  useEffect(() => {
    firebase.firestore()
      .collection('companies')
      .onSnapshot(onSnapshot => {
        const newObj = onSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }))
        setCompany(newObj)
      })
  }, [])

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Crear una Factura
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="formulario" onSubmit={handleSubmit(onSubmit)}>
          <label>N° Factura<span className="text-danger">*</span></label>
          <input type="text" name="numFactura" className="form-control my-2" id="numFactura" value={props.factura.numFactura}
            onChange={handleInputChange}
            ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.numFactura && errors.numFactura.message}
          </span>
          <label>Fecha<span className="text-danger">*</span></label>
          <input type="date" name="dateFactura" className="form-control my-2" id="dateFactura" value={props.factura.dateFactura}
            onChange={handleInputChange}
            ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
          />
          <input type="text" class="file-name" id="inputval" />
          <input type="file" class="hide" name="file" id="fileButton" onChange={(e) => setFile(e.target.files)} />

          <span className="text-danger text-small d-block mb-2">
            {errors.dateFactura && errors.dateFactura.message}
          </span>
          <button className="Main">
            AGREGAR
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default AddBillBudget