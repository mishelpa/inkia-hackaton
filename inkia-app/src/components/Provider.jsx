import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Functions } from '../services/Functions';
import firebase from '../services/firebase';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: '50%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));


const Provider = (props) => {

    const [user, setUser] = useState(null);
    const [dataProvider, setDataProvider] = useState([]);
    const [provider, setProvider] = useState({});
    const [modoEdition, setModoEdition] = useState(false);
    const [id, setId] = useState('');
    const { register, handleSubmit, errors } = useForm();
    const classes = useStyles();
    const classes2 = useStyles2();
    

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
      Functions.createData('provider', data);
      firebase.auth().createUserWithEmailAndPassword(data.emailProvider, '123456')
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
        <h1 className="text-center">Listado de Proveedores</h1>
        {user && <p>Bienvenido {user.email}</p>}
        <div className={classes2.root}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>{modoEdition ? 'Editar Proveedor' : 'Agregar Proveedor'}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
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
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      
                
            <div class="container">
        <TableContainer component={Paper}>     
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Razon Social</TableCell>
            <TableCell align="right">Tipo</TableCell>
            <TableCell align="right">País</TableCell>
            <TableCell align="right">Correo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataProvider.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.socialProvider}
              </TableCell>
              <TableCell align="right">{row.typeProvider}</TableCell>
              <TableCell align="right">{row.countryProvider}</TableCell>
              <TableCell align="right">{row.emailProvider}</TableCell>
              <TableCell align="right">
                <button 
                      onClick={() => Functions.deleteData('provider', row.id)}
                      className="btn btn-danger btn-sm float-right"
                  >
                      Eliminar
                </button>
              </TableCell>
              <TableCell align="right">
                <button 
                      onClick={() => changeEdit(row)}
                      className="btn btn-warning btn-sm float-right mr-2"
                  >
                      Editar
                </button>
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
        </div>
    )
} 

export default Provider