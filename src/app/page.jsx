"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Video,
  MessageSquare,
  ChevronRight,
  Menu,
  User,
  LogIn,
  Camera,
  X,
} from "lucide-react";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* ヘッダー（スマホ対応） */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-xl font-bold">SmartLook 40+</div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <User className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <LogIn className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ドロワーメニュー（スライド式） */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white h-full shadow-md p-6 transition-transform transform translate-x-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">メニュー</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <span className="block text-lg text-gray-800 hover:text-blue-600">トップページ</span>
              </Link>
              <Link href="/voices" onClick={() => setIsMenuOpen(false)}>
                <span className="block text-lg text-gray-800 hover:text-blue-600">お客様のこえ</span>
              </Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                <span className="block text-lg text-gray-800 hover:text-blue-600">お問い合わせ</span>
              </Link>
            </nav>
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-auto">
        <img
          src="top_men.png"
          alt="トップ画像"
          className="w-full max-w-[300px] h-auto object-contain mx-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <h2 className="text-white text-3xl md:text-4xl font-bold">
              プロの身だしなみカウンセラーが、あなたにぴったりのアドバイスを
            </h2>
          </div>
        </div>
      </div>

      {/* Service Description */}
      <div className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
            男性のためのオンラインビューティーカウンセリング
          </h2>
          <p className="text-gray-600 leading-relaxed">
            商品の使いかたや自分に似合うメイク、自分に似合うスキンケアの方法など、美容についてあらゆるお悩みにお答えいたします。
            パーソナルビューティーパートナーがお客様おひとりひとり迅速なアドバイスを行ないます。
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            カウンセリング予約
          </h2>

          <div className="grid gap-4">
            {/* ビデオ相談 */}
            <Link
              href="/consultation"
              className="block bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    ビデオ相談
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    専門カウンセラーとビデオチャットで相談
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            {/* チャット相談 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-full">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    チャット相談
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    テキストチャットでじっくり相談
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* クイック診断 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-full">
                  <Camera className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    クイック診断
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    AIが顔写真からパーソナライズされたアドバイスを提供
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              選ばれる理由
            </h2>
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">
                  プライバシーに配慮
                </h3>
                <p className="text-gray-600 text-sm">
                  完全個室での対応で、周りを気にせず相談可能
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">
                  男性専門カウンセラー
                </h3>
                <p className="text-gray-600 text-sm">
                  男性特有の悩みに精通したスペシャリストが対応
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">
                  充実のアフターフォロー
                </h3>
                <p className="text-gray-600 text-sm">
                  カウンセリング後もLINEで気軽に相談可能
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SmartLook 40+</h3>
              <p className="text-gray-400 text-sm">
                株式会社スマートルック
                <br />
                〒100-0001
                <br />
                東京都千代田区千代田1-1-1
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">お問い合わせ</h4>
              <p className="text-gray-400 text-sm">
                メール: info@smartlook40.jp
                <br />
                LINE: @smartlook40
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">会社情報</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>会社概要</li>
                <li>プライバシーポリシー</li>
                <li>利用規約</li>
                <li>特定商取引法に基づく表記</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2024 SmartLook 40+ All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
