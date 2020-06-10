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
import MaterialTable from 'material-table';

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

  const header =  [
    { title: 'Asunto', field: 'subject' },
    { title: 'Responsable', field: 'corporative' },
    { title: 'Empresa', field: 'company' },
    { title: 'Proveedor', field: 'provider' },
    { title: 'Tipo de proveedor', field: 'type_provide' },
    { title: 'Monto Total Aprox', field: 'amount' },
    { title: 'Tipo de cobro', field: 'type_charge' },
    { title: 'Concepto', field: 'concept' },

  ]
  const handleClick = (id) => {
    props.history.push(`facturacion/${id}`);
}
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



    <div className="container">
    <div className="container">
      <MaterialTable
      title=""
      columns={header}
      data={dataFactura}
      onRowClick={((evt, selectedRow) => handleClick(selectedRow.id))}
      editable={{
        onRowAdd: (newData) =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          Functions.createData('factura', newData)
        }, 300);
      }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              Functions.updateData('subject', oldData.id, newData);
            }, 300);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              Functions.deleteData('subject', oldData.id)
            }, 300);
          }),
        }}
        options={{
          actionsColumnIndex: -1
        }}
      />
    </div>
  </div>
  )
}


export default Facturacion;