import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/system";
import { Provider } from "react-redux";
import { store } from "reducers";
import { theme } from "./globalStyles/globalTheme";
import CssBaseline from "@mui/material/CssBaseline";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
