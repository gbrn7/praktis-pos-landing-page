import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const plusJakartaSans = localFont({
  src: [
    {
      path: '../assets/font/Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: '../assets/font/Plus_Jakarta_Sans/PlusJakartaSans-Italic-VariableFont_wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Praktis POS - Paket Mesin Kasir Lengkap Hardware & Software Siap Pakai',
  description: 'Solusi mesin kasir lengkap siap pakai untuk UMKM & ritel di Indonesia. Tanpa biaya langganan bulanan seumur hidup, otomatis pisahkan kas modal dan profit.',
  keywords: ['mesin kasir siap pakai', 'paket kasir umkm', 'software kasir seumur hidup', 'aplikasi pos ritel', 'praktis pos'],
  openGraph: {
    title: 'Praktis POS - Mesin Kasir Lengkap Siap Pakai',
    description: 'Buka dus, colok kabel, langsung siap jualan. Tanpa biaya langganan bulanan seumur hidup!',
    url: 'https://praktispos.com',
    siteName: 'Praktis POS',
    locale: 'id_ID',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
  },
};

const themeInitScript = `
  try {
    const theme = localStorage.getItem('theme');
    const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && supportDarkMode)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased selection:bg-[#FFF0EB] selection:text-[#E0511F]`}>
        {children}
      </body>
    </html>
  );
}
