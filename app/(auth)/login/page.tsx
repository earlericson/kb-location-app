"use client"

import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
import { LoginForm } from "@/features/auth/login-form";
import { useState } from "react";

export default function LoginPage() {
  const [currentView, setCurrentView] = useState<'login' | 'forgot'>('login');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] px-4">
      {currentView === 'login' ? (
        <LoginForm onNavigateToForgot={() => setCurrentView('forgot')} />
      ) : (
        <ForgotPasswordForm onBackToLogin={() => setCurrentView('login')} />
      )}
    </main>
  );
}