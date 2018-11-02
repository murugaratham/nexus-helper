import * as React from 'react';
import OnlineIcon from '@material-ui/icons/SignalCellular4Bar';
import OfflineIcon from '@material-ui/icons/SignalCellularConnectedNoInternet0Bar';
import Chip from '@material-ui/core/Chip';
import { Theme, withStyles, createStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    statusOnline: {
      color: theme.palette.secondary.light,
      border: `1px solid ${theme.palette.secondary.light}`,
    },
    statusOffline: {
      color: theme.palette.error.light,
      border: `1px solid ${theme.palette.error.light}`,
    },
  });

interface INetworkStatusProps {
  online: boolean;
}
type PropsWithStyles = INetworkStatusProps & WithStyles<typeof styles>;

const NetworkStatus = (props: PropsWithStyles) => {
  const { online, classes } = props;
  let component;
  if (online) {
    component = (
      <Chip
        color="secondary"
        className={classes.statusOnline}
        icon={<OnlineIcon />}
        variant="outlined"
        label="Online"
      />
    );
  } else {
    component = (
      <Chip
        color="primary"
        className={classes.statusOffline}
        icon={<OfflineIcon />}
        variant="outlined"
        label="Offline"
      />
    );
  }
  return component;
};

export default withStyles(styles)(NetworkStatus);
