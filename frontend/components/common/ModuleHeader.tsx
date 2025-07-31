import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import { Refresh, Add } from '@mui/icons-material';

/**
 * ModuleHeader - Componente para o cabeçalho dos módulos
 * 
 * @param title - Título principal do módulo
 * @param subtitle - Subtítulo descritivo do módulo
 * @param icon - Ícone do módulo (ReactNode)
 * @param onRefresh - Função chamada ao clicar em "Atualizar"
 * @param onAdd - Função chamada ao clicar em "Novo"
 * @param addButtonText - Texto do botão de adicionar
 * @param showRefreshButton - Se deve mostrar o botão de atualizar
 */
interface ModuleHeaderProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    onRefresh?: () => void;
    onAdd: () => void;
    addButtonText: string;
    showRefreshButton?: boolean;
}

export default function ModuleHeader({
    title,
    subtitle,
    icon,
    onRefresh,
    onAdd,
    addButtonText,
    showRefreshButton = true
}: ModuleHeaderProps) {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                    sx={{
                        bgcolor: 'rgba(59, 130, 246, 0.2)',
                        color: '#3B82F6',
                        width: 56,
                        height: 56
                    }}
                >
                    {icon}
                </Avatar>
                <Box>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            color: '#F1F5F9',
                            fontWeight: 700,
                            mb: 0.5
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        {subtitle}
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" gap={2}>
                {showRefreshButton && onRefresh && (
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                        sx={{
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                            color: '#3B82F6',
                            '&:hover': {
                                borderColor: '#3B82F6',
                                backgroundColor: 'rgba(59, 130, 246, 0.05)'
                            }
                        }}
                    >
                        Atualizar
                    </Button>
                )}
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    size="large"
                    onClick={onAdd}
                    sx={{
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        fontWeight: 600,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                        }
                    }}
                >
                    {addButtonText}
                </Button>
            </Box>
        </Box>
    );
} 