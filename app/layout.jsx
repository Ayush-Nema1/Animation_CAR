import "./globals.css";

export const metadata = {
  title: "Welcome Itzfizz",
  description: "Scroll-driven hero animation"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
