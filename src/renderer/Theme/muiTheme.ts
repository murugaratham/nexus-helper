import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';

export namespace HmpTheme {
  export const White = '#ffffff';
  export const Blue = '#3b82de';
  export const Green = '#15c67e';
  export const Red = '#c8170b';
  export const LightGrey = '#999999';
  export const MediumGrey = '#777777';
  export const DarkGrey = '#555555';
  export const DeepGrey = '#333333';
}

const font = "'Open Sans', sans-serif;";

const theme = createMuiTheme();

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: HmpTheme.DeepGrey,
      contrastText: HmpTheme.White,
    },
    secondary: {
      main: HmpTheme.Green,
      contrastText: HmpTheme.White,
    },
    error: {
      main: HmpTheme.Red,
    },
    text: {
      primary: HmpTheme.DarkGrey,
    },
  },
  typography: {
    useNextVariants: true,
    // Use the system font over Roboto.
    fontFamily: font,
    button: {
      textTransform: 'capitalize',
    },
  },
  overrides: {
    MuiInputLabel: {
      root: {
        fontSize: 18,
      },
    },
    MuiFormLabel: {
      root: {
        fontSize: 14,
      },
      asterisk: {
        color: theme.palette.error.light,
      },
    },
    MuiInput: {
      root: {
        padding: 0,
        'label + &': {
          marginTop: theme.spacing.unit * 3,
        },
      },
      formControl: {
        'label + &': {
          marginTop: theme.spacing.unit * 3,
        },
      },
      // input: {
      //   borderRadius: 4,
      //   backgroundColor: 'transparent',
      //   border: '1px solid rgb(51, 51, 51, 0.5)',
      //   fontSize: 16,
      //   padding: '10px 12px',
      //   width: 'calc(100% - 24px)',
      //   transition: theme.transitions.create(['border-color', 'box-shadow']),
      //   '&:focus': {
      //     borderColor: '#80bdff',
      //     boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      //   },
      // },
      inputMultiline: {
        padding: '10px 12px',
      },
    },
    MuiTableRow: {
      root: {
        backgroundColor: '#FBFBFB',
        '&:nth-of-type(even)': {
          backgroundColor: '#F3F3F3',
        },
      },
      head: {
        backgroundColor: '#F3F3F3',
        color: '#777777',
      },
    },
    MuiTableCell: {
      root: {
        padding: '10px 8px',
      },
      body: {
        borderRight: `1px solid
        ${
          theme.palette.type === 'light'
            ? lighten(fade(theme.palette.divider, 1), 0.88)
            : darken(fade(theme.palette.divider, 1), 0.8)
        }`,
        '&:last-child': {
          borderRightWidth: 0,
        },
        verticalAlign: 'top',
      },
    },
    MuiSwitch: {
      root: {
        marginTop: theme.spacing.unit * 1.5,
        marginLeft: -theme.spacing.unit * 1.5,
      },
    },
    MuiDialog: {
      paper: {
        padding: `0 ${theme.spacing.unit * 2}px`,
      },
    },
    MuiDialogContent: {
      root: {
        paddingTop: theme.spacing.unit * 3,
      },
    },
    MuiDialogActions: {
      root: {
        marginBottom: theme.spacing.unit * 3,
      },
    },
    MuiInputAdornment: {
      root: {
        maxHeight: 'none',
        position: 'absolute',
        right: '8px',
        height: '100%',
      },
    },
    MuiButton: {
      root: {
        borderRadius: 3,
        height: '50px',
        minWidth: '187px',
      },
      sizeSmall: {
        height: '40px',
        minWidth: '138px',
      },
      disabled: {
        borderColor: 'rgba(0, 0, 0, 0.26)',
      },
    },
  },
});

export default muiTheme;
