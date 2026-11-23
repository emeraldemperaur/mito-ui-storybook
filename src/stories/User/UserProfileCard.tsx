"use client";

import React, { useState, useEffect, type JSX } from 'react';
import { useGlobalUIContext } from "../Layout/GlobalUIContext";
import { Button } from '../Buttons/Button';
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  type CardDesignVariant 
} from '../Information/Card';
import type { ButtonColorOverrides } from '../../utils/Vinci';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'none';

export interface SubscriptionDetails {
  /** The current execution state of the user's billing cycle. */
  status: SubscriptionStatus;
  /** The marketing or system identifier for the active plan (e.g., 'Pro Tier', 'Enterprise'). */
  planName?: string;
  /** ISO date string representing the conclusion of the active billing period. */
  currentPeriodEnd?: string;
}


/**
 * @interface UserProfileCardProps
 * @description Strongly-typed composite props for rendering a sophisticated enterprise user profile card. 
 * Inherits all advanced physical rendering parameters from the core Card component ecosystem.
 */
export interface UserProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The user's system display name. */
  username: string;
  /** The user's primary contact and authentication email. */
  email: string;
  /** Toggles the verified trust badge. */
  isVerified: boolean;
  /** The user's hierarchical system role (e.g., 'admin', 'editor'). */
  role: string;
  /** Array of active string permissions granted to the user. */
  permissions: string[];
  /** Object containing strict billing and subscription plan states. */
  subscription: SubscriptionDetails;
  /** Optional URL for the user's profile image. Replaces the name initials if provided. */
  profileImage?: string;

  // --- TEXT & AVATAR OVERRIDES ---
  
  /** Explicit override text for the 'Verified' trust badge. @default 'Verified' */
  verifiedText?: string;
  /** Explicit override text for the 'Unverified' trust badge. @default 'Unverified' */
  unverifiedText?: string;
  /** Custom background color for the avatar wrapper when initials are displayed. */
  avatarBackgroundColor?: string;
  /** Custom text color for the avatar initials. */
  avatarTextColor?: string;
  /** Explicit override text for the 'Profile Details' section title. @default 'Profile Details' */
  profileDetails?: string;
  /** Explicit override text for the 'Subscription Protocol' label. @default 'Subscription Protocol' */
  subscriptionProtocol?: string;
  /** Explicit override text for the default 'Free Tier' subscription plan name. @default 'Free Tier' */
  freeTierText?: string;

  // --- ACTION BUTTON AESTHETIC OVERRIDES ---
  
  /** Custom color styling overrides specifically for the 'Subscribe' action button (status: none). */
  subscribeButtonOverrides?: ButtonColorOverrides;
  /** Custom color styling overrides specifically for the 'Cancel Plan' action button (status: active). */
  cancelButtonOverrides?: ButtonColorOverrides;
  /** Custom color styling overrides specifically for the 'Renew Plan' action button (status: canceled). */
  renewButtonOverrides?: ButtonColorOverrides;
  /** Custom color styling overrides specifically for the 'Update Payment' action button (status: past_due). */
  updatePaymentButtonOverrides?: ButtonColorOverrides;

  // --- AESTHETIC & DESIGN CONTROLS ---
  
  /** The architectural design system variation. @default 'material' */
  design?: CardDesignVariant;
  /** Toggles an enterprise-grade frosted glassmorphism aesthetic using backdrop filters. @default false */
  trueGlass?: boolean;
  /** Enables a tactile physical hover effect with kinetic drop-shadow transitions. @default false */
  tactile?: boolean;
  /** Dictates the severity of the tactile hover effect. @default 'medium' */
  hoverEffect?: 'subtle' | 'medium' | 'pronounced';
  /** Explicit override for the container border radius. @default '16px' */
  borderRadius?: string | number;
  /** Explicit background color override for light mode contexts. */
  backgroundColor?: string;
  /** Explicit background color override specifically for dark mode contexts. */
  darkBackgroundColor?: string;
  /** Explicit text color override for light mode contexts. */
  textColor?: string;
  /** Explicit text color override specifically for dark mode contexts. */
  darkTextColor?: string;
  /** Custom font family applied globally to the card content. */
  fontFamily?: string;
  /** Force dark mode rendering independent of the global context or system preference. @default false */
  darkMode?: boolean;
  /** Dynamic light/dark mode fallback color mapping for the active brand token. */
  darkModeColors?: { light: string; dark: string };
  /** Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. @default 1 */
  neuIntensity?: number;
  /** Neumorphic/Skeuomorphic 3D extrusion distance in pixels. @default 8 */
  elevation?: number;
  /** Global lighting angle that dictates the X and Y shadow trajectories. @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  // --- COMPOSITE LAYOUT CONTROLS ---

  /** Inject a custom ReactNode to completely replace the default left-side Avatar/Username block. */
  headerNode?: React.ReactNode;
  /** Inject a custom ReactNode as a full-width footer block, replacing the inline subscription buttons. */
  footerNode?: React.ReactNode;
  /** Visually detaches and hides the left-side profile block, rendering only the right-side body details. @default false */
  hideHeader?: boolean;
  /** Visually detaches and hides the footer actions (both inline and custom nodes). @default false */
  hideFooter?: boolean;
  /** Horizontal alignment instruction for a custom headerNode flexbox container. @default 'space-between' */
  headerJustify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  /** Horizontal alignment instruction for a custom footerNode flexbox container. @default 'flex-end' */
  footerJustify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';

  // --- ACTIONS & CALLBACKS ---
  
  /** Asynchronous execution callback fired when upgrading from a 'none' state. */
  onSubscribe?: () => Promise<void>;
  /** Asynchronous execution callback fired when terminating an 'active' state. */
  onCancelSubscription?: () => Promise<void>;
  /** Asynchronous execution callback fired when reactivating a 'canceled' state. */
  onRenewSubscription?: () => Promise<void>;
}

