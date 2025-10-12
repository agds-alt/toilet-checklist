// ============================================
// app/layout.tsx - WITH PRENACONS FAVICON
// ============================================
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Proservice Indonesia',
    description: 'Sistem Monitoring Kebersihan Toilet - Prenacons',
    icons: {
        icon: [
            {
                url: '/logo-prenacons.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                url: '/logo-prenacons.png',
                sizes: '16x16',
                type: 'image/png',
            },
        ],
        apple: '/logo-prenacons.png',
        shortcut: '/logo-prenacons.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className={inter.className}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}