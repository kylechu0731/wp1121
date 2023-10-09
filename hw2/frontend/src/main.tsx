import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


import App from "./App.tsx";
import SongProvider from "./hooks/SongProvider.tsx";
import "./index.css";

const myTheme = createTheme({
  palette: {
    background: {
      default: "#191414"
    },
    primary: {
      main: "#1DB954"
    },
    secondary: {
      main: "#1DB954"
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
    ].join(','),
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={myTheme}>
      <SongProvider>
        <CssBaseline />
        <App />
      </SongProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
