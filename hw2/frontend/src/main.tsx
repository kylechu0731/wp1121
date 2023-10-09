import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


import App from "./App.tsx";
import { SongProvider } from "./hooks/useSongs.tsx";
// import '@fontsource/roboto/500.css';
import "./index.css";

const myTheme = createTheme({
  palette: {
    background: {
      default: "#191414"
    },
    primary: {
      main: "#1DB954"
      //main: "#3E8EDE",
    },
    secondary: {
      main: "#1DB954"
      //main: "#00CCFF",
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
