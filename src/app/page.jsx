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

import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from 'axios';
import { PrimaryButton } from "@/components/PrimaryButton";

function App() {
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  //LINEモーダルの状態管理
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);

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

  // ログイン画面につきAPIと連携　（4/10 なりさん）
  const handleLogin = async (e) => {
    e.preventDefault(); // フォーム送信防止
    setLoading(true);
    // 🔍 パスワードが平文かチェック
    console.log("📩 入力されたパスワード:", loginForm.password);
  
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, {
        email: loginForm.email,
        password: loginForm.password
      });
  
      setIsAuthenticated(true);
      alert('ログイン成功！');
    } catch (error) {
      console.log("❌ エラー内容:", error);
      alert('ログインに失敗しました。');
    }finally {
      setLoading(false); // ← 追加
    }
  };
  
  //  ログイン画面につきAPIと連携　（4/10 なりさん）
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:8000/register", {
        name: registerForm.firstName + registerForm.lastName,
        name_kana: registerForm.firstNameKana + registerForm.lastNameKana,
        email: registerForm.email,
        password: registerForm.password,  // ✅ハッシュしない
        birth_date: registerForm.birthDate, // yyyy-mm-dd 形式
      });
  
      alert("会員登録に成功しました！");
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error("登録エラー:", error.response?.data || error);
      alert("会員登録に失敗しました。");
    }finally {
      setLoading(false); // ← 追加
    }
  };
  
  
  
  return (
    <div className="min-h-screen bg-[#E5EBF0] flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="SmartLook+ ロゴ"
              className="h-30 md:h-42 lg:h-48 w-auto object-contain"
            />
          </div>
          <div>
            {isAuthenticated ? (
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                会員情報
              </button>
            ) : (
              <button
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <LogIn className="w-4 h-4" />
                ログイン
              </button>
            )}
          </div>
        </div>
      </header>


{isMenuOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-start">
    <div className="bg-white w-64 h-full shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">メニュー</h3>
        <button onClick={() => setIsMenuOpen(false)}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <ul className="space-y-4">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">ホーム</Link>
        </li>
        <li>
          <Link href="/quickdiagnose" className="text-blue-600 hover:underline">クイック診断</Link>
        </li>
        <li>
          <Link href="/consultation" className="text-blue-600 hover:underline">カウンセリング予約</Link>
        </li>
        <li>
          <a href="https://page.line.me/058pijie" target="_blank" className="text-blue-600 hover:underline">
            LINE相談
          </a>
        </li>
      </ul>
    </div>
  </div>
)}




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
                <PrimaryButton type="submit" disabled={loading}>
                  ログイン
                </PrimaryButton>
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
                <div className="space-y-3" onSubmit={handleRegister}>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="姓（漢字）"
                      className="border px-2 py-1 rounded"
                      required
                      value={registerForm.lastName}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, lastName: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="名（漢字）"
                      className="border px-2 py-1 rounded"
                      required
                      value={registerForm.firstName}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, firstName: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="セイ（カタカナ）"
                      className="border px-2 py-1 rounded"
                      required
                      value={registerForm.lastNameKana}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, lastNameKana: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="メイ（カタカナ）"
                      className="border px-2 py-1 rounded"
                      required
                      value={registerForm.firstNameKana}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, firstNameKana: e.target.value })
                      }
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    className="w-full border px-3 py-2 rounded"
                    required
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, email: e.target.value })
                    }
                  />
                  <input
                    type="tel"
                    placeholder="電話番号"
                    className="w-full border px-3 py-2 rounded"
                    required
                    value={registerForm.phone}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, phone: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    placeholder="生年月日"
                    className="w-full border px-3 py-2 rounded"
                    required
                    value={registerForm.birthDate}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, birthDate: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="パスワード"
                    className="w-full border px-3 py-2 rounded"
                    required
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, password: e.target.value })
                    }
                  />
                </div>
                <PrimaryButton type="submit" disabled={loading}>
                  会員登録
                </PrimaryButton>
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
              カウンセラーが、あなたにぴったりの身だしなみを
            </h2>
          </div>
        </div>
      </div>

      <div className="bg-white py-8 border-b">
  <div className="container mx-auto px-4">
    <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
      男性のためのオンラインビューティーカウンセリング
    </h2>
    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
      自分に似合うヘアケア、スキンケア、ファッションなど、身だしなみについてパーソナルカウンセラーがあらゆるご相談にお応えいたします。{'\n'}
      ご希望に応じてご自身にあったアイテムのご紹介、オンライン診療のご案内まで、お客様おひとりひとりに併せてご案内を致します。{'\n\n'}
    </p>

    {/* クイック診断ボタンをここに追加 */}
    <div className="text-center">
    <Link
      href="/quickdiagnose"
      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition w-full max-w-md mx-auto"
    >
      <div className="text-center leading-snug">
        <div className="text-base font-semibold">無料3分！クイック診断</div>
        <div className="text-xs opacity-80 mt-1">
          AIが顔写真からパーソナライズされたアドバイスを提供します
        </div>
      </div>
    </Link>
     
    </div>
  </div>
