'use client';

import {
  MedicalServices,
  FavoriteRounded,
  LocalHospital,
} from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Fade,
  Typography,
  keyframes,
} from '@mui/material';
import { useState, useEffect } from 'react';

// Animação de pulse para os ícones
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
`;

// Animação de entrada suave
const slideUpAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface LoadingTransitionProps {
  message?: string;
  showProgress?: boolean;
}

export default function LoadingTransition({
  message = "Preparando seu ambiente...",
  showProgress = true,
}: LoadingTransitionProps) {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [progress, setProgress] = useState(0);

  // Mensagens dinâmicas durante o loading
  const loadingMessages = [
    "Autenticando usuário...",
    "Carregando dados...",
    "Preparando dashboard...",
    "Quase pronto!",
  ];

  useEffect(() => {
    if (!showProgress) return;

    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < loadingMessages.length) {
        setCurrentMessage(loadingMessages[messageIndex]);
        setProgress((messageIndex + 1) * 25);
        messageIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [showProgress]);

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {/* Ícones animados no fundo */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            animation: `${pulseAnimation} 3s ease-in-out infinite`,
            animationDelay: '0s',
          }}
        >
          <MedicalServices
            sx={{
              fontSize: 60,
              color: 'rgba(59, 130, 246, 0.3)',
            }}
          />
        </Box>
        
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            right: '20%',
            animation: `${pulseAnimation} 3s ease-in-out infinite`,
            animationDelay: '1s',
          }}
        >
          <LocalHospital
            sx={{
              fontSize: 50,
              color: 'rgba(16, 185, 129, 0.3)',
            }}
          />
        </Box>
        
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            animation: `${pulseAnimation} 3s ease-in-out infinite`,
            animationDelay: '2s',
          }}
        >
          <FavoriteRounded
            sx={{
              fontSize: 45,
              color: 'rgba(245, 158, 11, 0.3)',
            }}
          />
        </Box>

        {/* Conteúdo principal */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            animation: `${slideUpAnimation} 1s ease-out`,
          }}
        >
          {/* Logo/Ícone principal */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            <MedicalServices
              sx={{
                fontSize: 80,
                color: '#3B82F6',
                filter: 'drop-shadow(0 4px 20px rgba(59, 130, 246, 0.4))',
              }}
            />
            <Typography
              variant="h3"
              sx={{
                color: '#F1F5F9',
                fontWeight: 700,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              MedFlow
            </Typography>
          </Box>

          {/* Loading spinner */}
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#3B82F6',
              filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))',
              mb: 2,
            }}
          />

          {/* Mensagem dinâmica */}
          <Typography
            variant="h6"
            sx={{
              color: '#E2E8F0',
              textAlign: 'center',
              fontWeight: 500,
              letterSpacing: '0.5px',
              minHeight: '32px',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {currentMessage}
          </Typography>

          {/* Barra de progresso (opcional) */}
          {showProgress && (
            <Box
              sx={{
                width: 300,
                height: 4,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderRadius: 2,
                overflow: 'hidden',
                mt: 2,
              }}
            >
              <Box
                sx={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#3B82F6',
                  borderRadius: 2,
                  transition: 'width 0.8s ease-in-out',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                }}
              />
            </Box>
          )}

          {/* Texto auxiliar */}
          <Typography
            variant="body2"
            sx={{
              color: '#94A3B8',
              textAlign: 'center',
              mt: 2,
              opacity: 0.8,
            }}
          >
            Sistema de Gestão Médica
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}
