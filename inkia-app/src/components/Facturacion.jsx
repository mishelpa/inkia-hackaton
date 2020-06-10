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
import { Link } from "react-router-dom";

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
                <label>Asunto <span className="text-danger">*</span></label>
                <input type="text" name="subject" className="form-control my-2" id="subject" value={factura.subject}
                  onChange={handleInputChange}
                  ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.subject && errors.subject.message}
                </span>
                <label>Responsable <span className="text-danger">*</span></label>
                <input type="text" name="responsible" className="form-control my-2" id="responsible" value={factura.numFactura}
                  onChange={handleInputChange}
                  ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.responsible && errors.responsible.message}
                </span>
                <label>Empresa <span className="text-danger">*</span></label>
                <input type="text" name="company" className="form-control my-2" id="company" value={factura.company}
                  onChange={handleInputChange}
                  ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.company && errors.company.message}
                </span>
                <label>Proveedor <span className="text-danger">*</span></label>
                <input type="text" name="provider" className="form-control my-2" id="provider" value={factura.provider}
                  onChange={handleInputChange}
                  ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.provider && errors.provider.message}
                </span>
                <label>Tipo de proveedor <span className="text-danger">*</span></label>
                <input type="text" name="type_provider" className="form-control my-2" id="type_provider" value={factura.type_provider}
                  onChange={handleInputChange}
                  ref={register({ required: { value: true, message: 'Campo Obligatorio' } })}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.type_provider && errors.type_provider.message}
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
                  {errors.amount && errors.amount.message}
                </span>
                <label>Tipo de cobro <span className="text-danger">*</span></label>
                <input type="text" name="type_charge" className="form-control my-2" id="type_charge" value={factura.type_charge}
                  onChange={handleInputChange}
                  ref={register({
                    required: { value: true, message: 'Campo Obligatorio' }
                  }
                  )}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.type_charge && errors.type_charge.message}
                </span>
                <label>Concepto<span className="text-danger">*</span></label>
                <input type="text" name="concept" className="form-control my-2" id="concept" value={factura.concept}
                  onChange={handleInputChange}
                  ref={register({
                    required: { value: true, message: 'Campo Obligatorio' }
                  }
                  )}
                />
                <span className="text-danger text-small d-block mb-2">
                  {errors.concept && errors.concept.message}
                </span>
                {/*  <label>RUC <span className="text-danger">*</span></label>
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
              </span>      */}
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
                <TableCell align="right">Asunto</TableCell>
                <TableCell align="right">Responsable</TableCell>
                <TableCell align="right">Empresa</TableCell>
                <TableCell align="right">Proveedor</TableCell>
                <TableCell align="right">Tipo de proveedor</TableCell>
                <TableCell align="right">Monto total aprox</TableCell>
                <TableCell align="right">Tipo de cobro</TableCell>
                <TableCell align="right">Concepto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataFactura.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align="right">{item.subject}</TableCell>
{/*                   <TableCell align="right">{item.responsible}</TableCell>
 */}                  <Link to={`/facturacion/${item.id}`}>{item.responsible}</Link>
                  <TableCell align="right">{item.company}</TableCell>
                  <TableCell align="right">{item.provider}</TableCell>
                  <TableCell align="right">{item.type_provider}</TableCell>
                  <TableCell align="right">{item.amount}</TableCell>
                  <TableCell align="right">{item.type_charge}</TableCell>
                  <TableCell align="right">{item.concept}</TableCell>
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


export default Facturacion;