</div>


      <div className="flex-1">
      <div className="bg-white py-10">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
      カウンセリング予約
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* ビデオ相談 */}
      <Link
        href="/consultation"
        className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-full">
            <Video className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">ビデオ相談</h3>
            <p className="text-gray-600 text-sm mt-1">
              専門カウンセラーがオンラインビデオ通話でお客様一人一人のご相談にお応えします
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </Link>

      {/* チャット相談 */}
      <div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition cursor-pointer"
        onClick={() => setIsLineModalOpen(true)}
      >
        <div className="flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-full">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">チャット相談</h3>
            <p className="text-gray-600 text-sm mt-1">
              プロのアドバイザーがLINEによるチャットでいつでも相談をお受けします
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  </div>
</div>


<div className="bg-slate-100 py-12 border-t border-b">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
      よくあるお悩み、ありませんか？
    </h2>
    <p className="text-center text-gray-500 mb-8 text-sm">
      30代・40代男性が直面する「見た目の変化」に、そっと寄り添います。
    </p>

    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {[
        "娘から「老けた？」と言われるが、何を変えればいいかわからない",
        "服装もヘアケアもスキンケアも、総合的・客観的にアドバイスをくれる人がいない",
        "「体型が崩れたこと」よりも「体型に合わせた服がわからない」ことが悩み",
        "白髪を染めているのに「疲れてそう」と言われる理由がわからない",
        "20代の部下に“なんか、うちの父に似てる”と言われて凹んだ",
        "ランチ後に“顔テカテカ”になるが、脂取り紙が逆に肌荒れを引き起こす",
      ].map((worry, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start gap-4"
        >
          <div className="text-blue-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">“{worry}”</p>
        </motion.div>
      ))}
    </div>
  </div>
</div>





