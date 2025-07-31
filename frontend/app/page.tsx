'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth';
import { Dashboard } from '@/components/common';

export default function Home() {
    const { user } = useAuth();

    if (!user) {
        return <LoginForm />;
    }

    return <Dashboard />;
} 