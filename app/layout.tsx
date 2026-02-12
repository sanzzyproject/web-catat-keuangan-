import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster"; // Ensure you add shadcn toast if wanted, otherwise remove

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinTrack',
  description: 'Aplikasi pencatat keuangan pribadi',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen bg-muted/20">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block fixed inset-y-0 left-0 z-10">
              <Sidebar />
            </aside>
            
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center h-16 px-4 bg-background/80 backdrop-blur-md border-b">
              <MobileNav />
              <span className="ml-4 font-bold text-lg">FinTrack</span>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen transition-all duration-300">
              <div className="h-full p-4 md:p-8 max-w-7xl mx-auto space-y-8">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
