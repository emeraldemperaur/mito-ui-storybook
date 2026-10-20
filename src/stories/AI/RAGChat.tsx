"use client";

import React, { createContext, useContext, forwardRef, useEffect, useRef } from 'react';


/**
 * Defines the modality of the RAG context source retrieved.
 * @typedef {'media' | 'asset' | 'text' | 'code'} RAGSourceType
 */
export type RAGSourceType = 'media' | 'asset' | 'text' | 'code';

/**
 * Represents a single Multimodal RAG Citation or Artifact returned by the LLM.
 * @interface RAGSource
 * @property {string} id - Unique identifier for the artifact.
 * @property {RAGSourceType} type - The modality format of the artifact.
 * @property {string} uri - The endpoint, S3 path, or reference URL to the source.
 * @property {string} [label] - Optional human-readable display name.
 */
export interface RAGSource {
  id: string;
  type: RAGSourceType;
  uri: string;
  label?: string;
}

/**
 * Standardized AI Chat roles for LLM interaction.
 * @typedef {'USER' | 'ASSISTANT' | 'SYSTEM'} ChatRole
 */
export type ChatRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

/**
 * Supported design system variants.
 * @typedef {'material' | 'outline' | 'neumorphic'} ChatVariant
 */
export type ChatVariant = 'material' | 'outline' | 'neumorphic';

/**
 * Core interface representing a single message node in the chat chronology.
 * @interface ChatMessageData
 * @property {string} id - Unique identifier for the message node.
 * @property {ChatRole} role - The entity that generated the message.
 * @property {string} content - The markdown or plaintext payload.
 * @property {string | Date} createdAt - ISO timestamp of generation.
 * @property {RAGSource[]} [contextSources] - Array of vectors/documents used to generate the response.
 * @property {object} [tokenUsage] - Granular LLM telemetry for billing/tracking.
 */
export interface ChatMessageData {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string | Date;
  contextSources?: RAGSource[];
  tokenUsage?: { inputTokens: number; outputTokens: number; totalTokens: number };
}

/**
 * Palette configuration for overriding default bubble styles per role.
 * @interface ChatRoleTheme
 */
export interface ChatRoleTheme {
  backgroundColor?: string;
  textColor?: string;
  avatarColor?: string;
  avatarBackgroundColor?: string;
}

/**
 * Global theme overrides mapping directly to native CSS variables.
 * @interface ChatThemeOverrides
 */
export interface ChatThemeOverrides {
  light?: {
    background?: string;
    border?: string;
    text?: string;
    subtext?: string;
    userBubble?: ChatRoleTheme;
    aiBubble?: ChatRoleTheme;
  };
  dark?: {
    background?: string;
    border?: string;
    text?: string;
    subtext?: string;
    userBubble?: ChatRoleTheme;
    aiBubble?: ChatRoleTheme;
  };
}

/**
 * Internal Context state managed by the RAGChat.Root Provider.
 * @internal
 */
interface ChatContextState {
  messages: ChatMessageData[];
  isAiTyping: boolean;
  isDarkMode: boolean;
  variant: ChatVariant;
  theme?: ChatThemeOverrides;
  thinkingIndicator?: React.ReactNode;
}


const ChatContext = createContext<ChatContextState | undefined>(undefined);

/**
 * Hook to consume the Chat Context.
 * @throws {Error} If called outside of a <RAGChat.Root> boundary.
 * @returns {ChatContextState} The active chat state.
 */
export const useChatContext = (): ChatContextState => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('Chat compound components must be rendered within a <RAGChat.Root> provider.');
  }
  return context;
};


export interface ChatRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The chronological array of messages to render */
  messages: ChatMessageData[];
  /** Toggles the 'thinking' UI state for the Assistant */
  isAiTyping?: boolean;
  /** Forces the component into Dark or Light mode CSS variable tokens */
  isDarkMode?: boolean;
  /** Dynamically switches the design system rendering */
  variant?: ChatVariant;
  /** Granular overrides for specific color properties */
  theme?: ChatThemeOverrides;
  /** Custom React Node to replace the default "Synthesizing..." text */
  thinkingIndicator?: React.ReactNode;
  /** Radix UI pattern: Prevents rendering a wrapper div if true */
  asChild?: boolean;
}

/**
 * @component RAGChat.Root
 * @description The Global Context Provider and top-level Viewport for the AI Chat.
 * Injects dynamic CSS variables depending on the active variant (outline, material, or neumorphic).
 */
