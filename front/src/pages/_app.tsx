import "@shared/styles/globals.css";
import "@shared/styles/home.scss";
import type { AppProps } from "next/app";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={pacifico.className}>
      <Component {...pageProps} />
    </div>
  );
}
