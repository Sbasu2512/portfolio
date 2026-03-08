import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Navbar from './Components/NavBar/nav';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Analytics } from '@vercel/analytics/react';
import './global.css';
import { ThemeProvider } from './context/ThemeContext';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Sayantan Basu',
  description: "Sayantan Basu's Portfolio",
  icons: {
    icon: [
      {
        url: '/assets/logo/logo.jpg',
        href: '/assets/logo/logo.jpg',
        media: 'image/jpg'
      }
    ]
  }
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