export const RAGChatRoot = forwardRef<HTMLDivElement, ChatRootProps>(
  (
    {
      messages,
      isAiTyping = false,
      isDarkMode = false,
      variant = 'outline',
      theme,
      thinkingIndicator,
      asChild,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? (React.Fragment as any) : 'div';
    const activeTheme = isDarkMode ? theme?.dark : theme?.light;
    
    const baseBg = activeTheme?.background || (isDarkMode ? '#111827' : '#f9fafb');
    const neuBg = activeTheme?.background || (isDarkMode ? '#2d333b' : '#e0e5ec');
    const finalBg = variant === 'neumorphic' ? neuBg : baseBg;
    
    const baseBorder = activeTheme?.border || (isDarkMode ? '#374151' : '#e5e7eb');
    
    let containerBorder = 'none';
    let containerShadow = 'none';
    let inputWellShadow = 'none';
    let userBubbleBg = activeTheme?.userBubble?.backgroundColor || '#800020';
    let aiBubbleBg = activeTheme?.aiBubble?.backgroundColor || (isDarkMode ? '#1f2937' : '#ffffff');
    let userBubbleShadow = 'none';
    let aiBubbleShadow = 'none';

    if (variant === 'outline') {
      containerBorder = `1px solid ${baseBorder}`;
      userBubbleShadow = 'none';
      aiBubbleShadow = '0 1px 2px 0 rgba(0,0,0,0.05)';
    } else if (variant === 'material') {
      containerShadow = isDarkMode ? '0 10px 15px -3px rgba(0,0,0,0.5)' : '0 10px 15px -3px rgba(0,0,0,0.1)';
      userBubbleShadow = '0 4px 6px -1px rgba(0,0,0,0.2)';
      aiBubbleShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
    } else if (variant === 'neumorphic') {
      userBubbleBg = finalBg; 
      aiBubbleBg = finalBg;
      containerShadow = isDarkMode 
        ? '8px 8px 16px #1f2329, -8px -8px 16px #3b434d' 
        : '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)';
      inputWellShadow = isDarkMode 
        ? 'inset 4px 4px 8px #1f2329, inset -4px -4px 8px #3b434d'
        : 'inset 6px 6px 10px 0 rgba(163,177,198, 0.5), inset -6px -6px 10px 0 rgba(255,255,255, 0.5)';
      userBubbleShadow = isDarkMode 
        ? '6px 6px 12px #1f2329, -6px -6px 12px #3b434d' 
        : '6px 6px 12px rgb(163,177,198,0.6), -6px -6px 12px rgba(255,255,255, 0.5)';
      aiBubbleShadow = isDarkMode 
        ? 'inset 4px 4px 8px #1f2329, inset -4px -4px 8px #3b434d' 
        : 'inset 4px 4px 8px rgb(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255, 0.5)';
    }

    const cssVariables = {
      '--chat-bg': finalBg,
      '--chat-border': baseBorder,
      '--chat-text': activeTheme?.text || (isDarkMode ? '#f9fafb' : '#111827'),
      '--chat-subtext': activeTheme?.subtext || (isDarkMode ? '#9ca3af' : '#6b7280'),
      '--user-bg': userBubbleBg,
      '--user-text': activeTheme?.userBubble?.textColor || (variant === 'neumorphic' ? '#3182ce' : '#ffffff'),
      '--ai-bg': aiBubbleBg,
      '--ai-text': activeTheme?.aiBubble?.textColor || (isDarkMode ? '#f9fafb' : '#111827'),
      
      '--container-border': containerBorder,
      '--container-shadow': containerShadow,
      '--input-shadow': inputWellShadow,
      '--user-shadow': userBubbleShadow,
      '--ai-shadow': aiBubbleShadow,
    } as React.CSSProperties;

    return (
      <ChatContext.Provider value={{ messages, isAiTyping, isDarkMode, variant, theme, thinkingIndicator }}>
        <Comp
          ref={ref}
          className={`mito-ai-chat-root ${className || ''}`}
          style={{
            ...cssVariables,
            backgroundColor: 'var(--chat-bg)',
            color: 'var(--chat-text)',
            border: 'var(--container-border)',
            boxShadow: 'var(--container-shadow)',
            borderRadius: variant === 'neumorphic' ? '1.5rem' : '0.375rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            ...style,
          }}
          {...props}
        >
          {children}
        </Comp>
      </ChatContext.Provider>
    );
  }
);
RAGChatRoot.displayName = 'RAGChat.Root';


export interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  ariaLabel?: string;
}

