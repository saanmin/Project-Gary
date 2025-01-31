import "./globals.css"
import RootLayoutClient from '@/components/RootLayoutClient'

export const metadata = {
  title: 'Project Gary',
  description: '계리플랫폼',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
