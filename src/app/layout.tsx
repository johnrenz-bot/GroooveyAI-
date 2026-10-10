import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GROOVEYY — Performing Arts AI Chatbot',
  description: 'Specialized AI performing arts companion for dance, singing, music, theater, acting, and stage audition coaching.',
  icons: {
    icon: '/grooveyy-mascot.png',
  },
  openGraph: {
    title: 'GROOVEYY — Performing Arts AI Chatbot',
    description: 'Specialized AI performing arts companion for dance, singing, music, theater, acting, and stage audition coaching.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF9F5] text-[#1B1C1A] antialiased select-auto min-h-screen">
        {children}
      </body>
    </html>
  );
}