/**
 * @component RAGChat.MessageList
 * @description Scrollable container for RAGChat.Message nodes. 
 */
export const RAGChatMessageList = forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, ariaLabel = 'AI Chat History', children, ...props }, ref) => {
    const { messages, isAiTyping, thinkingIndicator, variant } = useChatContext();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAiTyping]);

    return (
      <div
        ref={ref}
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label={ariaLabel}
        className={`mito-ai-message-list ${className || ''}`}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: variant === 'neumorphic' ? '2rem' : '1.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: variant === 'neumorphic' ? '2rem' : '1.5rem' 
        }}
        {...props}
      >
        {children}
        {isAiTyping && (
          <div
            role="status"
            aria-label="AI is synthesizing a response"
            style={{
              alignSelf: 'flex-start',
              marginLeft: variant === 'neumorphic' ? '3.5rem' : '3rem',
              padding: '0.85rem 1.15rem',
              backgroundColor: 'var(--ai-bg)',
              border: variant === 'outline' ? '1px solid var(--chat-border)' : 'none',
              boxShadow: 'var(--ai-shadow)',
              borderRadius: variant === 'neumorphic' ? '1rem' : '0.5rem',
              color: 'var(--chat-subtext)',
              fontSize: '0.85rem',
            }}
          >
            {thinkingIndicator || <i>Synthesizing multimodal response...</i>}
          </div>
        )}
        <div ref={scrollRef} tabIndex={-1} aria-hidden="true" />
      </div>
    );
  }
);
RAGChatMessageList.displayName = 'RAGChat.MessageList';

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: ChatMessageData;
  avatar?: React.ReactNode;
}

/**
 * @component RAGChat.Message
 * @description Renders an individual message bubble adapted to the active variant.
 */
