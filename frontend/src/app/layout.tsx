import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SaaS Project Manager',
  description: 'Manage projects with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning prevents extensions from crashing the app */}
      <body className={inter.className} suppressHydrationWarning={true}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
