import React, { useState, useEffect } from 'react';
import firebase from '../services/firebase';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import AddSubject from './AddSubject';
import '../css/Subject.css';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const Subject = (props) => {

  const [user, setUser] = useState(null);
  const [dataSubject, setDataSubject] = useState([]);
  const [company, setCompany] = useState([]);
  const [subject, setSubject] = useState({});
  const [modoEdition, setModoEdition] = useState(false);
  const [id, setId] = useState('');
  const classes = useStyles();
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(()=> {
    firebase.firestore()
      .collection('subject')
      .onSnapshot(onSnapshot => {
        const newObj= onSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }))
        setDataSubject(newObj)
      })
  }, [])

  useEffect(()=> {
    firebase.firestore()
      .collection('companies')
      .onSnapshot(onSnapshot => {
        const newObj= onSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }))
        setCompany(newObj)
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

  return (
    <div className="container">
      <h3>Asunto</h3>
      <div className="container">
        <TableContainer component={Paper}>     
          <Table className={classes.table} aria-label="simple table">
            <TableHead className="title">
              <TableRow>
                <TableCell>SUJETO</TableCell>
                <TableCell align="right">EMPRESA QUE VA A FACTURAR</TableCell>
                <TableCell align="right">RESPONSABLE DE INKIA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataSubject.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <Link className="link" to={`/subject/${row.id}`}>{row.nameSubject}</Link>
                </TableCell>
                <TableCell align="right">{row.billSubject}</TableCell>
                <TableCell align="right">{row.responsibleSubject}</TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="divButton">
          <button className="mt-4 button pull-right" onClick={() => setModalShow(true)}>
          Crear un asunto
        </button>
        </div>
        <AddSubject
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
    </div>
  )
} 

export default Subject