"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Video,
  MessageSquare,
  ChevronRight,
  Menu,
  LogIn,
  Camera,
  X,
} from "lucide-react";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-xl font-bold">SmartLook 40+</div>
          <div>
            {isAuthenticated ? (
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                会員情報
              </button>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <LogIn className="w-5 h-5" />
                ログイン
              </button>
            )}
          </div>
        </div>
      </header>

      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {authMode === "login" ? "ログイン" : "会員登録"}
                </h2>
                <button onClick={() => setIsAuthModalOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-4 mb-6">
                <button
                  className={`flex-1 py-2 text-center rounded-lg ${
                    authMode === "login" ? "bg-blue-600 text-white" : "bg-gray-100"
                  }`}
                  onClick={() => setAuthMode("login")}
                >
                  ログイン
                </button>
                <button
                  className={`flex-1 py-2 text-center rounded-lg ${
                    authMode === "register" ? "bg-blue-600 text-white" : "bg-gray-100"
                  }`}
                  onClick={() => setAuthMode("register")}
                >
                  会員登録
                </button>
              </div>
              
            {authMode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <div className="mt-2 text-sm space-x-4">
                    <p className="text-blue-600 inline cursor-pointer">IDをお忘れですか？</p>
                    <p className="text-blue-600 inline cursor-pointer">パスワードをお忘れですか？</p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  ログイン
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* 既存の会員登録フォームの各項目はそのまま */}

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-gray-700">
                  <h4 className="text-md font-semibold mb-2">アカウントをお持ちでない方</h4>
                  <p className="text-red-600 font-semibold">新規登録前にご確認ください</p>
                  <p className="mt-1">
                    登録前に会員規約とプライバシーポリシーをご確認ください。アカウントID・パスワードを他人に教えないようご注意ください。
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  会員登録
                </button>
              </form>
            )}

            </div>
          </div>
        </div>
      )}

      <div className="relative h-auto">

        <img
          src="/top_men.png"
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

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">カウンセリング予約</h2>
          <div className="grid gap-4">
            <Link href="/consultation" className="block bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">ビデオ相談</h3>
                  <p className="text-gray-600 text-sm mt-1">専門カウンセラーとビデオチャットで相談</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-full">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">チャット相談</h3>
                  <p className="text-gray-600 text-sm mt-1">テキストチャットでじっくり相談</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>


              {/* クイック診断 */}
            <Link
              href="/quickdiagnose"
              className="block bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition"
            >

              <div className="flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-full">
                  <Camera className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">クイック診断</h3>
                  <p className="text-gray-600 text-sm mt-1">AIが顔写真からパーソナライズされたアドバイスを提供</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">選ばれる理由</h2>
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">プライバシーに配慮</h3>
                <p className="text-gray-600 text-sm">完全個室での対応で、周りを気にせず相談可能</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">男性専門カウンセラー</h3>
                <p className="text-gray-600 text-sm">男性特有の悩みに精通したスペシャリストが対応</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">充実のアフターフォロー</h3>
                <p className="text-gray-600 text-sm">カウンセリング後もLINEで気軽に相談可能</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SmartLook 40+</h3>
              <p className="text-gray-400 text-sm">
                株式会社スマートルック<br />
                〒100-0001<br />
                東京都千代田区千代田1-1-1
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">お問い合わせ</h4>
              <p className="text-gray-400 text-sm">
                メール: info@smartlook40.jp<br />
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
