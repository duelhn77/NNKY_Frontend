"use client";

import { useState } from "react";

export default function QuickDiagnose() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [skincare, setSkincare] = useState<string>("");
  const [haircare, setHaircare] = useState<string>("");

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
  };

  const fetchRecommendation = async (type: "skincare" | "haircare") => {
    const formData = new FormData();
    const basePrompt =
      type === "skincare"
        ? "40代の男性向けにおすすめのスキンケアをマンダム製品の中から提案してください。"
        : "40代の男性向けにおすすめのヘアケアをマンダム製品の中から提案してください。";

    formData.append("prompt", basePrompt);

    const res = await fetch(`${BACKEND_URL}/diagnose`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (type === "skincare") setSkincare(data.result);
    else setHaircare(data.result);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">クイック診断</h1>

      <input
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleCapture}
        className="mb-4 w-full"
      />

      {preview && (
        <div className="flex flex-col items-center space-y-2">
          <img
            src={preview}
            alt="preview"
            className="rounded w-full max-w-xs"
          />
          <button
            onClick={handleSubmit}
            className="w-full md:w-48 px-4 py-2 bg-blue-500 text-white rounded"
          >
            この写真で診断
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">診断結果</h2>
            {result.split(/\n|(?=\d\.\s)/).map((paragraph, index) => (
              <p key={index} className="mb-2 text-sm leading-relaxed">
                {paragraph.trim()}
                </p>
              ))}

          </div>

          <div className="flex flex-col items-center space-y-2">
            <button
              className="w-full md:w-48 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => fetchRecommendation("skincare")}
            >
              おすすめのスキンケア
            </button>
            <button
              className="w-full md:w-48 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => fetchRecommendation("haircare")}
            >
              おすすめのヘアケア
            </button>
          </div>

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
