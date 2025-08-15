"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth";
import { Dashboard } from "@/components/common";
import LoadingTransition from "@/components/common/LoadingTransition";
import { Fade } from "@mui/material";

export default function Home() {
  const { user, loading, isTransitioning } = useAuth();

  // Mostrar loading inicial
  if (loading) {
    return (
      <LoadingTransition
        message="Inicializando aplicação..."
        showProgress={false}
      />
    );
  }

  // Mostrar transição após login
  if (isTransitioning) {
    return (
      <LoadingTransition message="Bem-vindo ao MedFlow!" showProgress={true} />
    );
  }

  // Mostrar formulário de login
  if (!user) {
    return (
      <Fade in timeout={500}>
        <div>
          <LoginForm />
        </div>
      </Fade>
    );
  }

  // Mostrar dashboard com transição
  return (
    <Fade in timeout={800}>
      <div>
        <Dashboard />
      </div>
    </Fade>
  );
}
