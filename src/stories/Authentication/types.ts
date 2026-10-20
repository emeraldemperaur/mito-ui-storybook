import { CSSProperties } from 'react';

/**
 * Defines the layout structure of the authentication component.
 * @typedef {'prometheus' | 'chaimara'} AuthLayout
 */
export type AuthLayout = 'prometheus' | 'chaimara';

/**
 * Defines the aesthetic design system variant of the inputs and buttons.
 * @typedef {'material' | 'outline' | 'neumorphic'} AuthVariant
 */
export type AuthVariant = 'material' | 'outline' | 'neumorphic';

/**
 * Standardized credentials payload emitted by the UI component.
 */
export interface AuthCredentials {
  email: string;
  password?: string;
  confirmPassword?: string;
  verificationCode?: string;
}

/**
 * Expected response from authentication handlers to dictate UI state transitions.
 */
export interface AuthResponse {
  success: boolean;
  /** Set to true if the flow requires a verification code next (e.g., MFA or Email Confirm) */
  requiresVerification?: boolean;
  error?: string;
}

/**
 * Props for the Universal Authentication UI Component.
 * Extensively documented to provide deep context for LLMs and MCP servers.
 */
export interface AuthenticationUIProps {
  /** The architectural layout structure to render. */
  layout?: AuthLayout;
  /** The design system variant for form elements. */
  variant?: AuthVariant;
  /** Toggles dark mode vs light mode variables natively. */
  darkMode?: boolean;

  /** Enables the verification code input step during the Sign-In flow (e.g., MFA). */
  signInVerificationCode?: boolean;
  /** Enables the verification code input step during the Sign-Up flow (e.g., Email Confirmation). */
  signUpVerificationCode?: boolean;

  /** Custom branding image (Used on the right side of Chaimara layout). */
  brandImage?: string;
  /** Custom developer/brand logo. */
  brandLogo?: string;
  /** Brand Name or Title. */
  brandTitle?: string;
  /** Custom sub-slogan. */
  brandSubtitle?: string;

  /** Global font family override. */
  fontFamily?: string;
  /** Root background color (critical for calculating accurate Neumorphic shadows). */
  backgroundColor?: string;
  /** Primary brand color for buttons and highlights. */
  primaryColor?: string;

  /** Async handler triggered upon Sign In submission. */
  onSignIn: (credentials: AuthCredentials) => Promise<AuthResponse>;
  /** Async handler triggered upon Sign Up submission. */
  onSignUp: (credentials: AuthCredentials) => Promise<AuthResponse>;
  /** Async handler triggered upon Verification Code submission. */
  onVerifyCode: (credentials: AuthCredentials) => Promise<AuthResponse>;
  /** Async handler triggered when requesting a code resend. */
  onResendCode?: (email: string) => Promise<void>;
  /** Async handler for forgot password flows. */
  onForgotPassword?: (email: string) => Promise<void>;

  /** Optional custom CSS class for the root container. */
  className?: string;
  /** Optional custom inline styles. */
  style?: CSSProperties;
}