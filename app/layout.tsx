// ============================================
// app/layout.tsx - UPDATE ROOT LAYOUT
// ============================================
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Toilet Checklist System - Proservice Indonesia',
    description: 'Sistem Checklist Kebersihan Toilet dengan Multi-Role',
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