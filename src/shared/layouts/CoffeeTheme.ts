import { createTheme } from "@mui/material";

export const coffeeTheme = createTheme({
    palette: {
        primary: {
            main: "#765A31",
        },
    },

    typography: {
        allVariants: {
            fontFamily: "var(--pacifico-font), sans-serif",
        },
    },

    components: {
        MuiTextField: {
            defaultProps: {
                size: "small",
            },
        },
        MuiButton: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    textTransform: "capitalize",
                    borderRadius: 8,
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                },
            },
        },
    },
});
