import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { RAGChat, type ChatMessageData, type RAGSource } from './RAGChat';
import React, { useState } from 'react';

const mockCitations: RAGSource[] = [
  { id: 'doc-1', type: 'text', uri: 'https://docs.company.com/architecture', label: 'Architecture_v2.pdf' },
  { id: 'doc-2', type: 'code', uri: 'github.com/repo/main.ts', label: 'main.ts' },
];

const initialMessages: ChatMessageData[] = [
  {
    id: 'msg-1',
    role: 'SYSTEM' as const,
    content: 'Welcome to the Multimodal RAG Assistant. I am connected to your enterprise knowledge base.',
    createdAt: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: 'msg-2',
    role: 'USER' as const,
    content: 'Can you explain how the new caching layer is implemented?',
    createdAt: new Date(Date.now() - 30000).toISOString(),
  },
  {
    id: 'msg-3',
    role: 'ASSISTANT' as const,
    content: 'Based on the latest documentation, the caching layer utilizes Redis with a SWR (Stale-While-Revalidate) strategy. The connection pool is initialized in `main.ts`.',
    createdAt: new Date(Date.now() - 15000).toISOString(),
    contextSources: mockCitations,
    tokenUsage: { inputTokens: 412, outputTokens: 89, totalTokens: 501 },
  },
];

const RAGChatShowcase = (args: any) => {
  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: ChatMessageData = {
      id: `user-${Date.now()}`,
      role: 'USER',
      content: inputValue,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const newAiMsg: ChatMessageData = {
        id: `ai-${Date.now()}`,
        role: 'ASSISTANT',
        content: 'I have synthesized the requested information. The changes are backwards compatible with the v1 API.',
        createdAt: new Date().toISOString(),
        tokenUsage: { inputTokens: 120, outputTokens: 35, totalTokens: 155 },
      };
      setMessages((prev) => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <RAGChat.Root 
        messages={messages} 
        isAiTyping={isTyping} 
        variant={args.variant} 
        isDarkMode={args.isDarkMode}
        style={{ flex: 1 }}
      >
        <RAGChat.MessageList>
          {messages.map((msg) => (
            <RAGChat.Message key={msg.id} message={msg} />
          ))}
        </RAGChat.MessageList>
        <RAGChat.Input 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          onSubmit={handleSubmit} 
        />
      </RAGChat.Root>
    </div>
  );
};

const meta: Meta<typeof RAGChatShowcase> = {
  title: 'AI/RAGChat',
  component: RAGChatShowcase,
  tags: ['autodocs'],
  argTypes: {
    variant: { 
      control: 'radio', 
      options: ['material', 'outline', 'neumorphic'],
      description: 'The architectural design system variation.'
    },
    isDarkMode: { 
      control: 'boolean',
      description: 'Forces the component into Dark or Light mode CSS variable tokens.'
    },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.variant === 'neumorphic';
      const isDark = context.args.isDarkMode;
      
      let bg = 'transparent';
      if (isNeu) bg = isDark ? '#2d333b' : '#e0e5ec';
      else if (isDark) bg = '#0f172a';

      return (
        <div style={{ padding: '2rem', backgroundColor: bg, transition: 'background-color 0.3s ease' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof RAGChatShowcase>;


export const StandardOutline: Story = {
  args: {
    variant: 'outline',
    isDarkMode: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial RAG rendering', async () => {
      expect(canvas.getByText(/Can you explain how the new caching layer is implemented/i)).toBeInTheDocument();
      expect(canvas.getByText('Architecture_v2.pdf')).toBeInTheDocument();
    });

    await step('Simulate User Prompt', async () => {
      const input = canvas.getByRole('textbox', { name: /chat input/i });
      await userEvent.type(input, 'Are there any breaking changes?');
      
      const submitBtn = canvas.getByRole('button', { name: /send message/i });
      await userEvent.click(submitBtn);
    });

    await step('Verify AI Synthesis State', async () => {
      expect(canvas.getByText('Are there any breaking changes?')).toBeInTheDocument();
      
      const input = canvas.getByRole('textbox', { name: /chat input/i });
      expect(input).toBeDisabled();
      expect(canvas.getByText(/Synthesizing multimodal response/i)).toBeInTheDocument();
    });

    await step('Wait for AI Response', async () => {
      const aiResponse = await canvas.findByText(/The changes are backwards compatible/i, {}, { timeout: 3000 });
      expect(aiResponse).toBeInTheDocument();
    });
  },
};

export const MaterialDarkMode: Story = {
  args: {
    variant: 'material',
    isDarkMode: true,
  },
};

export const NeumorphicEngine: Story = {
  args: {
    variant: 'neumorphic',
    isDarkMode: false,
  },
};

export const MobileViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
  args: {
    variant: 'material',
    isDarkMode: false,
  },
};