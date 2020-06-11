import React, {useEffect} from 'react';
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
import '../css/Concept.css';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Concept=(props) => {

  const [concepto, setConcepto] = React.useState([]);
  const classes = useStyles();

  useEffect(()=> {
    firebase.firestore().collection('concepto').where('idFactura', '==', props.idFactura)
    .onSnapshot((querySnapshot) => {
      const data = [];
      let suma = 0;
      querySnapshot.forEach((doc) => {     
        data.push({ id: doc.id, ...doc.data() });
      });
      setConcepto(data);
    });
  }, [])

  const changeAprobado = () => {
    Functions.updateData('factura', props.idFactura, {status: 'aprobada'})
  }

  
  return concepto.length > 0 && (
    <div>
          <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>CONCEPTO</TableCell>
            <TableCell align="center">TIPO DE COBRO</TableCell>
            <TableCell align="center">FORMA DE PAGO</TableCell>
            <TableCell align="center">MONTO</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {concepto.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.concept}
              </TableCell>
              <TableCell align="center">{row.form_cobro}</TableCell>
              <TableCell align="center">{row.form_payment}</TableCell>
              <TableCell align="center">{row.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div className="d-flex justify-content-end mb-2 mt-1 btnState">
      {props.statusFactura==='aprobada' ? (
        <button className="btnAprobada">Aprobacion GC</button>
      ): (
        <button onClick={()=> changeAprobado()} className="btnUnit">Conforme</button>
      )}
        <button className="btnUnit">Rechazar</button>
    </div>
    </div>

  )
}

export default Concept