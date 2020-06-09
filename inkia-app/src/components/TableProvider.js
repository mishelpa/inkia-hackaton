import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import firebase from '../services/firebase';
import { Functions } from '../services/Functions';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


export default function SimpleTable() {

  const [dataFactura, setDataFactura] = useState([]);

  useEffect(()=> {
    firebase.firestore()
      .collection('provider')
      .onSnapshot(onSnapshot => {
        const newObj= onSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }))
        setDataFactura(newObj)
      })
  }, [dataFactura])

  const classes = useStyles();

  return (
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
          {dataFactura.map((row) => (
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
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}