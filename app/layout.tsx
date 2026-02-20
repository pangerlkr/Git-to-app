import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Git-to-App — Build Mobile Apps from GitHub',
  description:
    'Transform any GitHub repository into a production-ready Android and iOS mobile application. Just paste the repo URL and build.',
  keywords: ['mobile', 'android', 'ios', 'react native', 'flutter', 'expo', 'build', 'github'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