const getInitials = (name: string) => {
  if (!name) return '??';
  const parts = name.trim().split(/[\s._-]+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

/**
 * @component UserProfileCard
 * @description Advanced semantic composite widget for rendering user analytics, identities, and billing states. 
 * Features a Container-Query powered responsive side-by-side flex layout built tightly upon the `Card` ecosystem.
 */
export const UserProfileCard = React.forwardRef<HTMLDivElement, UserProfileCardProps>(({
  username,
  email,
  isVerified,
  role,
  permissions,
  subscription,
  profileImage,
  verifiedText = 'Verified',
  unverifiedText = 'Unverified',
  avatarBackgroundColor,
  avatarTextColor,
  profileDetails = 'Profile Details',
  subscriptionProtocol = 'Subscription Protocol',
  freeTierText = 'Free Tier',
  subscribeButtonOverrides,
  cancelButtonOverrides,
  renewButtonOverrides,
  updatePaymentButtonOverrides,
  design = 'material',
  trueGlass = false,
  tactile = false,
  hoverEffect = 'medium',
  borderRadius = '16px',
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  fontFamily = '"Bodoni Moda Variable", -apple-system, sans-serif',
  darkMode = false,
  darkModeColors,
  neuIntensity = 1,
  elevation = 8,
  lightSource = 'top-left',
  headerNode,
  footerNode,
  hideHeader = false,
  hideFooter = false,
  headerJustify = 'space-between',
  footerJustify = 'flex-end',
  onSubscribe,
  onCancelSubscription,
  onRenewSubscription,
  className = "",
  style,
  ...props
}, ref): JSX.Element => {

  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const globalContext = useGlobalUIContext();
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)';
  const isReadOnly = globalContext.formikContext?.isSubmitting || false;

  useEffect(() => setMounted(true), []);

  const handleAction = async (action?: () => Promise<void>) => {
    if (!action || isReadOnly) return;
    setIsProcessing(true);
    try { 
      await action(); 
    } catch (error) { 
      console.error('VectorSigma Execution Error (UserProfileCard):', error); 
    } finally { 
      if (mounted) setIsProcessing(false); 
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getSubscriptionDateLabel = (status: SubscriptionStatus, endDateString?: string) => {
    if (!endDateString) return '';
    
    const endDate = new Date(endDateString);
    const isPast = endDate < new Date();

    if (status === 'past_due') return 'Billing failed on: ';
    if (status === 'canceled') return isPast ? 'Ended on: ' : 'Ends on: ';
    return 'Renews on: ';
  };

  const renderSubscriptionActions = () => {
    const btnProps = {
      style: { width: '100%', fontFamily: fontFamily }, 
      isLoading: isProcessing,
      disabled: isReadOnly,
      darkMode: darkMode,
      fontFamily: fontFamily 
    };

    switch (subscription.status) {
      case 'none':
        return (
          <Button 
            variant={design} 
            backgroundColor={subscribeButtonOverrides?.backgroundColor ?? resolvedBrandColor} 
            textColor={subscribeButtonOverrides?.textColor ?? "#ffffff"} 
            darkBackgroundColor={subscribeButtonOverrides?.darkBackgroundColor}
            darkTextColor={subscribeButtonOverrides?.darkTextColor}
            hoverColor={subscribeButtonOverrides?.hoverColor}
            hoverTextColor={subscribeButtonOverrides?.hoverTextColor}
            darkHoverColor={subscribeButtonOverrides?.darkHoverColor}
            darkHoverTextColor={subscribeButtonOverrides?.darkHoverTextColor}
            onClick={() => handleAction(onSubscribe)} 
            {...btnProps}
          >
            Subscribe
          </Button>
        );
      case 'active':
        return (
          <Button 
            variant={design === 'material' ? 'outline' : design} 
            backgroundColor={cancelButtonOverrides?.backgroundColor ?? "#ef4444"} 
            darkBackgroundColor={cancelButtonOverrides?.darkBackgroundColor ?? "#dc2626"} 
            textColor={cancelButtonOverrides?.textColor ?? (design === 'outline' ? '#ef4444' : '#ffffff')}
            darkTextColor={cancelButtonOverrides?.darkTextColor}
            hoverColor={cancelButtonOverrides?.hoverColor}
            hoverTextColor={cancelButtonOverrides?.hoverTextColor}
            darkHoverColor={cancelButtonOverrides?.darkHoverColor}
            darkHoverTextColor={cancelButtonOverrides?.darkHoverTextColor}
            onClick={() => handleAction(onCancelSubscription)} 
            {...btnProps}
          >
            Cancel Plan
          </Button>
        );
      case 'canceled':
        return (
          <Button 
            variant={design} 
            backgroundColor={renewButtonOverrides?.backgroundColor ?? resolvedBrandColor} 
            textColor={renewButtonOverrides?.textColor ?? "#ffffff"} 
            darkBackgroundColor={renewButtonOverrides?.darkBackgroundColor}
            darkTextColor={renewButtonOverrides?.darkTextColor}
            hoverColor={renewButtonOverrides?.hoverColor}
            hoverTextColor={renewButtonOverrides?.hoverTextColor}
            darkHoverColor={renewButtonOverrides?.darkHoverColor}
            darkHoverTextColor={renewButtonOverrides?.darkHoverTextColor}
            onClick={() => handleAction(onRenewSubscription)} 
            {...btnProps}
          >
            Renew Plan
          </Button>
        );
      case 'past_due':
        return (
          <Button 
            variant={design} 
            backgroundColor={updatePaymentButtonOverrides?.backgroundColor ?? "#ef4444"} 
            textColor={updatePaymentButtonOverrides?.textColor ?? "#ffffff"} 
            darkBackgroundColor={updatePaymentButtonOverrides?.darkBackgroundColor}
            darkTextColor={updatePaymentButtonOverrides?.darkTextColor}
            hoverColor={updatePaymentButtonOverrides?.hoverColor}
            hoverTextColor={updatePaymentButtonOverrides?.hoverTextColor}
            darkHoverColor={updatePaymentButtonOverrides?.darkHoverColor}
            darkHoverTextColor={updatePaymentButtonOverrides?.darkHoverTextColor}
            onClick={() => handleAction(onSubscribe)} 
            {...btnProps}
          >
            Update Payment
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      ref={ref}
      design={design}
      trueGlass={trueGlass}
      tactile={tactile}
      hoverEffect={hoverEffect}
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
      darkBackgroundColor={darkBackgroundColor}
      textColor={textColor}
      darkTextColor={darkTextColor}
      fontFamily={fontFamily}
      darkMode={darkMode}
      darkModeColors={darkModeColors}
      neuIntensity={neuIntensity}
      elevation={elevation}
      lightSource={lightSource}
      className={`mito-profile-container ${className}`}
      style={style}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-profile-container { 
          --internal-border-offset: var(--mito-card-border-width, 1px);
          container-type: inline-size; 
        }
        
        .mito-profile-layout { display: flex; flex-direction: column; width: 100%; height: 100%; }

        .mito-profile-left {
          background-color: ${darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'};
          padding: 2rem 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center;
          border-bottom: 1px solid var(--mito-card-divider);
          border-top-left-radius: calc(var(--mito-card-radius, 0.75rem) - var(--internal-border-offset));
          border-top-right-radius: calc(var(--mito-card-radius, 0.75rem) - var(--internal-border-offset));
          border-bottom-left-radius: 0;
        }

        .mito-card-neumorphic .mito-profile-left { background-color: transparent; border: none; }

        .mito-profile-avatar-wrapper {
          width: 5.5rem; height: 5.5rem; border-radius: 50%;
          background-color: var(--avatar-bg, var(--ui-brand-color, #2563eb)); 
          color: var(--avatar-text, #ffffff);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.75rem; font-weight: 600; margin-bottom: 1rem;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden; flex-shrink: 0;
        }
        
        .mito-profile-avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .mito-profile-username { font-size: 1.25rem; font-weight: 700; margin: 0; text-align: center; width: 100%; overflow-wrap: break-word; word-wrap: break-word; hyphens: auto; }
        .mito-profile-subtitle { font-size: 0.875rem; opacity: 0.7; margin-top: 0.25rem; text-transform: capitalize; text-align: center; }

        .mito-profile-right { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; min-width: 0; }

        .mito-profile-section-title { font-size: 1.125rem; font-weight: 600; border-bottom: 1px solid var(--mito-card-divider); padding-bottom: 0.5rem; margin-top: 0; margin-bottom: 1.25rem; }
        .mito-card-neumorphic .mito-profile-section-title { border-bottom: 1px dashed var(--mito-card-divider); }

        .mito-profile-details-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; margin: 0; }
        .mito-profile-details-grid > div { min-width: 0; }

        .mito-profile-detail-full { grid-column: 1 / -1; }
        .mito-profile-detail-label { font-size: 0.875rem; font-weight: 500; opacity: 0.7; margin-bottom: 0.25rem; display: block; word-break: normal; white-space: normal; }
        
        .mito-profile-detail-value { margin: 0; font-size: 0.875rem; font-weight: 500; overflow-wrap: break-word; word-wrap: break-word; hyphens: auto; }

        .mito-badge { display: inline-flex; align-items: center; padding: 0.125rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
        .mito-badge-success { background-color: #dcfce7; color: #166534; }
        .mito-badge-warning { background-color: #fef08a; color: #854d0e; }
        
        .mito-badge-neutral { 
          background-color: rgba(243, 244, 246, 0.6); 
          color: #374151; 
          border: 1px solid rgba(107, 114, 128, 0.15); 
          border-radius: 0.375rem; 
          padding: 0.25rem 0.5rem; 
          font-weight: 500; 
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .mito-card-dark .mito-badge-success { background-color: #064e3b; color: #34d399; }
        .mito-card-dark .mito-badge-warning { background-color: #713f12; color: #fde047; }
        .mito-card-dark .mito-badge-neutral { 
          background-color: rgba(55, 65, 81, 0.5); 
          color: #e5e7eb; 
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .mito-sub-section {
          background-color: ${darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'};
          border-radius: 0.5rem; padding: 1.25rem; border: 1px solid var(--mito-card-divider); margin-top: 0.5rem;
        }
        
        .mito-profile-username, 
        .mito-profile-subtitle, 
        .mito-profile-section-title, 
        .mito-profile-detail-label, 
        .mito-profile-detail-value,
        .mito-badge,
        .mito-sub-status { 
          font-family: inherit; 
        }
        
        .mito-card-neumorphic .mito-sub-section {
          background-color: transparent; border: none;
          box-shadow: inset 4px 4px 8px var(--mito-card-shadow-dark), inset -4px -4px 8px var(--mito-card-shadow-light);
        }

        .mito-sub-content { display: flex; flex-direction: column; gap: 1rem; }
        .mito-sub-actions { width: 100%; display: flex; flex-shrink: 0; margin-top: 0.5rem; }
        .mito-sub-actions > * { width: 100%; }
        
        .mito-sub-status { margin-left: 0.5rem; font-size: 0.75rem; font-weight: 600; padding: 0.125rem 0.5rem; border-radius: 9999px; text-transform: capitalize; }
        .mito-sub-active { background-color: #dcfce7; color: #166534; }
        .mito-sub-past_due { background-color: #fee2e2; color: #b91c1c; }
        .mito-sub-canceled { background-color: #f3f4f6; color: #374151; }
        .mito-card-dark .mito-sub-active { background-color: #064e3b; color: #34d399; }
        .mito-card-dark .mito-sub-past_due { background-color: #7f1d1d; color: #f87171; }
        .mito-card-dark .mito-sub-canceled { background-color: #374151; color: #d1d5db; }

        @container (min-width: 640px) {
          .mito-profile-layout { flex-direction: row; }
          .mito-profile-left { 
            width: 35%; padding: 2.5rem 2rem; border-bottom: none; border-right: 1px solid var(--mito-card-divider); 
            border-top-right-radius: 0;
            border-bottom-left-radius: calc(var(--mito-card-radius, 0.75rem) - var(--internal-border-offset));
          }
          .mito-profile-right { width: 65%; padding: 2rem; }
          .mito-profile-avatar-wrapper { width: 6.5rem; height: 6.5rem; font-size: 2rem; }
          .mito-profile-details-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
          .mito-sub-content { flex-direction: row; align-items: center; justify-content: space-between; } 
          .mito-sub-actions { width: auto; display: block; margin-top: 0; }
          .mito-sub-actions > * { width: auto; }
        }
      `}} />

      {!hideHeader && headerNode && (
        <CardHeader justify={headerJustify}>{headerNode}</CardHeader>
      )}

      <div className="mito-profile-layout">
        
        {!hideHeader && !headerNode && (
          <div className="mito-profile-left">
            <div 
              className="mito-profile-avatar-wrapper" 
              aria-hidden="true"
              style={{
                ...(avatarBackgroundColor ? { '--avatar-bg': avatarBackgroundColor } : {}),
                ...(avatarTextColor ? { '--avatar-text': avatarTextColor } : {})
              } as React.CSSProperties}
            >
              {profileImage ? (
                <img src={profileImage} alt={`${username}'s avatar`} className="mito-profile-avatar-img" />
              ) : (
                getInitials(username)
              )}
            </div>
            <h2 className="mito-profile-username">{username}</h2>
            <p className="mito-profile-subtitle">{role} Account</p>
            
            <div style={{ marginTop: '1rem' }}>
                <span className={`mito-badge ${isVerified ? 'mito-badge-success' : 'mito-badge-warning'}`}>
                {isVerified ? verifiedText : unverifiedText}
              </span>
            </div>
          </div>
        )}

        <div className="mito-profile-right">
          <h3 className="mito-profile-section-title">{profileDetails}</h3>
          <dl className="mito-profile-details-grid">
            
            <div className="mito-profile-detail-full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 0 }}>
              <div style={{ minWidth: 0 }}>
                <dt className="mito-profile-detail-label">Email Address</dt>
                <dd className="mito-profile-detail-value">{email}</dd>
              </div>
            </div>

            <div>
              <dt className="mito-profile-detail-label">Role</dt>
              <dd className="mito-profile-detail-value" style={{ textTransform: 'capitalize' }}>{role}</dd>
            </div>

            <div>
              <dt className="mito-profile-detail-label">Permissions</dt>
              <dd style={{ margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {permissions.map((perm) => (
                  <span key={perm} className="mito-badge-neutral">{perm}</span>
                ))}
                {permissions.length === 0 && (
                  <span style={{ opacity: 0.6, fontSize: '0.875rem', fontStyle: 'italic' }}>None</span>
                )}
              </dd>
            </div>

            <div className="mito-profile-detail-full mito-sub-section">
              <div className="mito-sub-content">
                <div style={{ minWidth: 0 }}>
                  <dt className="mito-profile-detail-label">{subscriptionProtocol}</dt>
                  {subscription.status === 'none' ? (
                    <dd className="mito-profile-detail-value" style={{ fontWeight: 700 }}>{freeTierText}</dd>
                  ) : (
                    <dd className="mito-profile-detail-value" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span>{subscription.planName}</span>
                      <span className={`mito-sub-status mito-sub-${subscription.status}`} style={{ marginLeft: 0 }}>
                        {subscription.status.replace('_', ' ')}
                      </span>
                    </dd>
                  )}
                  {subscription.currentPeriodEnd && (
                    <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: '0.35rem 0 0 0' }}>
                      {getSubscriptionDateLabel(subscription.status, subscription.currentPeriodEnd)}
                      <strong>{formatDate(subscription.currentPeriodEnd)}</strong>
                    </p>
                  )}
                </div>
                
                {!hideFooter && !footerNode && (
                  <div className="mito-sub-actions">
                    {renderSubscriptionActions()}
                  </div>
                )}
              </div>
            </div>

          </dl>
        </div>
      </div>

      {!hideFooter && footerNode && (
        <CardFooter justify={footerJustify}>{footerNode}</CardFooter>
      )}
    </Card>
  );
});

UserProfileCard.displayName = 'UserProfileCard';