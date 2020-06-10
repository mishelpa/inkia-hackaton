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
import { useCollectionData } from 'react-firebase-hooks/firestore';

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
      .collection('budgets')
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
  const [value, loading] = useCollectionData(
    firebase.firestore().collection('budgets'),
  );
  const [ready, setReady] = useState([]);
  const showOrdersReady = () => {
    const filterData = value.filter((ele) => ele.estado === 'pendiente de aprobacion');
    const dataOrder = filterData.map((element) => {
      const obj = {
        ID: element.ID,
/*         cliente: element.newobj.cliente,
 */        provider: element.provider,
      };
      return obj;
    });
    setReady(dataOrder);
  };
  return (



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
  )
}


export default Facturacion;