export const RAGChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, avatar, className, style, ...props }, ref) => {
    const { variant } = useChatContext();
    const isUser = message.role === 'USER';
    const isNeo = variant === 'neumorphic';

    return (
      <div
        ref={ref}
        className={`mito-ai-message ${className || ''}`}
        style={{
          display: 'flex',
          gap: isNeo ? '1.25rem' : '1rem',
          alignItems: 'flex-end',
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          maxWidth: '85%',
          ...style,
        }}
        {...props}
      >
        {!isUser && (
          <div aria-hidden="true" style={{ width: isNeo ? '40px' : '32px', height: isNeo ? '40px' : '32px', borderRadius: '50%', backgroundColor: isNeo ? 'var(--chat-bg)' : 'var(--chat-border)', boxShadow: isNeo ? 'var(--user-shadow)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: isNeo ? 'bold' : 'normal' }}>
            {avatar || 'AI'}
          </div>
        )}

        <div
          style={{
            backgroundColor: isUser ? 'var(--user-bg)' : 'var(--ai-bg)',
            color: isUser ? 'var(--user-text)' : 'var(--ai-text)',
            border: (variant === 'outline' && !isUser) ? '1px solid var(--chat-border)' : 'none',
            padding: isNeo ? '1.25rem 1.5rem' : '1rem 1.25rem',
            borderRadius: isNeo ? '1.5rem' : '1rem',
            borderBottomRightRadius: isUser ? (isNeo ? '0.5rem' : '0.25rem') : (isNeo ? '1.5rem' : '1rem'),
            borderBottomLeftRadius: !isUser ? (isNeo ? '0.5rem' : '0.25rem') : (isNeo ? '1.5rem' : '1rem'),
            boxShadow: isUser ? 'var(--user-shadow)' : 'var(--ai-shadow)',
          }}
        >
          <div style={{ fontSize: '0.675rem', opacity: isNeo ? 1 : 0.7, color: isNeo ? 'var(--chat-subtext)' : 'inherit', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: isNeo ? 600 : 'normal' }}>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {message.tokenUsage && ` • 🪙 ${message.tokenUsage.totalTokens} Tokens`}
          </div>
          
          <div style={{ fontSize: isNeo ? '0.95rem' : '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {message.content}
          </div>

          {message.contextSources && message.contextSources.length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${isUser && variant !== 'neumorphic' ? 'rgba(255,255,255,0.2)' : 'var(--chat-border)'}` }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isNeo ? 'var(--chat-subtext)' : 'inherit' }}>Retrieved Artifacts:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {message.contextSources.map((source) => (
                  <span
                    key={source.id}
                    title={source.uri}
                    style={{ 
                      padding: '0.25rem 0.5rem', 
                      fontSize: '0.75rem', 
                      backgroundColor: isNeo ? 'var(--chat-bg)' : 'rgba(0,0,0,0.1)', 
                      borderRadius: '0.25rem',
                      boxShadow: isNeo ? 'var(--user-shadow)' : 'none',
                      fontWeight: isNeo ? 500 : 'normal'
                    }}
                  >
                    {source.label || source.type.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {isUser && (
          <div aria-hidden="true" style={{ width: isNeo ? '40px' : '32px', height: isNeo ? '40px' : '32px', borderRadius: '50%', backgroundColor: isNeo ? 'var(--chat-bg)' : 'var(--user-bg)', color: 'var(--user-text)', boxShadow: isNeo ? 'var(--ai-shadow)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: isNeo ? 'bold' : 'normal' }}>
            {avatar || 'U'}
          </div>
        )}
      </div>
    );
  }
);
RAGChatMessage.displayName = 'RAGChat.Message';


export interface ChatInputProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

/**
 * @component RAGChat.Input
 * @description Accessible form interface adapting strictly to the current variant design.
 */
export const RAGChatInput = forwardRef<HTMLFormElement, ChatInputProps>(
  ({ value, onChange, onSubmit, placeholder = 'Synthesize a prompt...', isDisabled = false, style, ...props }, ref) => {
    const { isAiTyping, variant } = useChatContext();
    const isLocked = isDisabled || isAiTyping;
    const isNeo = variant === 'neumorphic';

    return (
      <form
        ref={ref}
        onSubmit={(e) => { e.preventDefault(); if (!isLocked && value.trim()) onSubmit(e); }}
        style={{ 
          display: 'flex', 
          gap: isNeo ? '1.5rem' : '1rem', 
          padding: isNeo ? '1.5rem' : '1rem', 
          borderTop: variant === 'outline' ? '1px solid var(--chat-border)' : 'none',
          backgroundColor: isNeo ? 'var(--chat-bg)' : 'transparent',
          borderRadius: isNeo ? '0 0 1.5rem 1.5rem' : '0',
          ...style 
        }}
        {...props}
      >
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={isLocked}
          placeholder={isLocked ? 'Please wait...' : placeholder}
          aria-label="Chat input"
          aria-disabled={isLocked}
          style={{
            flex: 1,
            padding: isNeo ? '1rem 1.5rem' : '0.85rem 1.25rem',
            borderRadius: isNeo ? '1rem' : '0.375rem',
            border: variant === 'outline' ? '1px solid var(--chat-border)' : 'none',
            backgroundColor: isNeo ? 'var(--chat-bg)' : 'transparent',
            color: 'var(--chat-text)',
            boxShadow: 'var(--input-shadow)',
            outline: 'none',
            cursor: isLocked ? 'not-allowed' : 'text',
            fontWeight: isNeo ? 500 : 'normal'
          }}
        />
        <button
          type="submit"
          disabled={isLocked || !value.trim()}
          aria-label="Send message"
          style={{
            padding: isNeo ? '1rem 2.5rem' : '0.85rem 2.25rem',
            backgroundColor: isNeo ? 'var(--chat-bg)' : 'var(--user-bg)',
            color: 'var(--user-text)',
            border: 'none',
            borderRadius: isNeo ? '1rem' : '0.375rem',
            fontWeight: isNeo ? 700 : 600,
            textTransform: isNeo ? 'uppercase' : 'none',
            letterSpacing: isNeo ? '0.05em' : 'normal',
            boxShadow: isNeo ? ((isLocked || !value.trim()) ? 'var(--ai-shadow)' : 'var(--user-shadow)') : 'none',
            cursor: (isLocked || !value.trim()) ? 'not-allowed' : 'pointer',
            opacity: (isLocked || !value.trim()) ? 0.6 : 1,
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Send
        </button>
      </form>
    );
  }
);
RAGChatInput.displayName = 'RAGChat.Input';

export const RAGChat = {
  Root: RAGChatRoot,
  MessageList: RAGChatMessageList,
  Message: RAGChatMessage,
  Input: RAGChatInput,
};