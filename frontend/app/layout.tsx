import type { Metadata } from 'next'
import './globals.css'
import { CustomThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SWRProvider } from '@/components/providers/SWRProvider'

export const metadata: Metadata = {
    title: 'MedFlow - Sistema de Gestão Médica',
    description: 'Sistema completo para gestão de pacientes, prescrições e medicamentos',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <body>
                <SWRProvider>
                    <CustomThemeProvider>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </CustomThemeProvider>
                </SWRProvider>
            </body>
        </html>
    )
} 