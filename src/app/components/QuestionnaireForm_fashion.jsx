import React, { useState } from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

const QUESTIONS = {
  q1: {
    title: 'Q1. ファッションに関して、気になっている点を教えてください（複数選択可）',
    options: [
      '何が似合うのか分からない',
      '服の組み合わせに自信がない',
      '清潔感があるか不安',
      'TPOに合った服装が分からない',
      '年齢に合った服装が分からない',
      '特にない／わからない',
    ],
  },
  q2: {
    title: 'Q2. 普段どのようなシーンで服装に悩みますか？（複数選択可）',
    options: [
      '仕事（オフィス／営業）',
      '休日の私服（家族・友人との外出）',
      'デートやパートナーとの外出',
      '人前に出る場（会食・登壇など）',
      '冠婚葬祭・フォーマルな場面',
      '特に悩む場面はない',
    ],
  },
  q3: {
    title: 'Q3. 現在の服装・スタイルに対して、どのようなことをしていますか？（複数選択可）',
    options: [
      '自分なりに選んでいる',
      '家族やパートナーに相談している',
      '雑誌やSNSを参考にしている',
      'スタイリストやお店で相談したことがある',
      '特に何もしていない',
      'その他',
    ],
  },
  q4: {
    title: 'Q4. カウンセリングでどんなアドバイスを期待していますか？（複数選択可）',
    options: [
      '似合う服の選び方を知りたい',
      '具体的なコーディネート例がほしい',
      '手持ちの服を活かす方法を知りたい',
      '買い足すべきアイテムを教えてほしい',
      '印象を良くする方法を知りたい',
      'その他',
    ],
  },
};

// ✅ ← onBack を受け取るように変更
export const QuestionnaireForm_fashion = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    q1: [],
    q2: [],
    q3: [],
    q3_other: '',
    q4: [],
    q4_other: '',
  });

  const handleToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderQuestion = (field, question) => (
    <div key={field} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{question.title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {question.options.map((option) => (
          <label
            key={option}
            className={`relative flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-colors
              ${
                formData[field].includes(option)
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <input
              type="checkbox"
              value={option}
              checked={formData[field].includes(option)}
              onChange={() => handleToggle(field, option)}
              className="sr-only"
            />
            <span>{option}</span>
            {formData[field].includes(option) && (
              <Check className="absolute right-2 top-2 h-4 w-4" />
            )}
          </label>
        ))}
      </div>

      {formData[field].includes('その他') && (
        <input
          type="text"
          className="w-full border p-2 rounded mt-2"
          placeholder="具体的に記入してください"
          value={formData[`${field}_other`]}
          onChange={(e) => handleChange(`${field}_other`, e.target.value)}
        />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {Object.entries(QUESTIONS).map(([field, question]) =>
        renderQuestion(field, question)
      )}

      {/* ボタンエリア：左右に「戻る」「次へ」 */}
      <div className="pt-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto flex items-center px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          戻る
        </button>

        <button
          type="submit"
          className="w-full sm:w-auto flex items-center px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          カウンセリング予約へ進む
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </form>
  );
};
