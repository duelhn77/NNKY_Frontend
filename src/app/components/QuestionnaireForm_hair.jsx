import React, { useState } from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

const QUESTIONS = {
  q1: {
    title: 'Q1. 現在、髪に関して気になっていることを教えてください（複数選択可）',
    options: [
      '髪のボリュームがなくなってきた',
      '白髪が増えてきた',
      '髪型が似合っていない気がする',
      'スタイリングがうまく決まらない',
      '美容室でのオーダーがうまく伝わらない',
      '特にない／わからない',
    ],
  },
  q2: {
    title: 'Q2. 普段の髪のケアやセットについて、当てはまるものを教えてください（複数選択可）',
    options: [
      '毎朝スタイリングしている',
      '整髪料（ワックス・ジェルなど）を使っている',
      '白髪染めをしている（自宅または美容室）',
      '髪型は数年間変えていない',
      '特に何もしていない',
      'その他',
    ],
  },
  q3: {
    title: 'Q3. 今回のカウンセリングで知りたいことは？（複数選択可）',
    options: [
      '自分に似合う髪型や髪色を知りたい',
      '顔型や雰囲気に合ったスタイルを提案してほしい',
      '美容室での伝え方を教えてほしい',
      '薄毛や白髪の悩みをカバーする方法を知りたい',
      'その他',
    ],
  },
  q4: {
    title: 'Q4. 普段のライフスタイルや目的について教えてください（複数選択可）',
    options: [
      '仕事上、清潔感や信頼感が求められる',
      'プライベートでの印象を良くしたい',
      '初対面の人と会うことが多い',
      '特別な予定（面接・婚活・写真撮影など）がある',
      'とくに目的はないが、自分を変えたい',
    ],
  },
};


// ✅ ← onBack を受け取るように変更
export const QuestionnaireForm_hair = ({ onSubmit, onBack }) => {
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
