import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Misa - Farcaster AI Assistant',
  description: 'Your friendly AI guide to Farcaster, Mini Apps, and web3',
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: 'https://misa-v1.vercel.app/og.png',
      button: {
        title: 'Chat with Misa ✨',
        action: {
          type: 'launch_miniapp',
          name: 'Misa',
          url: 'https://misa-v1.vercel.app',
          splashBackgroundColor: '#1a1a2e'
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
