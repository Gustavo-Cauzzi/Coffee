import { createTheme } from "@mui/material";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { MUI_DATAGRID_PT_BR } from "./DatagridLocale";

const mainColor = "#765A31";
const hoverOpacity = 0.02;

export const coffeeTheme = createTheme({
    palette: {
        primary: {
            main: mainColor,
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
        MuiDataGrid: {
            defaultProps: {
                disableColumnMenu: process.env.NODE_ENV === "production",
                disableColumnSelector: process.env.NODE_ENV === "production",
                disableColumnFilter: process.env.NODE_ENV === "production",
                autoHeight: true,
                pageSizeOptions: [10, 20, 35, 50],
                localeText: MUI_DATAGRID_PT_BR,
                initialState: {
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                },
            },
            styleOverrides: {
                root: {
                    border: 0,
                    "& .MuiCheckbox-root": {
                        padding: "3px 9px",
                    },
                    // '& .MuiDataGrid-columnSeparator': {
                    //     backgroundColor: `#FC7422`,
                    // },

                    "& .MuiDataGrid-renderingZone, .MuiDataGrid-virtualScrollerContent": {
                        "& .MuiDataGrid-row": {
                            border: 0,
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                            "&:hover": {
                                backgroundColor: "#E0E0E0",
                            },
                        },
                        "& .MuiDataGrid-row:first-of-type": {
                            borderTopLeftRadius: "3px",
                            borderBottomLeftRadius: "3px",
                            overflow: "hidden",
                        },
                        "& .MuiDataGrid-row:nth-of-type(odd)": {
                            backgroundColor: `rgba(0, 0, 0, ${hoverOpacity})`,

                            "&:hover": {
                                backgroundColor: "#E0E0E0",
                            },

                            "&.Mui-selected": {
                                backgroundColor: `rgba(12, 6, 63, 0.1)`,

                                "&:hover": {
                                    backgroundColor: `rgba(12, 6, 63, 0.12);`,
                                },
                            },
                        },
                        "& .MuiDataGrid-row:last-of-type": {
                            borderTopRightRadius: "3px",
                            borderBottomRightRadius: "3px",
                            overflow: "hidden",
                        },
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: `2px solid ${mainColor}`,
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    },
                },
            },
        },
    },
});
