import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Functions } from '../services/Functions';
import firebase from '../services/firebase';

const Facturacion = (props) => {

    const [user, setUser] = useState(null);
    const [dataFactura, setDataFactura] = useState([]);
    const [factura, setFactura] = useState({});
    const [modoEdition, setModoEdition] = useState(false);
    const [id, setId] = useState('');
    const { register, handleSubmit, errors } = useForm();

    useEffect(()=> {
      firebase.firestore()
        .collection('factura')
        .onSnapshot(onSnapshot => {
          const newObj= onSnapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
          setDataFactura(newObj)
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

    const onSubmit = (data, e) => {
      e.preventDefault();
      Functions.createData('factura', data)
      e.target.reset();
    }

    const changeEdit = (item) => {
      setModoEdition(true)
      setId(item.id)
      setFactura(item)
    }

    const handleInputChange = (e) => {
    setFactura(e.target.value)
  }

    const onSubmit2 = (data, e) => {
      e.preventDefault();
      Functions.updateData('factura',id, data);
      setModoEdition(false)
      setId('');
      setFactura('');
      e.target.reset();
    }

    return (
      <div>
        <h1>Facturación</h1>
        {user && <p>{user.email}</p>}
        <h3>{modoEdition ? 'Editar Factura' : 'Agregar Factura'}</h3>
        <form onSubmit={modoEdition ? handleSubmit(onSubmit2) : handleSubmit(onSubmit)}>
          <label>Nombre del Proveedor <span className="text-danger">*</span></label>
          <input type="text" name="numFactura" className="form-control my-2" id="numFactura" value={factura.numFactura}
            onChange={handleInputChange}
            ref={register({ required: {value: true, message: 'Campo Obligatorio'}})}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.numFactura && errors.numFactura.message}
          </span>
          <label>RUC <span className="text-danger">*</span></label>
          <input type="text" name="ruc" className="form-control my-2" id="ruc" value={factura.ruc}
            onChange={handleInputChange}
            ref={register({
              required: {value: true, message: 'Campo Obligatorio'},
              validate: value => value.length === 11  || 'Debe tener 11 caracteres',
              pattern: {
                value: /^([0-9])*$/, 
                message: 'Debe contener solo números'
              }
            })}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.ruc && errors.ruc.message}
          </span>
          <label>Razon Social <span className="text-danger">*</span></label>
          <input type="text" name="razonSocial" className="form-control my-2" id="razonSocial" value={factura.razonSocial}
            onChange={handleInputChange}
            ref={register({
              required: {value: true, message: 'Campo Obligatorio'}
              }
            )}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.razonSocial && errors.razonSocial.message}
          </span>
          <label>Monto <span className="text-danger">*</span></label>
          <input type="number" name="amount" className="form-control my-2" id="amount" value={factura.amount}
            onChange={handleInputChange}
            ref={register({
              required: {value: true, message: 'Campo Obligatorio'}
              }
            )}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.razonSocial && errors.razonSocial.message}
          </span>
          <button 
            className={modoEdition ? "btn btn-warning" : "btn btn-primary"}>
              {modoEdition ? "Editar" : "Agregar"}
          </button>
      </form>
      <div className="container mb-2">
    <div className="row">
        <div className="col-md-6">
            <h3>Listado de Facturas</h3>
            <ul className="list-group">
            {
                dataFactura.map(item => (
                <li className="list-group-item" key={item.id}>
                  <span>{item.razonSocial}</span>
                    <button 
                        onClick={() => Functions.deleteData('factura', item.id)}
                        className="btn btn-danger btn-sm float-right"
                    >
                        Eliminar
                    </button>
                    <button 
                        onClick={() => changeEdit(item)}
                        className="btn btn-warning btn-sm float-right mr-2"
                    >
                        Editar
                    </button>
                </li>
                ))
            }
            </ul>
        </div>

        </div>
        </div>
        </div>
    )
} 

export default Facturacion