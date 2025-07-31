import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

/**
 * StatsCard - Componente para exibir estatísticas em cards
 * 
 * @param value - Valor numérico a ser exibido
 * @param label - Rótulo descritivo da estatística
 * @param color - Cor principal do card (ex: '#3B82F6')
 * @param backgroundColor - Cor de fundo do card (ex: 'rgba(59, 130, 246, 0.1)')
 * @param borderColor - Cor da borda do card (ex: 'rgba(59, 130, 246, 0.2)')
 */
interface StatsCardProps {
    value: number;
    label: string;
    color: string;
    backgroundColor: string;
    borderColor: string;
}

export default function StatsCard({ value, label, color, backgroundColor, borderColor }: StatsCardProps) {
    return (
        <Card sx={{
            background: backgroundColor,
            border: `1px solid ${borderColor}`
        }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color, fontWeight: 700 }}>
                    {value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
} 