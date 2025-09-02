import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gemini Chat - AI Assistant',
  description: 'Chat with Google\'s Gemini AI models',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}