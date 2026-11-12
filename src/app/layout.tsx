import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptFund AI | Autonomous Compute Clearinghouse',
  description: 'Zero-cost open-source AI inference funded in real-time by infrastructure sponsors via PayPal liquidity pools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FBFBF9] text-[#111110] min-h-screen antialiased selection:bg-[#005EA6] selection:text-white">
        {children}
      </body>
    </html>
  );
}
