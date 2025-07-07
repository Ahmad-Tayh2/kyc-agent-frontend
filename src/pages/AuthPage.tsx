import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/forms/LoginForm';
import TwoFactorForm from '@/components/auth/forms/TwoFactorForm';
import React, { useState } from 'react';

const AuthPage = () => {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [phoneOrEmail, setPhoneOrEmail] = useState<string>('');

  const handleLoginSuccess = (identifier: string) => {
    setPhoneOrEmail(identifier);
    setStep('otp');
  };

  const handleOtpVerify = (code: string) => {
    // Handle OTP verification and redirect to app
    console.log('OTP verified:', code);
  };

  return (
    <AuthLayout>
      {step === 'login' ? (
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : (
        <TwoFactorForm onVerify={handleOtpVerify} phoneOrEmail={phoneOrEmail} />
      )}
    </AuthLayout>
  );
};

export default AuthPage; 