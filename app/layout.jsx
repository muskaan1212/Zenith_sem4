import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/theme-provider'
import AuthProvider from '@/components/auth-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Zenith Healthcare',
  description: 'Premium healthcare management — appointments, prescriptions, wellness and more.',
  keywords: 'healthcare, appointments, prescriptions, wellness, doctor',
}

export const viewport = {
  themeColor: '#2c5530',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
