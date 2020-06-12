import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Functions } from '../services/Functions';
import firebase from '../services/firebase';

const Companies = (props) => {

    const [user, setUser] = useState(null);
    const [dataCompanies, setDataCompanies] = useState([]);
    const [companies, setCompanies] = useState({});
    const [modoEdition, setModoEdition] = useState(false);
    const [id, setId] = useState('');
    const { register, handleSubmit, errors } = useForm();

    useEffect(()=> {
      firebase.firestore()
        .collection('companies')
        .onSnapshot(onSnapshot => {
          const newObj= onSnapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
          setDataCompanies(newObj)
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
      Functions.createData('companies', data)
      e.target.reset();
    }

    const changeEdit = (item) => {
      setModoEdition(true)
      setId(item.id)
      setCompanies(item)
    }

    const handleInputChange = (e) => {
    setCompanies(e.target.value)
  }

    const onSubmit2 = (data, e) => {
      e.preventDefault();
      Functions.updateData('companies',id, data);
      setModoEdition(false)
      setId('');
      setCompanies('');
      e.target.reset();
    }

    return (
      <div>
        <h1>Compañias</h1>
        {user && <p>{user.email}</p>}
        <h3>{modoEdition ? 'Editar Compañia' : 'Agregar Compañia'}</h3>
        <form onSubmit={modoEdition ? handleSubmit(onSubmit2) : handleSubmit(onSubmit)}>
          <label>Nombre de Compañia <span className="text-danger">*</span></label>
          <input type="text" name="nameCompany" className="form-control my-2" id="nameCompany" value={companies.nameCompany}
            onChange={handleInputChange}
            ref={register({
              required: {value: true, message: 'Campo Obligatorio'}
            })}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.nameCompany && errors.nameCompany.message}
          </span>
          <label>País<span className="text-danger">*</span></label>
          <input type="text" name="country" className="form-control my-2" id="country" value={companies.country}
            onChange={handleInputChange}
            ref={register({
              required: {value: true, message: 'Campo Obligatorio'}
            })}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.country && errors.country.message}
          </span>
          <label>Responsable<span className="text-danger">*</span></label>
          <input type="text" name="leader" className="form-control my-2" id="leader" value={companies.leader}
            onChange={handleInputChange}
            ref={register({
              required: {value: true, message: 'Campo Obligatorio'}
              }
            )}
          />
          <span className="text-danger text-small d-block mb-2">
            {errors.leader && errors.leader.message}
          </span>
          <button 
            className={modoEdition ? "btn btn-warning" : "btn btn-primary"}>
              {modoEdition ? "Editar" : "Agregar"}
          </button>
      </form>
      <div className="container mb-2">
    <div className="row">
        <div className="col-md-6">
            <h3>Listado de Empresas</h3>
            <ul className="list-group">
            {
                dataCompanies.map(item => (
                <li className="list-group-item" key={item.id}>
                  <span>{item.name}</span>
                    <button 
                        onClick={() => Functions.deleteData('companies', item.id)}
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

export default Companies