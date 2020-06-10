import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
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
import Budgets from '../components/Budgets';
import { Link } from "react-router-dom";
import '../css/Nav.css';
import Logo from '../img/Logo.svg'
 import '../css/Nav.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
    background: '#A20067',
    height: 579,
    position: 'absolute'
  },
  texto:{
    color: '#FFFFFF',
  }
}));

function Nav(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div >
      <div className={classes.backGround}>

      <div className={classes.toolbar} />
      <div class="containerLogo"><img className="Logo img-fluid" src={Logo} alt="Logo" /></div>
      <Divider />
      <List>
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
     
            <Budgets />
       
      </main>
    </div>
  );
}

export default Nav;