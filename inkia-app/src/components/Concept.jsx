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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Concept=(props) => {

  const [concepto, setConcepto] = React.useState([]);
  const classes = useStyles();

  useEffect(()=> {
    firebase.firestore().collection('factura').doc(props.idFactura).collection('concepto')
    .onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setConcepto(data);
    });
  }, [])

  return(
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>CONCEPTO</TableCell>
            <TableCell align="right">TIPO DE COBRO</TableCell>
            <TableCell align="right">FORMA DE PAGO</TableCell>
            <TableCell align="right">MONTO</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {concepto.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.concept}
              </TableCell>
              <TableCell align="right">{row.form_cobro}</TableCell>
              <TableCell align="right">{row.form_payment}</TableCell>
              <TableCell align="right">{row.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Concept