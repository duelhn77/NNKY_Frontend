"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import {
  Video,
  MessageSquare,
  ChevronRight,
  Menu,
  LogIn,
  Camera,
  X,
} from "lucide-react";
import Link from "next/link";

export default function QuickDiagnose() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [skincare, setSkincare] = useState<string>("");
  const [haircare, setHaircare] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [recommending, setRecommending] = useState<"skincare" | "haircare" | null>(null);
  const [capturing, setCapturing] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        const img = new Image();
        img.src = screenshot;
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
  
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // 左右反転
            ctx.translate(img.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0);
  
            // blob へ変換
            canvas.toBlob((blob) => {
              if (blob) {
                const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
                setImage(file);
                setPreview(URL.createObjectURL(blob));
                setCapturing(false);
              }
            }, "image/jpeg");
          }
        };
      }
    }
  }, []);
  

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);

    const prompt = `以下の顔写真をもとに、以下の2点について簡潔に診断してください。

① 肌の状態（例：キメの細かさ、テカリ、乾燥、毛穴、シミ・くすみの有無など）
② 髪の毛の状態（例：ハリ・コシ、ツヤ、毛量、乾燥・脂っぽさなど）
肌と髪の毛それぞれについて、2〜3行程度の短く要点をまとめたアドバイス形式で回答してください。
回答は「肌の状態」「髪の毛の状態」という見出しをつけてください。`;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("prompt", prompt);

    const res = await fetch(`${BACKEND_URL}/diagnose`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const fetchRecommendation = async (type: "skincare" | "haircare") => {
    setRecommending(type);

    const skincarePrompt = `以下の診断結果に基づき、40代男性向けにマンダム製品の中からおすすめのスキンケアを提案してください。

【診断結果（肌）】
${result}

このような肌の状態を考慮し、次の条件を満たすスキンケア製品を1〜2点提案してください：
- 洗顔や化粧水など日常的に取り入れやすいアイテム
- 脂性肌＋乾燥肌のバランスケアが可能な処方
- 忙しい男性でも手軽に使えるシンプルケア`;

    const haircarePrompt = `以下の診断結果に基づき、40代男性向けにマンダム製品の中からおすすめのヘアケア製品を提案してください。

【診断結果（髪）】
${result}

この髪の状態に合ったマンダム製品を、以下の条件を考慮して1〜2点提案してください：
- 髪のハリ・コシを保ちつつ、乾燥対策も可能な処方
- 年齢による頭皮ケアもサポートできる`;

    const formData = new FormData();
    formData.append("prompt", type === "skincare" ? skincarePrompt : haircarePrompt);

    const res = await fetch(`${BACKEND_URL}/recommend`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (type === "skincare") setSkincare(data.result);
    else setHaircare(data.result);

    setRecommending(null);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="p-4 max-w-md mx-auto relative">
      <h1 className="text-2xl font-bold mb-4 text-center">クイック診断</h1>

      {/* ✅ モーダルスピナー */}
      {(loading || recommending !== null) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="loader mb-2 mx-auto border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10 animate-spin" />
            <p className="text-sm text-gray-700 mt-2">
              {loading && "診断中です。しばらくお待ちください。"}
              {recommending === "skincare" && "おすすめスキンケアを読み込み中..."}
              {recommending === "haircare" && "おすすめヘアケアを読み込み中..."}
            </p>
          </div>
        </div>
      )}

      {/* ✅ カメラで撮影 */}
      {!preview && !capturing && (
        <button
          onClick={() => setCapturing(true)}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded mb-4"
        >
          撮影して肌・髪をチェック!
        </button>
      )}

{capturing && (
  <div className="relative w-full aspect-[3/4] mb-4">
    {/* ✅ カメラ映像 */}
    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      className="absolute top-0 left-0 w-full h-full object-cover rounded"
      videoConstraints={{ facingMode: "user" }}
      mirrored={true}
    />

    {/* ✅ ぼかし＋楕円マスク */}
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        maskImage: "radial-gradient(ellipse 40% 55% at center, transparent 0%, black 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 40% 55% at center, transparent 0%, black 100%)",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    />

    {/* ✅ 楕円の白い枠線 */}
    <div
      className="absolute top-1/2 left-1/2 z-20 border-2 border-yellow-300"
      style={{
        width: "240px",
        height: "320px",
        borderRadius: "50% / 40%",
        transform: "translate(-50%, -50%)",
      }}
    />

    {/* ✅ 十字線（中央） */}
    <div className="absolute top-1/2 left-1/2 z-30 w-[240px] h-[320px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
      {/* 縦線 */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white opacity-60" />
      {/* 横線 */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-white opacity-60" />
    </div>

    {/* ✅ 撮影ボタン */}
    <button
      onClick={capturePhoto}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-blue-500 font-bold py-2 px-6 rounded shadow z-40"
    >
      撮影
    </button>
  </div>
)}




      {/* ✅ プレビュー画像・診断ボタン */}
      {preview && (
        <div className="flex flex-col items-center space-y-2">
          <img src={preview} alt="preview" className="rounded w-full max-w-xs" />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full md:w-48 px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-500"
            }`}
          >
            この写真で診断
          </button>
        </div>
      )}

      {/* ✅ 診断結果・おすすめ */}
      {result && (
        <div ref={resultRef} className="mt-6 p-4 border rounded bg-gray-100 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">診断結果</h2>
            {result.split(/\n|(?=\d\.\s)/).map((p, i) => (
              <p key={i} className="mb-2 text-sm leading-relaxed">{p.trim()}</p>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-2">
            <button
              className={`w-full md:w-48 px-4 py-2 rounded text-white ${
                recommending === "skincare" ? "bg-gray-400" : "bg-blue-500"
              }`}
              onClick={() => fetchRecommendation("skincare")}
              disabled={recommending === "skincare"}
            >
              おすすめのスキンケア
            </button>
            <button
              className={`w-full md:w-48 px-4 py-2 rounded text-white ${
                recommending === "haircare" ? "bg-gray-400" : "bg-blue-500"
              }`}
              onClick={() => fetchRecommendation("haircare")}
              disabled={recommending === "haircare"}
            >
              おすすめのヘアケア
            </button>
          </div>

          {skincare && (
            <div>
              <h3 className="font-semibold text-sm mb-1">スキンケアの提案</h3>
              {skincare.split(/\n|(?=\d\.\s)/).map((p, i) => (
                <p key={i} className="mb-2 text-sm">{p.trim()}</p>
              ))}
            </div>
          )}

          {haircare && (
            <div>
              <h3 className="font-semibold text-sm mb-1">ヘアケアの提案</h3>
              {haircare.split(/\n|(?=\d\.\s)/).map((p, i) => (
                <p key={i} className="mb-2 text-sm">{p.trim()}</p>
              ))}
            </div>
          )}

          {(skincare || haircare) && (
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
        </div>
      </div>
    </div>
)}


        </div>
      )}
    </div>
  );
}

