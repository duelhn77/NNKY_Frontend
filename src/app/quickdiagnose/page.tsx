"use client";

import { useState, useRef } from "react";

export default function QuickDiagnose() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [skincare, setSkincare] = useState<string>("");
  const [haircare, setHaircare] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [recommending, setRecommending] = useState<"skincare" | "haircare" | null>(null); // ✅ 保持
  const resultRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "prompt",
      "この写真をもとに、肌の状態、髪の毛の状態を診断してください"
    );

    const res = await fetch(`${BACKEND_URL}/diagnose`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);

    // スクロール
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const fetchRecommendation = async (type: "skincare" | "haircare") => {
    setRecommending(type);
  
    const formData = new FormData();
    const basePrompt =
      type === "skincare"
        ? "40代の男性向けにおすすめのスキンケアをマンダム製品の中から提案してください。"
        : "40代の男性向けにおすすめのヘアケアをマンダム製品の中から提案してください。";
  
    formData.append("prompt", basePrompt);
  
    const res = await fetch(`${BACKEND_URL}/recommend`, {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    if (type === "skincare") setSkincare(data.result);
    else setHaircare(data.result);
  
    setRecommending(null);
  
    // ✅ スクロール処理追加
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  

  return (
    <div className="p-4 max-w-md mx-auto relative">
      <h1 className="text-2xl font-bold mb-4 text-center">クイック診断</h1>

      {/* ✅ 共通ローディングモーダル */}
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

      {/* 顔写真撮影 */}
      <label className="block mb-4">
        <span className="inline-block px-4 py-2 bg-blue-500 text-white rounded text-center w-full cursor-pointer">
          撮影して肌・髪をチェック!
        </span>
        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleCapture}
          className="hidden"
        />
      </label>

      {/* プレビュー */}
      {preview && (
        <div className="flex flex-col items-center space-y-2">
          <img src={preview} alt="preview" className="rounded w-full max-w-xs" />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full md:w-48 px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
            }`}
          >
            {loading ? "診断中..." : "この写真で診断"}
          </button>
        </div>
      )}

      {/* 結果 */}
      {result && (
        <div
          ref={resultRef}
          className="mt-6 p-4 border rounded bg-gray-100 space-y-4"
        >
          <div>
            <h2 className="text-lg font-semibold mb-1">診断結果</h2>
            {result.split(/\n|(?=\d\.\s)/).map((paragraph, index) => (
              <p key={index} className="mb-2 text-sm leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
          </div>

          {/* おすすめボタン群 */}
          <div className="flex flex-col items-center space-y-2">
            <button
              className={`w-full md:w-48 px-4 py-2 rounded text-white ${
                recommending === "skincare"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
              }`}
              onClick={() => fetchRecommendation("skincare")}
              disabled={recommending === "skincare"}
            >
              おすすめのスキンケア
            </button>
            <button
              className={`w-full md:w-48 px-4 py-2 rounded text-white ${
                recommending === "haircare"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
              }`}
              onClick={() => fetchRecommendation("haircare")}
              disabled={recommending === "haircare"}
            >
              おすすめのヘアケア
            </button>
          </div>

          {/* スキンケア結果 */}
          {skincare && (
            <div>
              <h3 className="font-semibold text-sm mb-1">
                マンダム製品おすすめスキンケア
              </h3>
              {skincare.split(/\n|(?=\d\.\s)/).map((paragraph, index) => (
                <p key={index} className="mb-2 text-sm leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          )}

          {/* ヘアケア結果 */}
          {haircare && (
            <div>
              <h3 className="font-semibold text-sm mb-1">
                マンダム製品おすすめヘアケア
              </h3>
              {haircare.split(/\n|(?=\d\.\s)/).map((paragraph, index) => (
                <p key={index} className="mb-2 text-sm leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
