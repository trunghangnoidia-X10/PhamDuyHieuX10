import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import { ToastProvider } from '@/lib/toast'
import ToastContainer from '@/components/Toast'
import SplashScreen from '@/components/SplashScreen'
import NotificationManager from '@/components/NotificationManager'

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-H17FFW9TV0'

export const metadata: Metadata = {
    title: 'X10 - Performance Profit Purpose',
    description: 'Hành trình thức tỉnh nhận thức để phá vỡ "trần tăng trưởng" cho doanh nghiệp và xã hội. Đồng hành 24/7 để phát triển bản thân.',
    keywords: ['X10', 'performance', 'profit', 'purpose', 'coaching', 'lãnh đạo tỉnh thức', 'phát triển bản thân'],
    authors: [{ name: 'X10' }],
    openGraph: {
        title: 'X10 - Performance Profit Purpose',
        description: 'Hành trình thức tỉnh nhận thức - Đồng hành 24/7',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#0ea5e9" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <link rel="apple-touch-icon" href="/images/icon-192.png" />

                {/* Google Analytics */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}');
                    `}
                </Script>

                {/* Service Worker Registration */}
                <Script id="sw-register" strategy="afterInteractive">
                    {`
                        if ('serviceWorker' in navigator) {
                            window.addEventListener('load', function() {
                                navigator.serviceWorker.register('/sw.js')
                                    .then(function(registration) {
                                        console.log('SW registered: ', registration);
                                    })
                                    .catch(function(error) {
                                        console.log('SW registration failed: ', error);
                                    });
                            });
                        }
                    `}
                </Script>

            </head>
            <body className="antialiased">
                <ToastProvider>
                    <AuthProvider>
                        <NotificationManager />
                        <SplashScreen>
                            {children}
                        </SplashScreen>
                    </AuthProvider>
                    <ToastContainer />
                </ToastProvider>
            </body>
        </html>
    )
}
