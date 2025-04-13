import React, { useState } from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

const QUESTIONS = {
  q1: {
    title: 'Q1. 現在、気になっている見た目のポイントを教えてください（複数選択可）',
    options: [
      '眉毛がボサボサ・整っていない',
      'ひげの剃り跡が青い・濃い',
      '眉毛やひげが老けて見える印象につながっている気がする',
      '顔全体がなんとなく垢抜けない',
      '眉毛やひげの整え方がわからない',
      '特にない／わからない',
    ],
  },
  q2: {
    title: 'Q2. 普段、眉毛やひげのケアについてどのようなことをしていますか？（複数選択可）',
    options: [
      '自己流で整えている（剃る・抜くなど）',
      '道具（眉毛バサミ・シェーバーなど）を使っている',
      '美容院・サロンで整えてもらったことがある',
      'ネットや動画を参考にしている',
      '特に何もしていない',
      'その他',
    ],
  },
  q3: {
    title: 'Q3. 今回のカウンセリングで知りたいことは？（複数選択可）',
    options: [
      '自分に似合う眉毛・ひげの形を知りたい',
      'セルフケアの方法を教えてほしい',
      'おすすめのケアグッズやサロンを知りたい',
      '他人からの印象をよくしたい',
      'その他',
    ],
  },
  q4: {
    title: 'Q4. ご自身の印象について、気になっていることはありますか？（複数選択可）',
    options: [
      '「老けた」と言われることがある',
      '「疲れてる？」と言われやすい',
      '「なんとなく暗い印象」と言われたことがある',
      '「垢抜けてない」と感じることがある',
      '特にない／わからない',
    ],
  },
};


// ✅ ← onBack を受け取るように変更
export const QuestionnaireForm_eyebrows = ({ onSubmit, onBack }) => {
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
