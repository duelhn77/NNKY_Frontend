"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MyPage() {
  const [reservations, setReservations] = useState([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("🧩 userId:", userId); // ← ここで確認！

    if (!userId) {
      console.warn("⚠️ userIdが取得できませんでした");
      return;
    }

    const fetchReservations = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/reservations/user/${userId}`);
        setReservations(res.data);
      } catch (error) {
        console.error("❌ 予約取得エラー:", error);
      }
    };

    fetchReservations();
  }, []);

  

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">会員情報</h1>
      <h2 className="text-lg font-semibold mb-4">現在の予約情報</h2>
      {reservations.length === 0 ? (
        <p className="text-gray-500">現在予約はありません。</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((rsv, i) => (
            <li key={i} className="border p-4 rounded-lg bg-white shadow-sm">
              <p><strong>予約ID:</strong> {rsv.reservation_id}</p>
              <p><strong>スタイル:</strong> {rsv.consultation_style}</p>
              <p><strong>日時:</strong> {rsv.schedule ? new Date(rsv.schedule.start_time).toLocaleString("ja-JP") : "不明"}</p>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
