// src/components/HeroSection.jsx
"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="bg-white py-16 px-4 md:px-12">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-8">
        {/* 左側テキスト */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-snug">
            あなたの印象、<br className="md:hidden" />
            プロが整えます。
          </h1>
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
            身だしなみや見た目の悩みを、<br className="md:hidden" />
            パーソナルカウンセラーが丁寧にサポート。<br />
            スキンケア・ファッション・ヘアスタイルまで。
          </p>
          <div className="mt-6">
            <a
              href="/quickdiagnose"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              無料3分診断を受ける
            </a>
          </div>
        </motion.div>

        {/* 右側画像 */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img
            src="/hero-man.png"
            alt="印象を整える男性"
            className="w-full h-auto object-cover rounded-xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
