import type { Metadata } from 'next';
import { Inter_Tight, Newsreader } from 'next/font/google';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['500', '600', '800'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dimas Di Ajeng Duwi Saputra — Portfolio',
  description:
    'Minimalist software engineering portfolio & interactive 3D Vinyl LP project showcase by Dimas Di Ajeng Duwi Saputra.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
