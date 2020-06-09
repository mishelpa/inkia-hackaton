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
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));


const Facturacion = (props) => {

  const [user, setUser] = useState(null);
  const [dataFactura, setDataFactura] = useState([]);
  const [factura, setFactura] = useState({});
  const [modoEdition, setModoEdition] = useState(false);
  const [id, setId] = useState('');
  const { register, handleSubmit, errors } = useForm();
  const classes = useStyles();
  const classes2 = useStyles2();

  useEffect(() => {
    firebase.firestore()
      .collection('factura')
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
    Functions.updateData('factura', id, data);
    setModoEdition(false)
    setId('');
    setFactura('');
    e.target.reset();
  }

  return (
    <div className="container">
      <h1 className="text-center">Facturación</h1>
      {user && <p>{user.email}</p>}
      <div className={classes2.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>{modoEdition ? 'Editar Factura' : 'Agregar Factura'}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <form autocomplete="off" onSubmit={modoEdition ? handleSubmit(onSubmit2) : handleSubmit(onSubmit)}>
                <label>Nombre del Proveedor <span className="text-danger">*</span></label>
                <input type="text" name="numFactura" className="form-control my-2" id="numFactura" value={factura.numFactura}
                  onChange={handleInputChange}
                  ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.numFactura && errors.numFactura.message}
                </span>
                <label>RUC <span className="text-danger">*</span></label>
                <input type="text" name="ruc" className="form-control my-2" id="ruc" value={factura.ruc}
                  onChange={handleInputChange}
                  ref={register({
                    required: { value: true, message: 'Campo Obligatorio' },
                    validate: value => value.length === 11 || 'Debe tener 11 caracteres',
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
                    required: { value: true, message: 'Campo Obligatorio' }
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
                    required: { value: true, message: 'Campo Obligatorio' }
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
                <TableCell align="right">Nombre del Proveedor</TableCell>
                <TableCell align="right">Monto</TableCell>
                <TableCell align="right">RUC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataFactura.map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.razonSocial}
                  </TableCell>
                  <TableCell align="right">{item.numFactura}</TableCell>
                  <TableCell align="right">{item.amount}</TableCell>
                  <TableCell align="right">{item.ruc}</TableCell>
                  <TableCell align="right">
                  <button
                          onClick={() => Functions.deleteData('factura', item.id)}
                          className="btn btn-danger btn-sm float-right"
                        >
                      Eliminar
                </button>
                  </TableCell>
                  <TableCell align="right">
                    <button
                      onClick={() => changeEdit(item)}
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

export default Facturacion