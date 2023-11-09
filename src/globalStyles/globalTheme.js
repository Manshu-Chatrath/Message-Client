import { createTheme } from "@mui/material/styles";
export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: "10px",
            borderRadius: 8,
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            background: "#C1C1C1",
            width: "10px",
          },
        },
      },
    },
  },
});
