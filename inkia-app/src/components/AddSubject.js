import React, {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Functions } from '../services/Functions';
import { useForm } from "react-hook-form";
import firebase from '../services/firebase';
import '../css/AddSubject.css';

const  AddSubject = (props) => {

  const [company, setCompany] = useState([]);
  const [subject, setSubject] = useState({});
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data, e) => {
    e.preventDefault();
    Functions.createData('subject', data);
    e.target.reset();
  }

  const handleInputChange = (e) => {
    setSubject(e.target.value)
  }

  useEffect(()=> {
    firebase.firestore()
      .collection('companies')
      .onSnapshot(onSnapshot => {
        const newObj= onSnapshot.docs.map((item) => ({
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
          Crear un asunto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Asunto: <span className="text-danger">*</span></label>
          <input type="text" name="nameSubject" className="form-control my-2" id="nameSubject" value={subject.nameSubject}
            onChange={handleInputChange}
            ref={register({ required: {value: true, message: 'Campo Obligatorio'}})}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.nameSubject && errors.nameSubject.message}
          </span>
          <label>Empresa que va a facturar: <span className="text-danger">*</span></label>
          <select name="billSubject" ref={register} onChange={handleInputChange}>
            {company.map((element) => (
              <option key={element.id} value={element.name}>{element.name}</option>
            ))}
          </select>
          <span className="text-danger text-small d-block mb-2">
            {errors.billSubject && errors.billSubject.message}
          </span>
          <label>Responsable de Inkia: <span className="text-danger">*</span></label>
          <input type="text" name="responsibleSubject" className="form-control my-2" id="responsibleSubject" value={subject.responsibleSubject}
            onChange={handleInputChange}
            ref={register({
              required: {value: true, message: 'Campo Obligatorio'}
              }
            )}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.responsibleSubject && errors.responsibleSubject.message}
          </span>
          <br/>
          <button className="btn btn-light d-block">
              Agregar
          </button>
          <Button onClick={props.onHide}>Close</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default AddSubject