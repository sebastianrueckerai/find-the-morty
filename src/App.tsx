import React, { FC } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";
import { setupStore } from "./store/store";
import Game from "./screens/Game";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App: FC = () => {
  return (
    <Provider store={setupStore()}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Game />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
