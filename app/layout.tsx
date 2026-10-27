import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hrishita Joshi — Portfolio',
  description: 'A portfolio, on two wheels. Scroll to ride.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;600&family=Manrope:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
