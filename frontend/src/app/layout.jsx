import './globals.css';

export const metadata = {
  title: 'Citas App',
  description: 'App de encuentros casuales',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}