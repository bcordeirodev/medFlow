'use client';

import { FormTextField } from '@/components/common/FormField';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { LoginFormData, loginSchema } from '@/lib/schemas';
import { ErrorHandler } from '@/utils/errorHandler';
import {
  ErrorOutline as ErrorIcon,
  Lock,
  Login,
  MedicalServices,
  Person,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import React from 'react';

export default function LoginForm() {
  const { login } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [showFormErrors, setShowFormErrors] = React.useState(false);

  const form = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async values => {
      try {
        setShowFormErrors(false);
        await login(values.email, values.password);
        showSuccess('Login realizado com sucesso! Redirecionando...');
      } catch (error) {
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        ErrorHandler.logError(error, 'Login Form');
        showError(errorMessage);
      }
    },
    validateOnChange: false, // ALTERADO: desabilita validação durante digitação
    validateOnBlur: true, // MANTIDO: valida apenas quando sai do campo
  });

  // Mostrar erros de validação quando o usuário tentar submeter E formulário inválido
  React.useEffect(() => {
    if (form.isSubmitting && !form.isValid) {
      setShowFormErrors(true);
    }
    // Esconder erros de validação quando formulário se torna válido
    if (form.isValid && showFormErrors) {
      setShowFormErrors(false);
    }
  }, [form.isSubmitting, form.isValid, showFormErrors]);

  // Limpar erros de validação quando o usuário começar a digitar novamente
  React.useEffect(() => {
    if (showFormErrors && (form.values.email || form.values.password)) {
      setShowFormErrors(false);
    }
  }, [form.values.email, form.values.password, showFormErrors]);

  // Validação manual do email para melhor controle
  const handleEmailBlur = React.useCallback(() => {
    form.handleBlur('email')();

    // Validação adicional para email - só mostra erro se realmente inválido
    if (form.values.email && form.values.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.values.email.trim())) {
        form.setFieldError('email', 'Digite um email válido');
        form.setFieldTouched('email', true);
      }
    }
  }, [form]);

  // Validação manual da senha
  const handlePasswordBlur = React.useCallback(() => {
    form.handleBlur('password')();

    if (form.values.password && form.values.password.length < 6) {
      form.setFieldError('password', 'Senha deve ter pelo menos 6 caracteres');
      form.setFieldTouched('password', true);
    }
  }, [form]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 8px 32px rgba(30, 58, 138, 0.4)',
              }}
            >
              <MedicalServices sx={{ color: 'white', fontSize: 40 }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: '#F1F5F9',
                mb: 1,
              }}
            >
              MedFlow
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: '#94A3B8' }}
            >
              Sistema de Gestão Médica
            </Typography>
          </Box>

          <form onSubmit={form.handleSubmit}>
            <Grid container spacing={3}>
              {/* Exibição de erros de validação */}
              <Collapse in={showFormErrors && !form.isValid}>
                <Grid item xs={12}>
                  <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      border: '1px solid rgba(244, 67, 54, 0.3)',
                      '& .MuiAlert-message': {
                        color: '#f44336',
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Por favor, corrija os seguintes erros:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      {Object.entries(form.errors).map(
                        ([field, error]) =>
                          error && (
                            <li key={field}>
                              <Typography variant="body2">
                                {field === 'email' ? 'Email' : 'Senha'}: {error}
                              </Typography>
                            </li>
                          )
                      )}
                    </Box>
                  </Alert>
                </Grid>
              </Collapse>

              <Grid item xs={12}>
                <FormTextField
                  name="email"
                  label="Email"
                  type="email"
                  value={form.values.email}
                  onChange={value => {
                    form.setFieldValue('email', value);
                    // Limpar erro de email quando usuário digita
                    if (form.errors.email) {
                      form.setFieldError('email', '');
                    }
                  }}
                  onBlur={handleEmailBlur}
                  error={form.errors.email}
                  touched={form.touched.email || showFormErrors}
                  required
                  textFieldProps={{
                    InputProps: {
                      startAdornment: (
                        <Person sx={{ mr: 1, color: '#3B82F6' }} />
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormTextField
                  name="password"
                  label="Senha"
                  type="password"
                  value={form.values.password}
                  onChange={value => {
                    form.setFieldValue('password', value);
                    // Limpar erro de senha quando usuário digita
                    if (form.errors.password) {
                      form.setFieldError('password', '');
                    }
                  }}
                  onBlur={handlePasswordBlur}
                  error={form.errors.password}
                  touched={form.touched.password || showFormErrors}
                  required
                  textFieldProps={{
                    InputProps: {
                      startAdornment: <Lock sx={{ mr: 1, color: '#3B82F6' }} />,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={form.isSubmitting}
                  startIcon={
                    form.isSubmitting ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Login />
                    )
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background:
                      'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 15px rgba(30, 58, 138, 0.4)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
                      boxShadow: '0 6px 20px rgba(30, 58, 138, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background:
                        'linear-gradient(135deg, #475569 0%, #64748B 100%)',
                      transform: 'none',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {form.isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: '#94A3B8' }}
            >
              Acesse com suas credenciais médicas
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
