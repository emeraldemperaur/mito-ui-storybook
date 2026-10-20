"use client";

import React, { useRef, useState, useEffect, type JSX } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'none';

export interface SubscriptionDetails {
  status: SubscriptionStatus;
  planName?: string;
  currentPeriodEnd?: string;
}

export interface UserProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
  permissions: string[];
  subscription: SubscriptionDetails;
  design?: DesignVariant;
  asChild?: boolean;
  backgroundColor?: string;
  fontFamily?: string;
  darkMode?: boolean;
  darkModeColors?: { light: string; dark: string };
  neuIntensity?: number;
  elevation?: number;
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onSubscribe?: () => Promise<void>;
  onCancelSubscription?: () => Promise<void>;
  onRenewSubscription?: () => Promise<void>;
}

const getInitials = (name: string) => {
  if (!name) return '??';
  const parts = name.split(/[\s._-]+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const UserProfileCard = React.forwardRef<HTMLDivElement, UserProfileCardProps>(({
  username,
  email,
  isVerified,
  role,
  permissions,
  subscription,
  design = 'material',
  asChild = false,
  backgroundColor,
  fontFamily = '"Bodoni Moda Variable", -apple-system, sans-serif',
  darkMode = false,
  darkModeColors,
  neuIntensity = 1,
  elevation = 8,
  lightSource = 'top-left',
  onSubscribe,
  onCancelSubscription,
  onRenewSubscription,
  className = "",
  style,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const globalContext = useGlobalUIContext();
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)';
  const isReadOnly = globalContext.formikContext?.isSubmitting || false;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement);
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -15 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 15 * neuIntensity);

      setNeuVars({
        '--card-bg': parentBg,
        '--card-shadow-dark': shadowDark,
        '--card-shadow-light': shadowLight,
        '--card-x': `${x}px`,
        '--card-y': `${y}px`,
        '--card-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor]);

  const handleAction = async (action?: () => Promise<void>) => {
    if (!action || isReadOnly) return;
    setIsProcessing(true);
    try { await action(); } catch (error) { console.error('API error:', error); } finally { if (mounted) setIsProcessing(false); }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const cssVariables = {
    '--ui-brand-color': resolvedBrandColor,
    '--card-font': fontFamily,
    '--bg-main': backgroundColor || (darkMode ? '#1f2937' : '#ffffff'),
    '--bg-subtle': darkMode ? '#111827' : '#f9fafb',
    '--border-color': darkMode ? '#374151' : '#e5e7eb',
    '--text-primary': darkMode ? '#f9fafb' : '#111827',
    '--text-secondary': darkMode ? '#9ca3af' : '#6b7280',
    '--text-muted': darkMode ? '#6b7280' : '#9ca3af',
    '--badge-bg': darkMode ? '#374151' : '#f3f4f6',
    '--badge-text': darkMode ? '#d1d5db' : '#374151',
    '--btn-secondary-bg': darkMode ? '#1f2937' : '#ffffff',
    '--btn-secondary-hover': darkMode ? '#374151' : '#f9fafb',
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "div";

  return (
    <Comp 
      ref={(node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`v-profile-card v-profile-${design} ${className}`}
      style={{ ...cssVariables, ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .v-profile-card { width: 100%; max-width: 48rem; margin: 0 auto; display: flex; flex-direction: column; font-family: var(--card-font); transition: all 0.3s ease; box-sizing: border-box; }
        @media (min-width: 640px) { .v-profile-card { flex-direction: row; } }
        .v-profile-outline { background-color: var(--bg-main); border-radius: 1rem; border: 1px solid var(--border-color); }
        .v-profile-material { background-color: var(--bg-main); border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid var(--border-color); }
        .v-profile-neumorphic { background-color: var(--card-bg); border-radius: 1.25rem; border: none; box-shadow: var(--card-x) var(--card-y) var(--card-blur) var(--card-shadow-dark), calc(var(--card-x) * -1) calc(var(--card-y) * -1) var(--card-blur) var(--card-shadow-light); }
        .v-profile-neumorphic .v-profile-card-left { background-color: transparent; border: none; }
        .v-profile-neumorphic .v-subscription-section { background-color: var(--card-bg); border: none; box-shadow: inset 4px 4px 8px var(--card-shadow-dark), inset -4px -4px 8px var(--card-shadow-light); }
        .v-profile-card-left { background-color: var(--bg-subtle); padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; border-bottom: 1px solid var(--border-color); border-top-left-radius: inherit; }
        @media (min-width: 640px) { .v-profile-card-left { width: 33.33%; border-bottom: none; border-right: 1px solid var(--border-color); border-bottom-left-radius: inherit; } }
        .v-profile-avatar { width: 6rem; height: 6rem; border-radius: 50%; background-color: var(--ui-brand-color); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.875rem; font-weight: 600; margin-bottom: 1rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
        .v-profile-username { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin: 0; text-align: center; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .v-profile-subtitle { font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem; }
        .v-profile-card-right { padding: 2rem; flex-grow: 1; }
        @media (min-width: 640px) { .v-profile-card-right { width: 66.66%; } }
        .v-profile-section-title { font-size: 1.125rem; font-weight: 600; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-top: 0; margin-bottom: 1.5rem; }
        .v-profile-neumorphic .v-profile-section-title { border-bottom: 1px dashed var(--border-color); }
        .v-profile-details-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin: 0; }
        @media (min-width: 640px) { .v-profile-details-grid { grid-template-columns: repeat(2, 1fr); } }
        .v-profile-detail-full { grid-column: 1 / -1; }
        .v-profile-detail-label { font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.25rem; display: block; }
        .v-profile-detail-value { margin: 0; font-size: 0.875rem; color: var(--text-primary); font-weight: 500; }
        .v-status-badge { display: inline-flex; align-items: center; padding: 0.125rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .v-status-verified { background-color: #dcfce7; color: #166534; }
        .v-status-unverified { background-color: #fef08a; color: #854d0e; }
        .dark .v-status-verified { background-color: #064e3b; color: #34d399; }
        .dark .v-status-unverified { background-color: #713f12; color: #fde047; }
        .v-permission-badge { display: inline-flex; align-items: center; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 500; background-color: var(--badge-bg); color: var(--badge-text); border: 1px solid var(--border-color); }
        .v-subscription-section { background-color: var(--bg-subtle); border-radius: 0.5rem; padding: 1rem; border: 1px solid var(--border-color); margin-top: 0.5rem; }
        .v-subscription-content { display: flex; flex-direction: column; gap: 1rem; }
        @media (min-width: 640px) { .v-subscription-content { flex-direction: row; align-items: center; justify-content: space-between; } }
        .v-sub-status { margin-left: 0.5rem; font-size: 0.75rem; font-weight: 600; padding: 0.125rem 0.5rem; border-radius: 9999px; text-transform: capitalize; }
        .v-sub-active { background-color: #dcfce7; color: #166534; }
        .v-sub-past_due { background-color: #fee2e2; color: #b91c1c; }
        .v-sub-canceled { background-color: var(--badge-bg); color: var(--badge-text); }
        .dark .v-sub-active { background-color: #064e3b; color: #34d399; }
        .dark .v-sub-past_due { background-color: #7f1d1d; color: #f87171; }
        .v-btn { padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; display: inline-flex; align-items: center; justify-content: center; }
        .v-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .v-btn-primary { background-color: var(--ui-brand-color); color: white; }
        .v-btn-primary:hover:not(:disabled) { filter: brightness(0.9); }
        .v-btn-secondary { background-color: var(--btn-secondary-bg); color: var(--ui-brand-color); border: 1px solid var(--border-color); }
        .v-btn-secondary:hover:not(:disabled) { background-color: var(--btn-secondary-hover); }
        .v-btn-danger { background-color: var(--btn-secondary-bg); color: #ef4444; border: 1px solid var(--border-color); }
        .v-btn-danger:hover:not(:disabled) { background-color: var(--btn-secondary-hover); }
        .v-btn-danger-solid { background-color: #dc2626; color: white; }
        .v-btn-danger-solid:hover:not(:disabled) { background-color: #b91c1c; }
      `}} />

      <div className="v-profile-card-left">
        <div className="v-profile-avatar" aria-hidden="true">{getInitials(username)}</div>
        <h2 className="v-profile-username">{username}</h2>
        <p className="v-profile-subtitle">Cognito User</p>
      </div>

      <div className="v-profile-card-right">
        <h3 className="v-profile-section-title">Profile Details</h3>
        <dl className="v-profile-details-grid">
          <div className="v-profile-detail-full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <dt className="v-profile-detail-label">Email Address</dt>
              <dd className="v-profile-detail-value">{email}</dd>
            </div>
            <div>
              <span className={`v-status-badge ${isVerified ? 'v-status-verified' : 'v-status-unverified'}`}>
                {isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
          <div>
            <dt className="v-profile-detail-label">Role</dt>
            <dd className="v-profile-detail-value" style={{ textTransform: 'capitalize' }}>{role}</dd>
          </div>
          <div>
            <dt className="v-profile-detail-label">Permissions</dt>
            <dd style={{ margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {permissions.map((perm) => (
                <span key={perm} className="v-permission-badge">{perm}</span>
              ))}
              {permissions.length === 0 && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>None</span>
              )}
            </dd>
          </div>
          <div className="v-profile-detail-full v-subscription-section">
            <div className="v-subscription-content">
              <div>
                <dt className="v-profile-detail-label">Subscription Plan</dt>
                {subscription.status === 'none' ? (
                  <dd className="v-profile-detail-value" style={{ fontWeight: 700 }}>Free Tier</dd>
                ) : (
                  <dd className="v-profile-detail-value" style={{ fontWeight: 700 }}>
                    {subscription.planName}
                    <span className={`v-sub-status v-sub-${subscription.status}`}>
                      {subscription.status.replace('_', ' ')}
                    </span>
                  </dd>
                )}
                {subscription.currentPeriodEnd && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    {subscription.status === 'canceled' ? 'Ends on: ' : 'Renews on: '}
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                {subscription.status === 'none' && (
                  <button onClick={() => handleAction(onSubscribe)} disabled={isProcessing || isReadOnly} className="v-btn v-btn-primary">
                    {isProcessing ? 'Processing...' : 'Subscribe'}
                  </button>
                )}
                {subscription.status === 'active' && (
                  <button onClick={() => handleAction(onCancelSubscription)} disabled={isProcessing || isReadOnly} className="v-btn v-btn-danger">
                    {isProcessing ? 'Processing...' : 'Cancel Plan'}
                  </button>
                )}
                {subscription.status === 'canceled' && (
                  <button onClick={() => handleAction(onRenewSubscription)} disabled={isProcessing || isReadOnly} className="v-btn v-btn-secondary">
                    {isProcessing ? 'Processing...' : 'Renew Plan'}
                  </button>
                )}
                {subscription.status === 'past_due' && (
                  <button onClick={() => handleAction(onSubscribe)} disabled={isProcessing || isReadOnly} className="v-btn v-btn-danger-solid">
                    {isProcessing ? 'Processing...' : 'Update Payment'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </dl>
      </div>
    </Comp>
  );
});

UserProfileCard.displayName = 'UserProfileCard';