import "./globals.css";
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'Project Gary',
  description: '계리플랫폼',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-100 py-10">
          <div className="container max-w-screen-xl mx-auto">
            <div className=""><Navigation /></div>
            <div className="bg-white mt-3 rounded-2xl">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
