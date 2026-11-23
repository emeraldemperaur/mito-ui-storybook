import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UserProfileCard, type UserProfileCardProps, type SubscriptionStatus } from './UserProfileCard';
import { Button } from '../Buttons/Button'; 
import '../../styles/fonts.scss';

// Formally declare virtual sub-component props to flatten complex objects for superior Storybook DX
export interface UserProfileCardStoryProps extends UserProfileCardProps {
  subStatus?: SubscriptionStatus;
  subPlanName?: string;
  subCurrentPeriodEnd?: number;
  subscribeBtnBg?: string;
  subscribeBtnText?: string;
  cancelBtnBg?: string;
  cancelBtnText?: string;
  renewBtnBg?: string;
  renewBtnText?: string;
  updateBtnBg?: string;
  updateBtnText?: string;
}

/**
 * The `UserProfileCard` is an advanced semantic widget tailored for rendering user analytics, identities, and billing states.
 * It is built tightly upon the `Card` component ecosystem, natively inheriting powerful physical rendering paradigms including 3D lighting, trueGlass glassmorphism, tactile hovers, and strict dark mode enforcement.
 */
const meta: Meta<UserProfileCardStoryProps> = {
  title: 'Identity/UserProfileCard',
  component: UserProfileCard as React.ComponentType<any>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded', 
    docs: {
      story: { inline: true },
      description: {
        component: 'Renders a comprehensive enterprise profile card for users. It processes complex `subscription` states internally to automatically render contextual call-to-action buttons via robust asynchronous callback props. The layout uses pure CSS Container Queries to fluidly shift from a stacked column on mobile to a side-by-side flex layout on wider screens.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // UNIVERSAL ATTRIBUTES (Inherited from Card)
    // ----------------------------------------------------------------------
    id: {
      control: 'text',
      description: 'Unique identifier for the DOM element, essential for strict WCAG ARIA linking.',
      table: { category: 'Universal Attributes', type: { summary: 'string' } }
    },
    className: {
      control: 'text',
      description: 'Standard CSS class name appended directly to the element.',
      table: { category: 'Universal Attributes', type: { summary: 'string' } }
    },
    style: {
      control: 'object',
      description: 'Inline React CSS properties applied to the element.',
      table: { category: 'Universal Attributes', type: { summary: 'React.CSSProperties' } }
    },

    // ----------------------------------------------------------------------
    // IDENTITY DATA
    // ----------------------------------------------------------------------
    username: {
      control: 'text',
      description: "The user's system display name. If `profileImage` is absent, the first two initials are automatically parsed for the avatar.",
      table: { category: 'Identity & Auth', type: { summary: 'string' } }
    },
    email: {
      control: 'text',
      description: "The user's primary contact and authentication email.",
      table: { category: 'Identity & Auth', type: { summary: 'string' } }
    },
    isVerified: {
      control: 'boolean',
      description: 'Toggles the verified trust badge in the header block.',
      table: { category: 'Identity & Auth', type: { summary: 'boolean' } }
    },
    role: {
      control: 'text',
      description: "The user's hierarchical system role (e.g., 'Admin', 'Editor').",
      table: { category: 'Identity & Auth', type: { summary: 'string' } }
    },
    permissions: {
      control: 'inline-check',
      options: ['admin:full', 'cybertron:access', 'matrix:wield', 'recon:read', 'comms:radio', 'flight:unrestricted', 'smash:all', 'audio:intercept'],
      description: 'Array of active string permissions granted to the user. Mapped to an inline-check for DX to avoid raw JSON array entry.',
      table: { category: 'Identity & Auth', type: { summary: 'string[]' } }
    },
    profileImage: {
      control: 'text',
      description: "Optional URL for the user's profile image. Replaces the auto-generated name initials.",
      table: { category: 'Identity & Auth', type: { summary: 'string' } }
    },
    avatarBackgroundColor: {
      control: 'color',
      description: "Custom background color for the avatar wrapper when initials are displayed.",
      table: { category: 'Identity & Auth', type: { summary: 'string' } }
    },
    avatarTextColor: {
      control: 'color',
      description: "Custom text color for the avatar initials.",
      table: { category: 'Identity & Auth', type: { summary: 'string' } }
    },

    // ----------------------------------------------------------------------
    // TEXT LOCALIZATION OVERRIDES
    // ----------------------------------------------------------------------
    verifiedText: {
      control: 'text',
      description: "Explicit override text for the 'Verified' trust badge.",
      table: { category: 'Text Localization Overrides', defaultValue: { summary: "'Verified'" }, type: { summary: 'string' } }
    },
    unverifiedText: {
      control: 'text',
      description: "Explicit override text for the 'Unverified' trust badge.",
      table: { category: 'Text Localization Overrides', defaultValue: { summary: "'Unverified'" }, type: { summary: 'string' } }
    },
    profileDetails: {
      control: 'text',
      description: "Explicit override text for the 'Profile Details' section title.",
      table: { category: 'Text Localization Overrides', defaultValue: { summary: "'Profile Details'" }, type: { summary: 'string' } }
    },
    subscriptionProtocol: {
      control: 'text',
      description: "Explicit override text for the 'Subscription Protocol' label.",
      table: { category: 'Text Localization Overrides', defaultValue: { summary: "'Subscription Protocol'" }, type: { summary: 'string' } }
    },
    freeTierText: {
      control: 'text',
      description: "Explicit override text for the default 'Free Tier' subscription plan name (when status is 'none').",
      table: { category: 'Text Localization Overrides', defaultValue: { summary: "'Free Tier'" }, type: { summary: 'string' } }
    },

    // ----------------------------------------------------------------------
    // SUBSCRIPTION STATE (VIRTUAL MAPPING)
    // ----------------------------------------------------------------------
    subscription: {
      control: false,
      description: 'Object containing strict billing and subscription plan states.',
      table: { category: 'Subscription & Billing', type: { summary: 'SubscriptionDetails' } }
    },
    subStatus: {
      name: 'subscription.status',
      control: 'select',
      options: ['active', 'canceled', 'past_due', 'none'],
      description: 'Virtual control mapping to `subscription.status` to bypass raw JSON object editors. Works in tandem with event handlers (`onSubscribe`, `onCancelSubscription`, `onRenewSubscription`) for seamless integration with payment platforms like Stripe.',
      table: { category: 'Subscription & Billing', type: { summary: "'active' | 'canceled' | 'past_due' | 'none'" } }
    },
    subPlanName: {
      name: 'subscription.planName',
      control: 'text',
      description: 'Virtual control mapping to `subscription.planName`.',
      table: { category: 'Subscription & Billing', type: { summary: 'string' } }
    },
    subCurrentPeriodEnd: {
      name: 'subscription.currentPeriodEnd',
      control: 'date',
      description: 'Virtual datepicker mapping to `subscription.currentPeriodEnd`. Converts UNIX timestamp to ISO string internally.',
      table: { category: 'Subscription & Billing', type: { summary: 'string' } }
    },

    // ----------------------------------------------------------------------
    // ACTION BUTTON OVERRIDES (VIRTUAL MAPPING)
    // ----------------------------------------------------------------------
    subscribeButtonOverrides: { control: false, table: { category: 'Action Button Overrides' } },
    cancelButtonOverrides: { control: false, table: { category: 'Action Button Overrides' } },
    renewButtonOverrides: { control: false, table: { category: 'Action Button Overrides' } },
    updatePaymentButtonOverrides: { control: false, table: { category: 'Action Button Overrides' } },
    
    subscribeBtnBg: { name: 'subscribeButtonOverrides.backgroundColor', control: 'color', description: 'Background color override for the Subscribe button.', table: { category: 'Action Button Overrides' } },
    subscribeBtnText: { name: 'subscribeButtonOverrides.textColor', control: 'color', description: 'Text color override for the Subscribe button.', table: { category: 'Action Button Overrides' } },
    
    cancelBtnBg: { name: 'cancelButtonOverrides.backgroundColor', control: 'color', description: 'Background color override for the Cancel Plan button.', table: { category: 'Action Button Overrides' } },
    cancelBtnText: { name: 'cancelButtonOverrides.textColor', control: 'color', description: 'Text color override for the Cancel Plan button.', table: { category: 'Action Button Overrides' } },
    
    renewBtnBg: { name: 'renewButtonOverrides.backgroundColor', control: 'color', description: 'Background color override for the Renew Plan button.', table: { category: 'Action Button Overrides' } },
    renewBtnText: { name: 'renewButtonOverrides.textColor', control: 'color', description: 'Text color override for the Renew Plan button.', table: { category: 'Action Button Overrides' } },
    
    updateBtnBg: { name: 'updatePaymentButtonOverrides.backgroundColor', control: 'color', description: 'Background color override for the Update Payment button.', table: { category: 'Action Button Overrides' } },
    updateBtnText: { name: 'updatePaymentButtonOverrides.textColor', control: 'color', description: 'Text color override for the Update Payment button.', table: { category: 'Action Button Overrides' } },

    // ----------------------------------------------------------------------
    // STRUCTURAL & LAYOUT INHERITANCE (CARD PROPS)
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'The architectural design system variation inherited from Card.',
      table: { 
        category: 'Design Architecture', 
        defaultValue: { summary: 'material' },
        type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" }
      }
    },
    trueGlass: {
      control: 'boolean',
      description: 'Toggles an enterprise-grade frosted glassmorphism aesthetic using backdrop filters.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    tactile: {
      control: 'boolean',
      description: 'Enables a tactile physical hover effect with kinetic drop-shadow transitions.',
      table: { category: 'Interactions', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    hoverEffect: {
      control: 'select',
      options: ['subtle', 'medium', 'pronounced'],
      description: 'Dictates the severity of the tactile hover effect.',
      table: { 
        category: 'Interactions', 
        defaultValue: { summary: 'medium' },
        type: { summary: "'subtle' | 'medium' | 'pronounced'" }
      }
    },
    borderRadius: { 
      control: 'text', 
      description: "Explicit override for the container's border radius.",
      table: { category: 'Dimensions', defaultValue: { summary: '16px' }, type: { summary: 'string | number' } } 
    },
    fontFamily: { 
      control: 'text', 
      description: 'Custom font family applied globally to the card content.',
      table: { category: 'Typography', defaultValue: { summary: '"Bodoni Moda Variable", -apple-system, sans-serif' }, type: { summary: 'string' } } 
    },

    // ----------------------------------------------------------------------
    // THEMING INHERITANCE
    // ----------------------------------------------------------------------
    darkMode: {
      control: 'boolean',
      description: 'Forces dark mode rendering independent of the global context.',
      table: { category: 'Theming: Global', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    darkModeColors: {
      control: 'object',
      description: 'Dynamic light/dark mode fallback color mapping for the active brand token.',
      table: { category: 'Theming: Global', type: { summary: '{ light: string; dark: string }' } }
    },
    backgroundColor: { 
      control: 'color', 
      description: 'Explicit background color override for light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } } 
    },
    textColor: { 
      control: 'color', 
      description: 'Explicit text color override for light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } } 
    },
    darkBackgroundColor: { 
      control: 'color', 
      description: 'Explicit background color override specifically for dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } 
    },
    darkTextColor: { 
      control: 'color', 
      description: 'Explicit text color override specifically for dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } 
    },

    // ----------------------------------------------------------------------
    // 3D EXTRUSION INHERITANCE
    // ----------------------------------------------------------------------
    elevation: {
      control: { type: 'range', min: 1, max: 24, step: 1 },
      description: 'Neumorphic/Skeuomorphic 3D extrusion distance in pixels.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '8' }, type: { summary: 'number' } }
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Multiplier for Neumorphic shadow intensity to ensure WCAG contrast.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '1' }, type: { summary: 'number' } }
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Global lighting angle for shadow trajectories.',
      table: { 
        category: '3D Extrusion (Neu/Skeuo)', 
        defaultValue: { summary: 'top-left' },
        type: { summary: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'" }
      }
    },

    // ----------------------------------------------------------------------
    // COMPOSITE LAYOUT CONTROL
    // ----------------------------------------------------------------------
    hideHeader: {
      control: 'boolean',
      description: 'Visually detaches and hides the left-side profile block, rendering only the right-side body details.',
      table: { category: 'Layout Modifiers', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    hideFooter: {
      control: 'boolean',
      description: 'Visually detaches and hides the footer actions (both inline and custom nodes).',
      table: { category: 'Layout Modifiers', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    headerJustify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
      description: 'Horizontal alignment instruction for a custom headerNode flexbox container.',
      table: { category: 'Layout Modifiers', defaultValue: { summary: 'space-between' }, type: { summary: "'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'" } }
    },
    footerJustify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
      description: 'Horizontal alignment instruction for a custom footerNode flexbox container.',
      table: { category: 'Layout Modifiers', defaultValue: { summary: 'flex-end' }, type: { summary: "'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'" } }
    },
    headerNode: {
      control: false,
      description: 'Inject a custom ReactNode to completely replace the default left-side Avatar/Username block.',
      table: { category: 'Layout Modifiers', type: { summary: 'React.ReactNode' } }
    },
    footerNode: {
      control: false,
      description: 'Inject a custom ReactNode as a full-width footer block, replacing the inline subscription buttons.',
      table: { category: 'Layout Modifiers', type: { summary: 'React.ReactNode' } }
    },

    // ----------------------------------------------------------------------
    // ACTIONS & CALLBACKS
    // ----------------------------------------------------------------------
    onSubscribe: {
      control: false,
      description: "Asynchronous execution callback fired when upgrading from a 'none' state.",
      table: { category: 'Events', type: { summary: '() => Promise<void>' } }
    },
    onCancelSubscription: {
      control: false,
      description: "Asynchronous execution callback fired when terminating an 'active' state.",
      table: { category: 'Events', type: { summary: '() => Promise<void>' } }
    },
    onRenewSubscription: {
      control: false,
      description: "Asynchronous execution callback fired when reactivating a 'canceled' state.",
      table: { category: 'Events', type: { summary: '() => Promise<void>' } }
    },
  },
  args: {
    username: 'Optimus Prime',
    email: 'optimus.prime@autobots.com',
    isVerified: true,
    role: 'Commander',
    verifiedText: 'Verified',
    unverifiedText: 'Unverified',
    profileDetails: 'Profile Details',
    subscriptionProtocol: 'Subscription Protocol',
    freeTierText: 'Free Tier',
    permissions: ['admin:full', 'cybertron:access', 'matrix:wield'],
    subStatus: 'active',
    subPlanName: 'Enterprise Defense Tier',
    subCurrentPeriodEnd: new Date('2027-12-31T23:59:59Z').getTime(),
    design: 'material',
    tactile: false,
    hoverEffect: 'medium',
    trueGlass: false,
    darkMode: false,
    borderRadius: '16px',
    elevation: 8,
    neuIntensity: 1,
    lightSource: 'top-left',
    hideHeader: false,
    hideFooter: false,
    headerJustify: 'space-between',
    footerJustify: 'flex-end',
    fontFamily: 'Libre Franklin'
  }
};

export default meta;
type Story = StoryObj<UserProfileCardStoryProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------
export const InteractivePlayground: Story = {
  render: ({ 
    subStatus, subPlanName, subCurrentPeriodEnd, 
    subscribeBtnBg, subscribeBtnText,
    cancelBtnBg, cancelBtnText,
    renewBtnBg, renewBtnText,
    updateBtnBg, updateBtnText,
    ...args 
  }) => (
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '32px', backgroundColor: args.darkMode ? '#0f172a' : '#f8fafc', borderRadius: '16px' }}>
      <UserProfileCard 
        {...args}
        subscription={{
          status: subStatus || 'none',
          planName: subPlanName,
          currentPeriodEnd: subCurrentPeriodEnd ? new Date(subCurrentPeriodEnd).toISOString() : undefined,
        }}
        subscribeButtonOverrides={{ backgroundColor: subscribeBtnBg, textColor: subscribeBtnText }}
        cancelButtonOverrides={{ 
          backgroundColor: cancelBtnBg, 
          textColor: cancelBtnText, 
          hoverTextColor: '#ffffff', 
          darkBackgroundColor: cancelBtnBg, 
          darkTextColor: cancelBtnText, 
          darkHoverColor: cancelBtnBg, 
          darkHoverTextColor: '#ffffff'
        }}
        renewButtonOverrides={{ backgroundColor: renewBtnBg, textColor: renewBtnText }}
        updatePaymentButtonOverrides={{ backgroundColor: updateBtnBg, textColor: updateBtnText }}
        onCancelSubscription={async () => {
          await new Promise(r => setTimeout(r, 1500));
          alert("Cancel sequence initiated.");
        }}
        onSubscribe={async () => {
          await new Promise(r => setTimeout(r, 1500));
          alert("Subscription initialized.");
        }}
        onRenewSubscription={async () => {
          await new Promise(r => setTimeout(r, 1500));
          alert("Renewal complete.");
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to dynamically adjust identity parameters, permissions, subscription states, and design inheritance. Adjust your browser width to see the CSS Container Queries fluidly reflow the layout.',
      },
      source: {
        code: `import { UserProfileCard } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const ProfilePlayground = () => (
  <UserProfileCard
    username="Optimus Prime"
    email="optimus.prime@autobots.com"
    isVerified={true}
    role="Commander"
    permissions={['admin:full', 'cybertron:access', 'matrix:wield']}
    profileDetails="Profile Details"
    subscriptionProtocol="Subscription Protocol"
    freeTierText="Free Tier"
    fontFamily="Libre Franklin"
    subscription={{
      status: 'active',
      planName: 'Enterprise Defense Tier',
      currentPeriodEnd: '2027-12-31T23:59:59Z'
    }}
    subscribeButtonOverrides={{ backgroundColor: '#2563eb', textColor: '#ffffff' }}
    cancelButtonOverrides={{ 
      backgroundColor: '#dd2020', 
      textColor: '#dd2020', 
      hoverTextColor: '#ffffff', 
      darkBackgroundColor: '#dd2020', 
      darkTextColor: '#dd2020', 
      darkHoverTextColor: '#ffffff' 
    }}
    renewButtonOverrides={{ backgroundColor: '#2563eb', textColor: '#ffffff' }}
    updatePaymentButtonOverrides={{ backgroundColor: '#ef4444', textColor: '#ffffff' }}
    onCancelSubscription={async () => {
      // API call to Stripe cancellation endpoint
    }}
  />
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. DESIGN ARCHITECTURES (INHERITED)
// ---------------------------------------------------------------------------
export const ArchitecturalVariants: Story = {
  render: () => {
    const baseProps = {
      username: 'Elita One',
      email: 'elita@autobots.com',
      isVerified: true,
      role: 'Strategist',
      permissions: ['recon:read', 'operations:write'],
      subscription: { status: 'none' as const },
      fontFamily: 'Raleway',
      profileDetails: 'Profile Details',
      cancelButtonOverrides: { backgroundColor: '#dd2020', textColor: '#dd2020', hoverTextColor: '#ffffff', darkBackgroundColor:  '#dd2020', darkTextColor: '#ffffff', darkHoverTextColor: '#ffffff' },
      subscribeButtonOverrides: { backgroundColor: '#dd2020', textColor: '#ffffff', hoverTextColor: '#ffffff', darkBackgroundColor:  '#dd2020', darkTextColor: '#ffffff', darkHoverTextColor: '#ffffff' },
    };

    const neuProps = {
      ...baseProps,
      subscribeButtonOverrides: { backgroundColor: '#dd2020', textColor: '#ffffff', hoverTextColor: '#ffffff', darkBackgroundColor:  '#dd2020', darkTextColor: '#dd2020', darkHoverTextColor: '#ffffff' },
    };

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f1f5f9', padding: '48px', borderRadius: '16px' }}>
        <UserProfileCard {...baseProps} design="outline" />
        <UserProfileCard {...baseProps} design="material" />
        <UserProfileCard {...neuProps} design="neumorphic" />
        <UserProfileCard {...baseProps} design="skeuomorphic" />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'The `UserProfileCard` intrinsically delegates rendering to the core `Card` architecture, supporting all `design` paradigms seamlessly while maintaining its complex internal grid.',
      },
      source: {
        code: `import { UserProfileCard } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const ArchitecturalVariants = () => {
  const baseProps = {
    username: 'Elita One',
    email: 'elita@autobots.com',
    isVerified: true,
    role: 'Strategist',
    permissions: ['recon:read', 'operations:write'],
    subscription: { status: 'none' },
    fontFamily: 'Raleway',
    profileDetails: 'Profile Details',
    cancelButtonOverrides: { backgroundColor: '#dd2020', textColor: '#dd2020', hoverTextColor: '#ffffff', darkBackgroundColor: '#dd2020', darkTextColor: '#ffffff', darkHoverTextColor: '#ffffff' },
    subscribeButtonOverrides: { backgroundColor: '#dd2020', textColor: '#ffffff', hoverTextColor: '#ffffff', darkBackgroundColor: '#dd2020', darkTextColor: '#ffffff', darkHoverTextColor: '#ffffff' },
  };

  const neuProps = {
    ...baseProps,
    subscribeButtonOverrides: { backgroundColor: '#dd2020', textColor: '#ffffff', hoverTextColor: '#ffffff', darkBackgroundColor: '#dd2020', darkTextColor: '#dd2020', darkHoverTextColor: '#ffffff' },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f1f5f9', padding: '48px', borderRadius: '16px' }}>
      <UserProfileCard {...baseProps} design="outline" />
      <UserProfileCard {...baseProps} design="material" />
      <UserProfileCard {...neuProps} design="neumorphic" />
      <UserProfileCard {...baseProps} design="skeuomorphic" />
    </div>
  );
};`,
      }
    },
  },
};

// ---------------------------------------------------------------------------
// 3. EVENT HANDLER: onSubscribe()
// ---------------------------------------------------------------------------
export const EventHandlerOnSubscribe: Story = {
  name: 'Event: onSubscribe',
  render: () => (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <UserProfileCard
        username="Bumblebee"
        email="bumblebee@autobots.com"
        profileDetails='Agent Details'
        isVerified={true}
        role="Scout"
        permissions={['recon:read', 'comms:radio']}
        subscription={{
          status: 'none'
        }}
        design="outline"
        fontFamily='Playfair Display'
        subscribeButtonOverrides={{ backgroundColor: '#000000', textColor: '#000000', hoverTextColor: '#ffffff', darkBackgroundColor:  '#000000', darkTextColor: '#000000', darkHoverTextColor: '#ffffff' }}
        onSubscribe={async () => {
          await new Promise(r => setTimeout(r, 2000));
          alert("Redirecting to Stripe Checkout Session...");
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'When `subscription.status` is set to `"none"`, the plan badge maps to "Free Tier" and the primary footer action calls the `onSubscribe` async callback. This is typically wired to generate a new Stripe Checkout Session for upgrades.',
      },
      source: {
        code: `import { UserProfileCard } from '@emeraldemperaur/mito-ui';
import { useRouter } from 'next/router';
import '../../styles/fonts.scss';

export const CheckoutIntegration = () => {
  const router = useRouter();

  const handleStripeCheckout = async () => {
    // Generates a Stripe checkout URL via your backend API
    const response = await fetch('/api/billing/create-checkout', { method: 'POST' });
    const { url } = await response.json();
    router.push(url);
  };

  return (
    <UserProfileCard
      username="Bumblebee"
      email="bumblebee@autobots.com"
      profileDetails='Agent Details'
      isVerified={true}
      role="Scout"
      permissions={['recon:read', 'comms:radio']}
      subscription={{ status: 'none' }}
      design="outline"
      fontFamily='Playfair Display'
      subscribeButtonOverrides={{ 
        backgroundColor: '#000000', 
        textColor: '#000000', 
        hoverTextColor: '#ffffff', 
        darkBackgroundColor: '#000000', 
        darkTextColor: '#000000', 
        darkHoverTextColor: '#ffffff' 
      }}
      onSubscribe={handleStripeCheckout}
    />
  );
};`,
      }
    },
  },
};

// ---------------------------------------------------------------------------
// 4. EVENT HANDLER: onCancelSubscription()
// ---------------------------------------------------------------------------
export const EventHandlerOnCancel: Story = {
  name: 'Event: onCancelSubscription',
  render: () => (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <UserProfileCard
        username="Megatron"
        email="megatron@decepticons.com"
        isVerified={true}
        role="Warlord"
        permissions={['conquest:all', 'smash:all']}
        subscription={{
          status: 'active',
          planName: 'Galactic Domination Pro',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        }}
        design="skeuomorphic"
        fontFamily='Google Sans Code'
        onCancelSubscription={async () => {
          await new Promise(r => setTimeout(r, 2000));
          alert("Stripe API: Subscription marked to cancel at period end.");
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'When `subscription.status` is set to `"active"`, the component automatically maps a destructive "Cancel Plan" button in the footer and wires it to the `onCancelSubscription` async callback to handle churn or downgrade requests safely.',
      },
      source: {
        code: `import { UserProfileCard } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const ChurnManagement = () => {
  const handleStripeCancel = async () => {
    // Interacts with Stripe to set cancel_at_period_end: true
    await fetch('/api/billing/cancel', {
      method: 'POST',
      body: JSON.stringify({ subscriptionId: 'sub_12345' })
    });
  };

  return (
    <UserProfileCard
      username="Megatron"
      email="megatron@decepticons.com"
      isVerified={true}
      role="Warlord"
      permissions={['conquest:all', 'smash:all']}
      design="skeuomorphic"
      fontFamily='Google Sans Code'
      subscription={{ 
        status: 'active', 
        planName: 'Galactic Domination Pro', 
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
      }}
      onCancelSubscription={handleStripeCancel}
    />
  );
};`,
      }
    },
  },
};

// ---------------------------------------------------------------------------
// 5. EVENT HANDLER: onRenewSubscription()
// ---------------------------------------------------------------------------
export const EventHandlerOnRenew: Story = {
  name: 'Event: onRenewSubscription',
  render: () => (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <UserProfileCard
        username="Starscream"
        email="starscream@decepticons.com"
        isVerified={false}
        role="Commander (Disputed)"
        permissions={['flight:unrestricted']}
        subscription={{
          status: 'canceled',
          planName: 'Galactic Domination Pro',
          currentPeriodEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
        }}
        design="material"
        fontFamily='Libre Franklin'
        renewButtonOverrides={{ backgroundColor: '#00072D', textColor: '#ffffff', hoverTextColor: '#ffffff', darkBackgroundColor:  '#00072D', darkTextColor: '#ffffff', darkHoverTextColor: '#ffffff' }}
        onRenewSubscription={async () => {
          await new Promise(r => setTimeout(r, 2000));
          alert("Stripe API: Subscription successfully resumed/renewed.");
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'When `subscription.status` is set to `"canceled"`, the UI intelligently renders the historical `currentPeriodEnd` date as a termination stamp and provides a prominent "Renew Plan" CTA bound to the `onRenewSubscription` callback for seamless reactivation.',
      },
      source: {
        code: `import { UserProfileCard } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const ReactivationFlow = () => {
  const handleStripeResume = async () => {
    // Interacts with Stripe to resume an active or recently canceled sub
    await fetch('/api/billing/resume', {
      method: 'POST',
      body: JSON.stringify({ subscriptionId: 'sub_12345' })
    });
  };

  return (
    <UserProfileCard
      username="Starscream"
      email="starscream@decepticons.com"
      isVerified={false}
      role="Commander (Disputed)"
      permissions={['flight:unrestricted']}
      design="material"
      fontFamily='Libre Franklin'
      renewButtonOverrides={{ 
        backgroundColor: '#00072D', 
        textColor: '#ffffff', 
        hoverTextColor: '#ffffff', 
        darkBackgroundColor: '#00072D', 
        darkTextColor: '#ffffff', 
        darkHoverTextColor: '#ffffff' 
      }}
      subscription={{ 
        status: 'canceled', 
        planName: 'Galactic Domination Pro', 
        currentPeriodEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }}
      onRenewSubscription={handleStripeResume}
    />
  );
};`,
      }
    },
  },
};

// ---------------------------------------------------------------------------
// 6. BILLING PORTAL INTEGRATION (PAST DUE)
// ---------------------------------------------------------------------------
export const BillingPortalPastDue: Story = {
  name: 'Integration: Billing Portal (Past Due)',
  render: () => (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#e2e8f0', padding: '48px', borderRadius: '16px' }}>
      <UserProfileCard
        username="Soundwave"
        email="soundwave@decepticons.com"
        isVerified={true}
        role="Communications Officer"
        fontFamily='Inter'
        permissions={['audio:intercept']}
        subscription={{
          status: 'past_due',
          planName: 'Data Analytics Plus',
          currentPeriodEnd: new Date().toISOString() 
        }}
        design="neumorphic"
        onSubscribe={async () => {
          await new Promise(r => setTimeout(r, 2000));
          alert("Opening Stripe Customer Billing Portal...");
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'When `subscription.status` is set to `"past_due"`, the UI throws red warning badges and repurposes the `onSubscribe` callback to serve as an "Update Payment" gateway, allowing users to enter a Stripe Customer Portal to resolve their billing failure. Notice how the `neumorphic` design variant perfectly blends its shadows into the parent container\'s grey background.',
      },
      source: {
        code: `import { UserProfileCard } from '@emeraldemperaur/mito-ui';
import { useRouter } from 'next/router';
import '../../styles/fonts.scss';

export const PaymentRecovery = () => {
  const router = useRouter();

  const handleBillingPortal = async () => {
    // Generates a secure Stripe Billing Portal session for the customer
    const response = await fetch('/api/billing/customer-portal', { method: 'POST' });
    const { url } = await response.json();
    router.push(url);
  };

  return (
    <div style={{ backgroundColor: '#e2e8f0', padding: '48px', borderRadius: '16px' }}>
      <UserProfileCard
        username="Soundwave"
        email="soundwave@decepticons.com"
        isVerified={true}
        role="Communications Officer"
        permissions={['audio:intercept']}
        design="neumorphic"
        fontFamily='Inter'
        subscription={{ 
          status: 'past_due', 
          planName: 'Data Analytics Plus',
          currentPeriodEnd: new Date().toISOString()
        }}
        onSubscribe={handleBillingPortal} // Repurposed for updating payment
      />
    </div>
  );
};`,
      }
    },
  },
};

// ---------------------------------------------------------------------------
// 7. COMPOSITE OVERRIDES (HEADLESS MODE)
// ---------------------------------------------------------------------------
export const CompositeOverrides: Story = {
  render: () => (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <UserProfileCard
        username="Grimlock"
        email="grimlock@dinobots.com"
        isVerified={false}
        role="Dinobot Leader"
        permissions={['smash:all']}
        subscription={{ status: 'none' }}
        hideHeader={true}
        footerNode={
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>User ID: DIN-9982</span>
            <Button  variant="outline" backgroundColor='#800020' textColor='#ffffff' darkBackgroundColor='#800020' darkTextColor='#ffffff'>Revoke Access</Button>
          </div>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Developers have total control over the DOM layout. You can completely suppress the left-side profile block using `hideHeader={true}` and inject entirely custom JSX into the footer layout using `footerNode`, overriding the default subscription buttons.',
      },
      source: {
        code: `import { UserProfileCard } from '@emeraldemperaur/mito-ui';
import { Button } from '../Buttons/Button';
import '../../styles/fonts.scss';

export const HeadlessProfile = () => (
  <UserProfileCard
    username="Grimlock"
    email="grimlock@dinobots.com"
    isVerified={false}
    role="Dinobot Leader"
    permissions={['smash:all']}
    subscription={{ status: 'none' }}
    hideHeader={true}
    footerNode={
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>User ID: DIN-9982</span>
        <Button variant="outline" backgroundColor='#800020' textColor='#ffffff' darkBackgroundColor='#800020' darkTextColor='#ffffff'>Revoke Access</Button>
      </div>
    }
  />
);`,
      }
    },
  },
};

// ---------------------------------------------------------------------------
// 8. ACTION BUTTON THEMING OVERRIDES
// ---------------------------------------------------------------------------
export const ActionButtonTheming: Story = {
  name: 'Action Button Theming Overrides',
  render: () => (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <UserProfileCard
        username="Jazz"
        email="jazz@autobots.com"
        isVerified={true}
        role="Special Operations"
        permissions={['recon:read', 'comms:radio']}
        subscription={{
          status: 'none'
        }}
        design="material"
        fontFamily="Montserrat"
        subscribeButtonOverrides={{
          backgroundColor: '#013220', 
          darkBackgroundColor: '#013220',
          darkTextColor: '#ffffff',
          textColor: '#ffffff',
          hoverColor: '#059669',
          hoverTextColor: '#ffffff'
        }}
        renewButtonOverrides={{ backgroundColor: '#00072D', textColor: '#ffffff', hoverTextColor: '#ffffff', darkBackgroundColor:  '#00072D', darkTextColor: '#ffffff', darkHoverTextColor: '#ffffff' }}
        cancelButtonOverrides={{ backgroundColor: '#dd2020', textColor: '#dd2020', hoverTextColor: '#ffffff', darkBackgroundColor:  '#dd2020', darkTextColor: '#dd2020', darkHoverTextColor: '#ffffff' }}
        updatePaymentButtonOverrides={{ backgroundColor: '#dd2020', textColor: '#dd2020', hoverTextColor: '#ffffff', darkBackgroundColor:  '#dd2020', darkTextColor: '#dd2020', darkHoverTextColor: '#ffffff' }}
        onSubscribe={async () => {
          await new Promise(r => setTimeout(r, 2000));
          alert("Initiating custom themed checkout flow...");
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'You can explicitly override the colors, hover states, and dark-mode fallbacks of the native subscription CTA buttons using the `subscribeButtonOverrides`, `cancelButtonOverrides`, `renewButtonOverrides`, and `updatePaymentButtonOverrides` objects.',
      },
      source: {
        code: `import { UserProfileCard } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const CustomThemedAction = () => (
  <UserProfileCard
    username="Jazz"
    email="jazz@autobots.com"
    isVerified={true}
    role="Special Operations"
    permissions={['recon:read', 'comms:radio']}
    subscription={{ status: 'none' }}
    design="material"
    fontFamily="Montserrat"
    subscribeButtonOverrides={{
      backgroundColor: '#013220',
      darkBackgroundColor: '#013220',
      darkTextColor: '#ffffff',
      textColor: '#ffffff',
      hoverColor: '#059669',
      hoverTextColor: '#ffffff'
    }}
    renewButtonOverrides={{ 
      backgroundColor: '#00072D', 
      textColor: '#ffffff', 
      hoverTextColor: '#ffffff', 
      darkBackgroundColor: '#00072D', 
      darkTextColor: '#ffffff', 
      darkHoverTextColor: '#ffffff' 
    }}
    cancelButtonOverrides={{ 
      backgroundColor: '#dd2020', 
      textColor: '#dd2020', 
      hoverTextColor: '#ffffff', 
      darkBackgroundColor: '#dd2020', 
      darkTextColor: '#dd2020', 
      darkHoverTextColor: '#ffffff' 
    }}
    updatePaymentButtonOverrides={{ 
      backgroundColor: '#dd2020', 
      textColor: '#dd2020', 
      hoverTextColor: '#ffffff', 
      darkBackgroundColor: '#dd2020', 
      darkTextColor: '#dd2020', 
      darkHoverTextColor: '#ffffff' 
    }}
    onSubscribe={async () => { /* Handle Checkout */ }}
  />
);`,
      }
    },
  },
};