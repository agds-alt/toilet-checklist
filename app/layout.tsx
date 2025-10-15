// ============================================
// app/layout.tsx - WITH PRENACONS FAVICON
// ============================================
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';
import { Toaster } from 'sonner';


const inter = Inter({ subsets: ['latin'] });

// ✅ Separate viewport export (Next.js 15 requirement)
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#1e40af',
}

export const metadata: Metadata = {
    title: 'Proservice Indonesia',
    description: 'Sistem Monitoring Kebersihan Toilet - Prenacons',
    manifest: '/manifest.json'

    }




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

                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    duration={3000}
                />
            </body>
        </html>
    );
}