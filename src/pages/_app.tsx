import { ThemeProvider } from "@mui/material";
import { coffeeTheme } from "@shared/layouts/CoffeeTheme";
import { store } from "@shared/store/store";
import "@shared/styles/globals.scss";
import "@shared/styles/home.scss";
import type { AppProps } from "next/app";
import { Pacifico } from "next/font/google";
import { Provider } from "react-redux";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--pacifico-font",
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={pacifico.className}>
      <ThemeProvider theme={coffeeTheme}>
        <Provider store={store()}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </div>
  );
}
