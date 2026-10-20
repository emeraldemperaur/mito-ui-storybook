'use client';

import React, { useState, useId, type CSSProperties } from 'react';
import type { AuthenticationUIProps, AuthCredentials } from './types';
import '../../styles/authenticationui.scss';

/**
 * Universal Authentication UI
 * 
 * A deeply customizable, WCAG-compliant React component that renders complex 
 * authentication flows (Sign In, Sign Up, Verification). Supports multiple layouts 
 * (Prometheus 3D box, Chaimara split-screen) and design variants.
 */
export const AuthenticationUI: React.FC<AuthenticationUIProps> = ({
  layout = 'chaimara',
  variant = 'neumorphic',
  darkMode = false,
  signInVerificationCode = false,
  signUpVerificationCode = true,
  brandImage = '/assets/default-bg.jpg',
  brandLogo = '/assets/logo.png',
  brandTitle = 'Chímaira',
  brandSubtitle = 'BUILD BY',
  fontFamily = '"Bodoni Moda Variable", "Montserrat", sans-serif',
  backgroundColor,
  primaryColor = '#000000',
  onSignIn,
  onSignUp,
  onVerifyCode,
  onResendCode,
  onForgotPassword,
  className = '',
  style,
}) => {
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const codeId = useId();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState<AuthCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); 
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsConfirming(false);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isConfirming) {
        const res = await onVerifyCode(formData);
        if (!res.success) setErrorMsg(res.error || 'Verification failed');
      } else if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setErrorMsg('Passwords do not match');
          setIsLoading(false);
          return;
        }
        const res = await onSignUp(formData);
        if (res.success && signUpVerificationCode && res.requiresVerification) {
          setIsConfirming(true);
        } else if (!res.success) {
          setErrorMsg(res.error || 'Sign up failed');
        }
      } else {
        const res = await onSignIn(formData);
        if (res.success && signInVerificationCode && res.requiresVerification) {
          setIsConfirming(true);
        } else if (!res.success) {
          setErrorMsg(res.error || 'Authentication failed');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const rootStyles = {
    '--auth-bg': backgroundColor || (darkMode ? '#121212' : '#ffffff'),
    '--auth-text': darkMode ? '#ffffff' : '#000000',
    '--auth-text-muted': darkMode ? '#a0a0a0' : '#666666',
    '--auth-primary': primaryColor,
    '--auth-font': fontFamily,
    ...style,
  } as CSSProperties;

  const renderInputs = () => {
    if (isConfirming) {
      return (
        <div className="auth-field-group">
          <label htmlFor={codeId} className="sr-only">Verification Code</label>
          <input
            id={codeId}
            name="verificationCode"
            type="text"
            className={`auth-input variant-${variant}`}
            placeholder="6-Digit Verification Code"
            value={formData.verificationCode}
            onChange={handleChange}
            maxLength={6}
            aria-required="true"
            aria-invalid={!!errorMsg}
          />
          {onResendCode && (
            <button 
              type="button" 
              className="auth-text-btn" 
              onClick={() => onResendCode(formData.email)}
            >
              Didn't receive a code? Resend
            </button>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="auth-field-group">
          <label htmlFor={emailId} className="sr-only">Email Address</label>
          <input
            id={emailId}
            name="email"
            type="email"
            className={`auth-input variant-${variant}`}
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
            aria-required="true"
          />
        </div>
        
        <div className="auth-field-group auth-password-wrapper">
          <label htmlFor={passwordId} className="sr-only">Password</label>
          <input
            id={passwordId}
            name="password"
            type={showPassword ? 'text' : 'password'}
            className={`auth-input variant-${variant}`}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            aria-required="true"
          />
          <button 
            type="button" 
            className="auth-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>

        {isSignUp && (
          <div className="auth-field-group auth-password-wrapper">
            <label htmlFor={confirmPasswordId} className="sr-only">Confirm Password</label>
            <input
              id={confirmPasswordId}
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className={`auth-input variant-${variant}`}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              aria-required="true"
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div 
      className={`universal-auth-root mode-${darkMode ? 'dark' : 'light'} ${className}`} 
      style={rootStyles}
    >
      {layout === 'chaimara' ? (
        <section className="chaimara-container">
          <div className="chaimara-box">
            <div className="chaimara-left">
              <form className="chaimara-form" onSubmit={handleSubmit} noValidate>
                <h3 className="auth-title">
                  {isConfirming ? 'VERIFY' : isSignUp ? 'SIGN UP' : 'SIGN IN'}
                </h3>
                
                {errorMsg && <div className="auth-error" role="alert">{errorMsg}</div>}
                
                {renderInputs()}

                {!isSignUp && !isConfirming && onForgotPassword && (
                  <button type="button" className="auth-forgot-btn" onClick={() => onForgotPassword(formData.email)}>
                    Forgot my password
                  </button>
                )}

                <button type="submit" className={`auth-submit-btn variant-${variant}`} aria-busy={isLoading}>
                  {isLoading ? 'Processing...' : isConfirming ? 'Verify Code' : isSignUp ? 'Sign Up' : 'Log In'}
                </button>

                {!isConfirming && (
                  <>
                    <p className="auth-slogan">{isSignUp ? 'Got an account?' : 'Need an account?'}</p>
                    <button type="button" className={`auth-toggle-btn variant-${variant}`} onClick={toggleMode}>
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </>
                )}
              </form>
            </div>
            <div className="chaimara-right" style={{ backgroundImage: `url(${brandImage})` }}>
              <div className="chaimara-brand-content">
                <h2 className="chaimara-logo-text" dangerouslySetInnerHTML={{ __html: brandTitle }} />
                <h6 className="chaimara-build-text">{brandSubtitle}</h6>
                {brandLogo && <img src={brandLogo} alt="Brand Logo" className="chaimara-logo-img" />}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="prometheus-container">
          <div className="prometheus-header">
            <h1 className="auth-title">{brandTitle}</h1>
            <h2 className="auth-subtitle">{brandSubtitle}</h2>
          </div>

          <div className={`ost-container ${isSignUp ? "mode-signup" : "mode-login"}`}>
            <div className="ost-box"></div>
            <div className="ost-forms">
              <div className="ost-info-panel">
                <div className="info-item">
                  <p>Have an account?</p>
                  <button type="button" className={`auth-toggle-btn variant-${variant}`} onClick={() => setIsSignUp(false)}>Log in</button>
                </div>
                <div className="info-item">
                  <p>Need an account?</p>
                  <button type="button" className={`auth-toggle-btn variant-${variant}`} onClick={() => setIsSignUp(true)}>Sign Up</button>
                </div>
              </div>

              <form className="ost-active-form" onSubmit={handleSubmit} noValidate>
                {errorMsg && <div className="auth-error" role="alert">{errorMsg}</div>}
                {renderInputs()}
                <button type="submit" className={`auth-submit-btn variant-${variant}`} aria-busy={isLoading}>
                  {isLoading ? 'Processing...' : isConfirming ? 'Verify Code' : isSignUp ? 'Sign Up' : 'Log In'}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};