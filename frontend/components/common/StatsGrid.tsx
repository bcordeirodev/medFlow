import React from 'react';
import { Grid } from '@mui/material';
import StatsCard from './StatsCard';

/**
 * StatsGrid - Componente para exibir grid de estatísticas
 * 
 * @param stats - Array de estatísticas com valor, label e cores
 */
interface StatItem {
    value: number;
    label: string;
    color: string;
    backgroundColor: string;
    borderColor: string;
}

interface StatsGridProps {
    stats: StatItem[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <Grid container spacing={2}>
            {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                    <StatsCard
                        value={stat.value}
                        label={stat.label}
                        color={stat.color}
                        backgroundColor={stat.backgroundColor}
                        borderColor={stat.borderColor}
                    />
                </Grid>
            ))}
        </Grid>
    );
} 