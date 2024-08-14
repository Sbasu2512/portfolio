import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/NavBar/nav";
import Footer from "./Components/Footer/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sayantan Basu",
  description: "Sayantan Basu's Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} theme h-100`}>
      <Navbar/>
        {children}
      <Footer/>
        </body>
    </html>
  );
}
