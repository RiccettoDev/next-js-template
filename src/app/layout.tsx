import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>

        <link rel="manifest" href="/manifest.json" />

        <link rel="icon" href="/icon.png" type="image/x-icon" />

        <title>Ritthec</title>
      </head>
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}