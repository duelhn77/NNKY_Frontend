import React, { useState } from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

const QUESTIONS = {
  q1: {
    title: 'Q1. 気になっているパーツを教えてください（複数選択可）',
    options: [
      '肌（シミ・シワ・くすみなど）',
      '髪（薄毛・白髪・ボリュームなど）',
      'スタイル（体型・服の似合い方）',
      '眉・ヒゲ・ムダ毛などの印象',
      '清潔感や第一印象',
      '特にない／わからない',
    ],
  },
  q2: {
    title: 'Q2. どんなことに困っていますか？（複数選択可）',
    options: [
      '自分に合うケア方法や商品がわからない',
      '誰かに相談したいけど、どこに相談すれば良いか分からない',
      '見た目に気を遣いたいが、正直めんどうに感じている',
      '他人からどう見られているか気になっている',
      '特に悩みはない（カウンセリングを試したい）',
    ],
  },
  q3: {
    title: 'Q3. これまで何か対策をしたことはありますか？（複数選択可）',
    options: [
      'スキンケアなどを自己流でやっている',
      '商品は買ったことあるが、続かなかった',
      'まったく何もしていない',
      '病院・サロンなどに相談したことがある',
      'その他',
    ],
  },
  q4: {
    title: 'Q4. 今回の相談で知りたいことは？（複数選択可）',
    options: [
      '自分に合ったケアや対策を知りたい',
      '商品やサービスのおすすめが欲しい',
      '習慣化する方法を知りたい',
      '今の状態がどのレベルか把握したい',
      'その他',
    ],
  },
};

// ✅ ← onBack を受け取るように変更
export const QuestionnaireForm_total = ({ onSubmit, onBack }) => {
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
      <div className="pt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          戻る
        </button>

        <button
          type="submit"
          className="flex items-center px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          送信してカウンセリングへ進む
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </form>
  );
};
