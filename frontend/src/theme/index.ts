import { createTheme } from "@mui/material/styles"

// Palette de couleurs moderne et professionnelle
const colors = {
    primary: {
        main: "#1976D2",
        light: "#42A5F5",
        dark: "#1565C0",
        contrastText: "#FFFFFF",
    },
    secondary: {
        main: "#424242",
        light: "#6D6D6D",
        dark: "#2E2E2E",
        contrastText: "#FFFFFF",
    },
    background: {
        default: "#F8FAFC",
        paper: "#FFFFFF",
    },
    text: {
        primary: "#2C3E50",
        secondary: "#34495E",
    },
    grey: {
        50: "#F8FAFC",
        100: "#F1F5F9",
        200: "#E2E8F0",
        300: "#CBD5E1",
        400: "#94A3B8",
        500: "#64748B",
        600: "#475569",
        700: "#334155",
        800: "#1E293B",
        900: "#0F172A",
    },
}

export const theme = createTheme({
    palette: {
        ...colors,
        mode: "light",
    },

    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
        ].join(","),

        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
            lineHeight: 1.2,
            color: colors.text.primary,
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 600,
            lineHeight: 1.3,
            color: colors.text.primary,
        },
        h3: {
            fontSize: "1.75rem",
            fontWeight: 600,
            lineHeight: 1.3,
            color: colors.text.primary,
        },
        h4: {
            fontSize: "1.5rem",
            fontWeight: 600,
            lineHeight: 1.4,
            color: colors.text.primary,
        },
        h5: {
            fontSize: "1.25rem",
            fontWeight: 600,
            lineHeight: 1.4,
            color: colors.text.primary,
        },
        h6: {
            fontSize: "1.125rem",
            fontWeight: 600,
            lineHeight: 1.4,
            color: colors.text.primary,
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.6,
            color: colors.text.secondary,
        },
        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: colors.text.secondary,
        },
    },

    shape: {
        borderRadius: 12,
    },

    shadows: [
        "none",
        "0px 1px 3px rgba(0, 0, 0, 0.05)",
        "0px 1px 6px rgba(0, 0, 0, 0.08)",
        "0px 3px 12px rgba(0, 0, 0, 0.1)",
        "0px 6px 24px rgba(0, 0, 0, 0.12)",
        "0px 12px 48px rgba(0, 0, 0, 0.15)",
        "0px 1px 3px rgba(0, 0, 0, 0.05)",
        "0px 1px 6px rgba(0, 0, 0, 0.08)",
        "0px 3px 12px rgba(0, 0, 0, 0.1)",
        "0px 6px 24px rgba(0, 0, 0, 0.12)",
        "0px 12px 48px rgba(0, 0, 0, 0.15)",
        "0px 1px 3px rgba(0, 0, 0, 0.05)",
        "0px 1px 6px rgba(0, 0, 0, 0.08)",
        "0px 3px 12px rgba(0, 0, 0, 0.1)",
        "0px 6px 24px rgba(0, 0, 0, 0.12)",
        "0px 12px 48px rgba(0, 0, 0, 0.15)",
        "0px 1px 3px rgba(0, 0, 0, 0.05)",
        "0px 1px 6px rgba(0, 0, 0, 0.08)",
        "0px 3px 12px rgba(0, 0, 0, 0.1)",
        "0px 6px 24px rgba(0, 0, 0, 0.12)",
        "0px 12px 48px rgba(0, 0, 0, 0.15)",
        "0px 1px 3px rgba(0, 0, 0, 0.05)",
        "0px 1px 6px rgba(0, 0, 0, 0.08)",
        "0px 3px 12px rgba(0, 0, 0, 0.1)",
        "0px 6px 24px rgba(0, 0, 0, 0.12)",
    ],

    components: {
        // AppBar moderne et épurée
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.background.paper,
                    color: colors.text.primary,
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
                    backdropFilter: "blur(8px)",
                },
            },
        },

        // Cards avec design épuré
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
                    border: `1px solid ${colors.grey[200]}`,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.1)",
                        transform: "translateY(-2px)",
                    },
                },
            },
        },

        // Boutons modernes
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
                contained: {
                    background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
                    "&:hover": {
                        background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
                        transform: "translateY(-1px)",
                    },
                },
                outlined: {
                    borderColor: colors.primary.main,
                    color: colors.primary.main,
                    "&:hover": {
                        backgroundColor: `${colors.primary.main}08`,
                        borderColor: colors.primary.dark,
                    },
                },
            },
        },

        // TextField avec design moderne
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 12,
                        backgroundColor: colors.grey[50],
                        "& fieldset": {
                            borderColor: colors.grey[300],
                            transition: "border-color 0.2s ease-in-out",
                        },
                        "&:hover fieldset": {
                            borderColor: colors.primary.main,
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: colors.primary.main,
                            borderWidth: 2,
                        },
                    },
                },
            },
        },

        // Chip moderne
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
                filled: {
                    backgroundColor: colors.grey[100],
                    color: colors.text.primary,
                    "&:hover": {
                        backgroundColor: colors.grey[200],
                    },
                },
            },
        },

        // Paper épuré
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
                },
            },
        },

        // Dialog moderne
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 20,
                    boxShadow: "0px 12px 48px rgba(0, 0, 0, 0.15)",
                },
            },
        },

        // Tabs épurées
        MuiTabs: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${colors.grey[200]}`,
                },
                indicator: {
                    backgroundColor: colors.primary.main,
                    height: 3,
                    borderRadius: 2,
                },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    color: colors.text.secondary,
                    "&.Mui-selected": {
                        color: colors.primary.main,
                        fontWeight: 600,
                    },
                },
            },
        },
    },
})
