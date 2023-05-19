import { ThemeProvider } from "@mui/material";
import { coffeeTheme } from "@shared/layouts/CoffeeTheme";
import { AppDispatch, wrapper } from "@shared/store/store";
import "@shared/styles/globals.scss";
import "@shared/styles/home.scss";
import type { AppProps } from "next/app";
import { Pacifico } from "next/font/google";
import { Provider, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { loadUser } from "@shared/store/modules/authSlice";
import { useEffect } from "react";
import { FolderActionProvider } from "@shared/context/FolderActionContext";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--pacifico-font",
});
export default function App({ Component, ...rest }: AppProps) {
  const { store, props: pageProps } = wrapper.useWrappedStore(rest);
  return (
    <div className={pacifico.className}>
      <ThemeProvider theme={coffeeTheme}>
        <FolderActionProvider>
          <Toaster />

          <Provider store={store}>
            <LoadUser />
            <Component {...pageProps} />
          </Provider>
        </FolderActionProvider>
      </ThemeProvider>
    </div>
  );
}

const LoadUser: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return <></>;
};
