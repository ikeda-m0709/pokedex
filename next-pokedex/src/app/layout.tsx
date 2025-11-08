import Header from "@/components/header";
import type { Metadata } from "next";
import "./globals.css"; //←このファイルをいじると全体のCSSが変わる

export const metadata: Metadata = {
  title: "ポケモン図鑑",
  description: "ポケモン一覧の閲覧、検索が可能な図鑑",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{/*bodyをview-height100%にする*/}
      <Header />
      {children}
      </body>
    </html>
  );
}
