import * as React from 'react';
import classNames from 'classnames';
import { Theme, withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import isOnline from 'is-online';
import { Grid } from '@material-ui/core';
import SideMenu from './SideMenu/SideMenu';
import NetworkStatus from './NetworkStatus';
import NexusSnackbar from './NexusSnackbar';

const checkConnectionPollDuration = 5000;
const drawerWidth = 240;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    title: {
      flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
      height: '100vh',
      overflow: 'auto',
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing.unit * 7,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing.unit * 9,
      },
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    statusOnline: {
      color: theme.palette.secondary.light,
      border: `1px solid ${theme.palette.secondary.light}`,
    },
    statusOffline: {
      color: theme.palette.error.light,
      border: `1px solid ${theme.palette.error.light}`,
    },
  });

type PropsWithStyles = WithStyles<typeof styles>;
interface ILayoutState {
  online: boolean;
  menuOpen: boolean;
}
let intervalId: any; // NodeJS.Timer;
class Layout extends React.Component<PropsWithStyles, ILayoutState> {
  constructor(props: PropsWithStyles) {
    super(props);
    this.state = {
      online: false,
      menuOpen: false,
    };
    this.checkConnection();
  }
  componentDidMount() {
    this.startCheckConnectionPoll();
  }

  startCheckConnectionPoll() {
    intervalId = setInterval(() => {
      this.checkConnection();
    }, checkConnectionPollDuration);
  }

  checkConnection() {
    isOnline().then(online => {
      this.setState({ online });
    });
  }

  componentWillUnmount() {
    clearInterval(intervalId);
  }

  handleDrawerOpen = () => {
    this.setState({ menuOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ menuOpen: false });
  };

  render() {
    const { classes, children } = this.props;
    const { online } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.menuOpen && classes.appBarShift)}
          >
            <Toolbar disableGutters={!this.state.menuOpen} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, this.state.menuOpen && classes.menuButtonHidden)}
              >
                <MenuIcon />
              </IconButton>
              <Typography component="h1" variant="h6" color="inherit" noWrap={true} className={classes.title}>
                Nexus Helper
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.menuOpen && classes.drawerPaperClose),
            }}
            open={this.state.menuOpen}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <SideMenu />
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Grid container={true}>
              <NetworkStatus online={online} />
            </Grid>
            {children}
            <NexusSnackbar />
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Layout);
