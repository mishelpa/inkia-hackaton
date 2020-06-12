import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Functions } from '../services/Functions';
import firebase from '../services/firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import MaterialTable from 'material-table';
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
import { makeStyles, useTheme } from '@material-ui/core/styles';
import '../css/Nav.css';
import Subject from './Subject';
import Logo from '../img/Logo.svg'
 import '../css/Nav.css';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from "react-router-dom";
import '../css/Facturacion.css'
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

const useStyles2 = makeStyles((theme) => ({
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
  const { window } = props;
  const classes = useStyles();
  const classes2 = useStyles2();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const header =  [
    { title: 'Asunto', field: 'subject' },
    { title: 'Responsable', field: 'corporative' },
    { title: 'Empresa', field: 'company' },
    { title: 'Proveedor', field: 'provider' },
    { title: 'Estado', field: 'substatus' },
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
  const drawer = (
    <div className="hide-scroll">
      <div class="viewport">
      <div className={classes.backGround}>

      <div className={classes.toolbar} />
      <div className="containerLogo"><img className="LogoNav" src={Logo} alt="Logo" /></div>
      <List className="text">
        {[{name:'Panel Principal',path: '/'}, {name:'Asuntos',path: '/subject'},{name:'Facturas',path: '/facturacion'} , {name:'Proveedores', path:'/provider'}].map((text, index) => (

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
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <div>
      <h1 className="text-Facturacion">Facturas</h1>
    
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
     </main>
    </div>
    </div>
  )
}


export default Facturacion;