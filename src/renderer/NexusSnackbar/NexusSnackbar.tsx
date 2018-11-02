import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const snackBarShowDuration = 3000;
const initialState: INexusSnackbarState = {
  open: false,
  message: '',
};

export interface INexusSnackbarState {
  open: boolean;
  message: string;
}

let openNexusSnackBarFn: (message: string) => void;

export const openNexusSnackBar = (message: string) => {
  openNexusSnackBarFn(message);
};

class NexusSnackbar extends React.PureComponent<{}, INexusSnackbarState> {
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }
  componentDidMount() {
    openNexusSnackBarFn = this.openSnackbar;
  }

  // using arrow function for lexical scoping
  openSnackbar = (props: string) => {
    this.setState({
      message: props,
      open: true,
    });
  };
  handleClose = (event: React.SyntheticEvent<HTMLElement>, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState(initialState);
  };
  render() {
    const { message, open } = this.state || '';
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={snackBarShowDuration}
        onClose={this.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{message}</span>}
      />
    );
  }
}

export default NexusSnackbar;
