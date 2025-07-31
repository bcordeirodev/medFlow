import React from 'react';
import { Box, Typography, Button, Zoom } from '@mui/material';
import { Add } from '@mui/icons-material';

/**
 * EmptyState - Componente para exibir estado vazio com opção de ação
 * 
 * @param icon - Ícone principal do estado vazio
 * @param title - Título principal
 * @param description - Descrição do estado vazio
 * @param actionText - Texto do botão de ação (opcional)
 * @param onAction - Função chamada ao clicar no botão de ação (opcional)
 * @param showAction - Se deve mostrar o botão de ação
 */
interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
    showAction?: boolean;
}

export default function EmptyState({
    icon,
    title,
    description,
    actionText,
    onAction,
    showAction = false
}: EmptyStateProps) {
    return (
        <Zoom in timeout={500}>
            <Box
                textAlign="center"
                py={8}
                sx={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(51, 65, 85, 0.5) 100%)',
                    borderRadius: 3,
                    border: '2px dashed rgba(59, 130, 246, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100px',
                        height: '100px',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }}
                />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ fontSize: 80, color: '#475569', mb: 2 }}>
                        {icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#94A3B8', mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, color: '#64748B' }}>
                        {description}
                    </Typography>
                    {showAction && actionText && onAction && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={onAction}
                            sx={{
                                mt: 3,
                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                                }
                            }}
                        >
                            {actionText}
                        </Button>
                    )}
                </Box>
            </Box>
        </Zoom>
    );
} 