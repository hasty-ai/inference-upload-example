import { createTheme } from "@mui/material";
import shadows from "@mui/material/styles/shadows";

const palette = {
  mode: "dark",
  primary: {
    main: "#2164aa",
    contrastText: "#dfdfdf",
    light: "#46BFEF",
  },
  secondary: {
    main: "#33373f",
    contrastText: "#dfdfdf",
  },
  interactive: {
    main: "#1e1f28",
  },
  success: {
    main: "#00DAA4",
  },
  error: {
    main: "#f3325e",
  },
  neutral: {
    light: "#999999",
    main: "#636363",
  },
  action: {
    hover: "#33373f",
  },
  text: {
    primary: "#dfdfdf",
    secondary: "#8e9196",
  },
  background: {
    paper: "#34373E",
    default: "#282930",
    menu: "#2d2f36",
    body: "#282930",
  },
};

export const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: "'Maven Pro', sans-serif",
    fontSize: 13,
    button: {
      textTransform: "none",
      fontWeight: 500,
      lineHeight: 1,
      fontSize: "1rem",
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.92rem",
    },
    h1: {
      fontSize: 22,
      lineHeight: "26px",
      // @ts-ignore
      fontWeight: "bold!important",
    },
    h2: {
      // @ts-ignore
      fontWeight: "bold!important",
    },
    h3: {
      // @ts-ignore
      fontWeight: "bold!important",
    },
    h4: {
      // @ts-ignore
      fontWeight: "bold!important",
    },
    h5: {
      // @ts-ignore
      fontWeight: "bold!important",
    },
    h6: {
      fontSize: 16,
      lineHeight: 1.7,
      fontWeight: "bold",
    },
    subtitle1: {
      fontSize: "1.3rem",
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: "none",
          overflow: "visible!important", // TODO: Revert to auto when fully switched to MUI
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          lineHeight: "1.7rem",
          fontWeight: 700,
          fontSize: "1rem",
          whiteSpace: "nowrap",
        },
        sizeSmall: {
          fontWeight: "normal",
          fontSize: "0.9rem",
        },
        outlined: {
          border: `1px dotted #fff`,
          color: palette.text.primary,
          background: palette.interactive.main,
          "&:hover": {
            background: palette.neutral.main,
            border: "1px dotted rgba(255, 255, 255, 0.3)",
          },
          ":disabled": {
            border: "1px dotted rgba(255, 255, 255, 0.3)",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        colorPrimary: {
          color: palette.primary.light,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        InputProps: {
          notched: false,
        },
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        notched: false,
      },
      styleOverrides: {
        root: {
          backgroundColor: "#1e1f28",
          borderRadius: 0,
          // @ts-ignore
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderStyle: "solid!important",
            borderWidth: "1px!important",
            borderColor: ({ palette }) =>
              // @ts-ignore
              palette?.error?.light,
          },
        },
        notchedOutline: {
          border: "none",
        },
        input: {
          padding: "7.5px 14px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          transform: "none",
          position: "static",
          paddingBottom: 6,
          color: "#939394",
          display: "flex",
          alignItems: "center",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontSize: "1rem",
          backgroundColor: palette.interactive.main,
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: palette.background.menu,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#282930",
        },
        stickyHeader: {
          ".MuiTableCell-head": {
            backgroundColor: "#282930",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: "none",
          fontSize: "1rem",
          padding: "0.8rem 1.2rem",
        },
        head: {
          color: "#888A8E",
          borderBottom: `1px solid ${"#33373f"}`,
          fontWeight: "normal",
          whiteSpace: "nowrap",
        },
        // Our theme was overriding the padding prop passed to TableCell,
        // so this over-overrides it back to normal behavior.
        paddingNone: {
          padding: "none",
        },
      },
    },
    MuiTableRow: {
      defaultProps: {
        hover: true,
      },
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": {
            backgroundColor: "#33373f",
            "& > .MuiTableCell-root": {
              backgroundColor: "#33373f",
            },
          },
          "&:nth-of-type(odd)": {
            backgroundColor: "#282930",
            "& > .MuiTableCell-root": {
              backgroundColor: "#282930",
            },
          },
          "&:hover": {
            backgroundColor: `${"#636363"}!important`,
            "& > .MuiTableCell-root": {
              backgroundColor: `${"#636363"}!important`,
            },
          },
        },
        head: {
          "&:hover": {
            backgroundColor: "inherit",
          },
          "&:nth-of-type(even)": {
            backgroundColor: "inherit",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1rem",
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        square: true,
        TransitionProps: { timeout: 150 },
      },
      styleOverrides: {
        root: {
          backgroundColor: palette.background.default,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: palette.interactive.main,
          padding: "0px 8px",
          minHeight: 36,
        },
        content: {
          margin: 0,
          alignItems: "center",
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 8,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
        },
        filled: {
          padding: "0.6rem",
        },
        icon: {
          top: "calc(50% - 9px)",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          "&.MuiOutlinedInput-root": {
            padding: "0px 8px",
          },
        },
        endAdornment: {
          top: "calc(50% - 12px)",
        },
        paper: {
          boxShadow: shadows[3],
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        PaperProps: {
          elevation: 3,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        container: {
          height: "unset",
          marginTop: "4rem",
          marginBottom: "4rem",
        },
        paper: {
          backgroundColor: palette.background.body,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        // @ts-ignore
        root: {
          backgroundColor: palette.interactive.main,
          padding: "6px 24px",
          "& > .MuiTypography-root": {
            marginBottom: 0,
            textTransform: "uppercase",
            color: "#8e9196",
            fontSize: "1.1rem",
            fontWeight: "500!important",
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "1.5rem !important",
          overflow: "visible",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "1rem",
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          overflow: "auto",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ":hover": {
            color: "inherit",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.default,
          paddingTop: 13,
          paddingBottom: 13,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        message: {
          fontSize: "1rem",
        },
      },
    },
  },
});
