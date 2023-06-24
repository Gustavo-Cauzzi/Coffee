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
        MuiTableHead: {
            styleOverrides: {
                root: {
                    "& .MuiTableCell-root": {
                        fontWeight: "bold",
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: "0.25rem 1rem",
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    // '& .MuiTableCell-root:first-of-type': {
                    //     borderLeft
                    // }
                    borderRadius: 10,
                    transition: "background-color 0.15s",
                },
            },
        },
        MuiTableBody: {
            styleOverrides: {
                root: {
                    // Não há uma forma simples provida pelo Material de detectar a presença de um collapse em uma tabela!
                    // MuiTableRow-root com collapse devem ser coloridas uma a cada 4 linhas devido as linhas escondidas que o
                    // Collapse gera. Para detectar, detectamos pelo CSS se há colunas com apenas uma célula com colSpan, que
                    // é um bom (mas não perfeito) indicador da presença de um collapse naquela tabela.

                    // Com collapse
                    "&:has(> .MuiTableRow-root > .MuiTableCell-root[colspan]:only-child)": {
                        ".MuiTableRow-root:not(.MuiTableRow-head)": {
                            "&:nth-of-type(4n +1)": {
                                backgroundColor: "rgba(0, 0, 0,0.04)",
                            },
                            // Hover de TableRow configurado aqui dentro para manter prioridade sobre o :nth-of-type acima
                            "&:not(:has(.MuiCollapse-root)):hover": {
                                backgroundColor: "rgba(0, 0, 0,0.1)",
                            },
                        },
                    },
                    // Sem collapse (mesma coisa porém negado)
                    "&:not(:has(> .MuiTableRow-root > .MuiTableCell-root[colspan]:only-child))": {
                        ".MuiTableRow-root:not(.MuiTableRow-head)": {
                            "&:nth-of-type(2n -1)": {
                                backgroundColor: "rgba(0, 0, 0,0.04)",
                            },
                            // Hover de TableRow configurado aqui dentro para manter prioridade sobre o :nth-of-type acima
                            "&:not(:has(.MuiCollapse-root)):hover": {
                                backgroundColor: "rgba(0, 0, 0,0.1)",
                            },
                        },
                    },
                },
            },
        },
        MuiDataGrid: {
            defaultProps: {
                disableColumnMenu: process.env.NODE_ENV === "production",
                disableColumnSelector: process.env.NODE_ENV === "production",
                disableColumnFilter: process.env.NODE_ENV === "production",
                autoHeight: true,
                disableRowSelectionOnClick: true,
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
                    "& .MuiDataGrid-overlay": {
                        background: "transparent",
                    },
                    "& .MuiCheckbox-root": {
                        padding: "3px 9px",
                    },
                    "& .MuiDataGrid-row": {
                        transition: "background-color 0.15s",
                        "&:nth-of-type(odd)": {
                            backgroundColor: "rgba(0, 0, 0, 0.06)",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                            },
                        },
                    },

                    "& .MuiDataGrid-renderingZone, .MuiDataGrid-virtualScrollerContent": {
                        "& .MuiDataGrid-row": {
                            border: 0,
                            cursor: "pointer",
                            "&:hover": {
                                filter: "brightness(0.9)",
                            },
                        },
                        "& .MuiDataGrid-row:first-of-type": {
                            borderTopLeftRadius: "3px",
                            borderBottomLeftRadius: "3px",
                            overflow: "hidden",
                        },
                        "& .MuiDataGrid-row:nth-of-type(odd)": {
                            "&:hover": {
                                filter: "brightness(0.9)",
                            },

                            // "&.Mui-selected": {
                            //     backgroundColor: `rgba(12, 6, 63, 0.1)`,

                            //     "&:hover": {
                            //         backgroundColor: `rgba(12, 6, 63, 0.12);`,
                            //     },
                            // },
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
