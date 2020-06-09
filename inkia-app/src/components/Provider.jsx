import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Functions } from '../services/Functions';
import firebase from '../services/firebase';

const Provider = (props) => {

    const [user, setUser] = useState(null);
    const [dataProvider, setDataProvider] = useState([]);
    const [provider, setProvider] = useState({});
    const [modoEdition, setModoEdition] = useState(false);
    const [id, setId] = useState('');
    const { register, handleSubmit, errors } = useForm();

    useEffect(()=> {
      firebase.firestore()
        .collection('provider')
        .onSnapshot(onSnapshot => {
          const newObj= onSnapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
          setDataProvider(newObj)
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
      Functions.createData('provider', data)
      e.target.reset();
    }

    const changeEdit = (item) => {
      setModoEdition(true)
      setId(item.id)
      setProvider(item)
    }

    const handleInputChange = (e) => {
    setProvider(e.target.value)
    }

    const onSubmit2 = (data, e) => {
      e.preventDefault();
      Functions.updateData('provider',id, data);
      setModoEdition(false)
      setId('');
      setProvider('');
      e.target.reset();
    }

    return (
      <div className="container">
        <h1>Listado de Proveedores</h1>
        {user && <p>{user.email}</p>}
        <h3>{modoEdition ? 'Editar Proveedor' : 'Agregar Proveedor'}</h3>
        <form onSubmit={modoEdition ? handleSubmit(onSubmit2) : handleSubmit(onSubmit)}>
          <label>Razón Social <span className="text-danger">*</span></label>
          <input type="text" name="socialProvider" className="form-control my-2" id="socialProvider" value={provider.socialProvider}
            onChange={handleInputChange}
            ref={register({ required: {value: true, message: 'Campo Obligatorio'}})}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.socialProvider && errors.socialProvider.message}
          </span>
          <label>Tipo: <span className="text-danger">*</span></label>
          <input type="text" name="typeProvider" className="form-control my-2" id="ruc" value={provider.typeProvider}
            onChange={handleInputChange}
            ref={register({
              required: {value: true, message: 'Campo Obligatorio'}
            })}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.typeProvider && errors.typeProvider.message}
          </span>
          <label>País: <span className="text-danger">*</span></label>
          <input type="text" name="countryProvider" className="form-control my-2" id="countryProvider" value={provider.countryProvider}
            onChange={handleInputChange}
            ref={register({
              required: {value: true, message: 'Campo Obligatorio'}
              }
            )}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.countryProvider && errors.countryProvider.message}
          </span>
          <label>Correo Electrónico: <span className="text-danger">*</span></label>
          <input type="email" name="emailProvider" className="form-control my-2" id="emailProvider" value={provider.emailProvider}
            onChange={handleInputChange}
            ref={register({
              required: {value: true, message: 'Campo Obligatorio'}
              }
            )}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.emailProvider && errors.emailProvider.message}
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
              dataProvider.map(item => (
              <li className="list-group-item" key={item.id}>
                <span>{item.socialProvider}</span>
                  <button 
                      onClick={() => Functions.deleteData('provider', item.id)}
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

export default Provider