import React, { useState, useEffect } from 'react';
import firebase from '../services/firebase';
import MaterialTable from 'material-table';
import { Link } from "react-router-dom";
import AddSubject from './AddSubject';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import MailIcon from '@material-ui/icons/Mail';
import '../css/Subject.css';
import { Functions } from '../services/Functions';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Logo from '../img/Logo.svg'
 import '../css/Nav.css';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginTop: -10,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
      background: '#A20067',
      
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
      background: '#A20067',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    background: 'linear-gradient(45deg, #A20067 100%, #A20067 100%)',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),    
 },
  backGround: {
    width: '100%',
    background: '#A20067',
    height: 579,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  texto:{
    color: '#FFFFFF',
  }
}));
const Subject = (props) => {

  const [user, setUser] = useState(null);
  const { window } = props;
  const [dataSubject, setDataSubject] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const classes = useStyles();
  const theme = useTheme();


  const header =  [
      { title: 'ASUNTO', field: 'nameSubject' },
      { title: 'EMPRESA QUE VA A FACTURAR', field: 'billSubject' },
      { title: 'RESPONSABLE DE INKIA', field: 'responsibleSubject' }
    ]

  const handleClick = (id) => {
      props.history.push(`subject/${id}`);
  }

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
    if(firebase.auth().currentUser){
      setUser(firebase.auth().currentUser)
    }
    else {
      props.history.push('/login')
    }
  }, [props.history])
  const drawer = (
    <div >
      <div className={classes.backGround}>

      <div className={classes.toolbar} />
      <div className="containerLogo"><img className="LogoNav" src={Logo} alt="Logo" /></div>
      <List className="text">
        {[{name:'Panel Principal',path: '/'}, {name:'Asuntos',path: '/subject'},{name:'Presupuestos',path: '/budgets'},{name:'Facturas',path: '/facturacion'} , {name:'Proveedores', path:'/provider'}].map((text, index) => (

          <Link className="list" to={text.path}>
          <ListItem button key={text.name}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text.name} />
          </ListItem>
          </Link>
        ))}
          <ListItem className="btn list" onClick={props.close}>
            <ListItemIcon> <CloseIcon /></ListItemIcon>
            <ListItemText className="list" primary='Cerrar Sesión' />
          </ListItem>
      </List>
      
      </div>
    </div>
  );
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div>
      <h1 className="text-subject">Asunto</h1>
      <div>
      <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <MaterialTable
        title=""
        className={classes.header}
        columns={header}
        data={dataSubject}
        onRowClick={((evt, selectedRow) => handleClick(selectedRow.id))}
        editable={{
          onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            Functions.createData('subject', newData)
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
          </main>
    </div>
      </div>
        <div className="divButton">
          <button tyoe="buttom" className="addSubject" onClick={() => setModalShow(true)}>
          Crear un asunto
        </button>

        </div>
        <AddSubject
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
    </div>
  )
} 

export default Subject