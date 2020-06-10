import React, {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Functions } from '../services/Functions';
import { useForm } from "react-hook-form";
import firebase from '../services/firebase';
import '../css/AddSubject.css';

const  AddBillBudget = (props) => {

  const [company, setCompany] = useState([]);
  const [subject, setSubject] = useState({});
  const { register, handleSubmit, errors } = useForm();


  const onSubmit = (data, e) => {
    e.preventDefault();
    const allData = {...props.budget, ...data,idBudget: props.idBudget}
    Functions.createData('factura', allData)
    console.log(allData);
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
          Crear una Factura
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form onSubmit={handleSubmit(onSubmit)}>
                <label>Asunto</label>
                <input type="text" name="subject" className="form-control my-2" id="subject" disabled value={props.budget.subject}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.subject && errors.subject.message}
                </span>
                <label>Responsable <span className="text-danger">*</span></label>
                <input type="text" name="responsible" className="form-control my-2" id="responsible" value={props.factura.numFactura}
                  onChange={handleInputChange}
                  ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.responsible && errors.responsible.message}
                </span>
                <label>Empresa <span className="text-danger">*</span></label>
                <input type="text" name="company" className="form-control my-2" id="company" value={props.factura.company}
                  onChange={handleInputChange}
                  ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.company && errors.company.message}
                </span>
                <label>Proveedor <span className="text-danger">*</span></label>
                <input type="text" name="provider" className="form-control my-2" id="provider" value={props.factura.provider}
                  onChange={handleInputChange}
                  ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.provider && errors.provider.message}
                </span>
                <label>Tipo de proveedor <span className="text-danger">*</span></label>
                <input type="text" name="type_provider" className="form-control my-2" id="type_provider" value={props.factura.type_provider}
                  onChange={handleInputChange}
                  ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.type_provider && errors.type_provider.message}
                </span>
                <label>Monto <span className="text-danger">*</span></label>
                <input type="number" name="amountBill" className="form-control my-2" id="amountBill" value={props.factura.amountBill}
                  onChange={handleInputChange}
                  ref={register({
                    required: { value: true, message: 'Campo Obligatorio' }
                  }
                  )}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.amount && errors.amount.message}
                </span>
                <label>Tipo de cobro <span className="text-danger">*</span></label>
                <input type="text" name="form_cobro" className="form-control my-2" id="form_cobro" disabled value={props.budget.form_cobro}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.type_charge && errors.type_charge.message}
                </span>
                <label>Concepto<span className="text-danger">*</span></label>
                <input type="text" name="concept" className="form-control my-2" id="concept" value={props.factura.concept}
                  onChange={handleInputChange}
                  ref={register({
                    required: { value: true, message: 'Campo Obligatorio' }
                  }
                  )}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.concept && errors.concept.message}
                </span>
                <button>
                  AGREGAR
                </button>
              </form>
      </Modal.Body>
    </Modal>
  );
}

export default AddBillBudget