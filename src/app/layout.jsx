import './globals.css'

export const metadata = {
  title: 'SmartLook 40+',
  description: '見た目改善のプロフェッショナルが40代男性をサポート',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="font-sans bg-base-light text-gray-800 antialiased">
        {children}
      </body>
    </html>
  )
}