<div className="bg-white py-10 border-t border-b">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
      パーソナルカウンセラーのご紹介
    </h2>
    <p className="text-center text-gray-500 mb-6 text-sm">
      あなたに寄り添うプロフェッショナルがお待ちしています
    </p>

    {/* カウンセラー一覧：横並びをgridに変更 */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        {
          name: "べい",
          img: "/Counselor1.png",
          genre: "スキンケア",
        },
        {
          name: "みーりん",
          img: "/counselor2.png",
          genre: "スキンケア",
        },
        {
          name: "なりさん",
          img: "/counselor3.png",
          genre: "身だしなみ・印象アップ",
        },
        {
          name: "やまけい",
          img: "/counselor4.png",
          genre: "髪型・ヘアケア",
        },
      ].map((c, i) => (
        <div key={i} className="bg-gray-50 rounded-xl shadow-sm text-center p-3">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-xl">
            <img
              src={c.img}
              alt={c.name}
              className="w-full h-full object-cover rounded-t-xl"
            />
          </div>
          <p className="text-gray-800 font-semibold text-sm mt-2">{c.name}</p>
          <p className="text-xs text-gray-500">{c.genre}</p>
          <div className="flex justify-center mt-2">
            <a
              href="https://www.instagram.com/mandom.online/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5ZM4.5 7.75A3.25 3.25 0 0 1 7.75 4.5h8.5A3.25 3.25 0 0 1 19.5 7.75v8.5a3.25 3.25 0 0 1-3.25 3.25h-8.5A3.25 3.25 0 0 1 4.5 16.25v-8.5Zm7.5-.25a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5Zm0 1.5a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5Zm5.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
                </svg>

              </svg>
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>





<div className="bg-white py-12 border-t">
  <div className="max-w-screen-md mx-auto px-4 text-center">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">選ばれる理由</h2>
    <div className="grid gap-6">
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-2">マンダムの研究成果を凝縮</h3>
        <p className="text-gray-600 text-sm">マンダムの長年の研究に基づく科学的アドバイス</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-2">プロの専門カウンセラー</h3>
        <p className="text-gray-600 text-sm">男性特有の悩みに精通したスペシャリストが対応</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-2">充実のアフターフォロー</h3>
        <p className="text-gray-600 text-sm">カウンセリング後もLINEで気軽に相談可能</p>
      </div>
    </div>
  </div>
</div>

        </div>
  

        <footer className="bg-gray-900 text-white py-12">
  <div className="container mx-auto px-4">
    
    {/* ① ロゴ：中央揃え */}
    <div className="text-center mb-8">
      <h3 className="text-xl font-bold">SmartLook +</h3>
    </div>

    {/* ② 情報セクション：中央配置で左揃え */}
    <div className="flex flex-col md:flex-row justify-center items-start gap-12 text-left">
      {/* 運営者情報 */}
      <div>
        <h4 className="font-semibold mb-2">会社概要・利用規約</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>会社概要</li>
          <li>プライバシーポリシー</li>
          <li>利用規約</li>
          <li>特定商取引法に基づく表記</li>
        </ul>
      </div>

      {/* お問い合わせ */}
      <div>
        <h4 className="font-semibold mb-2">お問い合わせ</h4>
        <p className="text-gray-400 text-sm leading-relaxed">
          メール: info@smartlook.jp<br />
          LINE: @smartlook40
        </p>
      </div>

    </div>

    {/* ③ SNS & LINEリンク */}
    <div className="mt-8 flex justify-center items-center gap-4">
      <a
        href="https://www.instagram.com/mandom.online/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-500 hover:text-pink-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.2c3.2..." />
        </svg>
      </a>

      <a
        href="https://page.line.me/058pijie"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white text-sm px-4 py-2 rounded-full hover:bg-green-600 transition"
      >
        公式LINE
      </a>
    </div>

    {/* ④ 著作権表示 */}
    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
      © 2025 NNKY Connection, Inc. All rights reserved.
    </div>
  </div>
</footer>




      {isLineModalOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="relative bg-white rounded-xl max-w-md w-full p-6 text-center">
      {/* 閉じるボタン */}
      <button
        onClick={() => setIsLineModalOpen(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>

      {/* QRコード画像（public フォルダに line-qr.png など置いてください） */}
      <img
        src="/line-qr.png"
        alt="LINE QRコード"
        className="w-40 h-40 mx-auto mb-4"
      />

      <h3 className="text-lg font-semibold mb-2">
        QRコードをスキャンしてLINEに登録
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        LINE公式アカウントを友だち追加して、チャット相談をスタート！
      </p>

      {/* 外部リンクボタン */}
      <a
        href="https://page.line.me/058pijie"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-500 text-white px-6 py-2 rounded-full text-sm hover:bg-green-600 transition"
      >
        LINE公式アカウントを見る
      </a>
    </div>
  </div>
)}

    </div>
  );
}

export default App;
