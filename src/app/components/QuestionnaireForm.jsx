import React, { useState } from 'react';
import { Check } from 'lucide-react';

const SKIN_TYPES = ['乾燥', '脂性', '混合', '敏感', '普通'];
const SKIN_CONCERNS = ['シミ', 'シワ', '毛穴', 'くすみ', 'ニキビ', 'たるみ', '赤み'];
const SKINCARE_ITEMS = ['化粧水', '美容液', '乳液', 'クリーム', '洗顔料', '日焼け止め', 'パック・マスク'];

export const QuestionnaireForm = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    skinType: '',
    skinConcerns: [],
    skincareItems: [],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.skinType) {
      newErrors.skinType = '肌タイプを選択してください';
    }
    if (formData.skinConcerns.length === 0) {
      newErrors.skinConcerns = '肌の悩みを1つ以上選択してください';
    }
    if (formData.skincareItems.length === 0) {
      newErrors.skincareItems = 'スキンケアアイテムを1つ以上選択してください';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleSkinConcernToggle = (concern) => {
    setFormData(prev => ({
      ...prev,
      skinConcerns: prev.skinConcerns.includes(concern)
        ? prev.skinConcerns.filter(c => c !== concern)
        : [...prev.skinConcerns, concern]
    }));
  };

  const handleSkincareItemToggle = (item) => {
    setFormData(prev => ({
      ...prev,
      skincareItems: prev.skincareItems.includes(item)
        ? prev.skincareItems.filter(i => i !== item)
        : [...prev.skincareItems, item]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          あなたの肌状態に最も近いものを選んでください
          <span className="text-red-500 ml-1">*</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SKIN_TYPES.map((type) => (
            <label
              key={type}
              className={`
                relative flex items-center justify-center p-4 rounded-lg border
                ${formData.skinType === type
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : 'border-gray-200 hover:border-gray-300'
                }
                cursor-pointer transition-colors
              `}
            >
              <input
                type="radio"
                name="skinType"
                value={type}
                checked={formData.skinType === type}
                onChange={(e) => setFormData(prev => ({ ...prev, skinType: e.target.value }))}
                className="sr-only"
              />
              <span>{type}</span>
              {formData.skinType === type && (
                <Check className="absolute right-2 top-2 h-4 w-4" />
              )}
            </label>
          ))}
        </div>
        {errors.skinType && (
          <p className="text-red-500 text-sm">{errors.skinType}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          特に気になっている肌悩みはどれですか？
          <span className="text-red-500 ml-1">*</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SKIN_CONCERNS.map((concern) => (
            <label
              key={concern}
              className={`
                relative flex items-center justify-center p-4 rounded-lg border
                ${formData.skinConcerns.includes(concern)
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : 'border-gray-200 hover:border-gray-300'
                }
                cursor-pointer transition-colors
              `}
            >
              <input
                type="checkbox"
                checked={formData.skinConcerns.includes(concern)}
                onChange={() => handleSkinConcernToggle(concern)}
                className="sr-only"
              />
              <span>{concern}</span>
              {formData.skinConcerns.includes(concern) && (
                <Check className="absolute right-2 top-2 h-4 w-4" />
              )}
            </label>
          ))}
        </div>
        {errors.skinConcerns && (
          <p className="text-red-500 text-sm">{errors.skinConcerns}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          普段のスキンケアで使っているアイテムを選んでください
          <span className="text-red-500 ml-1">*</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SKINCARE_ITEMS.map((item) => (
            <label
              key={item}
              className={`
                relative flex items-center justify-center p-4 rounded-lg border
                ${formData.skincareItems.includes(item)
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : 'border-gray-200 hover:border-gray-300'
                }
                cursor-pointer transition-colors
              `}
            >
              <input
                type="checkbox"
                checked={formData.skincareItems.includes(item)}
                onChange={() => handleSkincareItemToggle(item)}
                className="sr-only"
              />
              <span>{item}</span>
              {formData.skincareItems.includes(item) && (
                <Check className="absolute right-2 top-2 h-4 w-4" />
              )}
            </label>
          ))}
        </div>
        {errors.skincareItems && (
          <p className="text-red-500 text-sm">{errors.skincareItems}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          その他、ご要望・ご相談内容があればご記入ください
        </h3>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border-gray-200 focus:border-gray-500 focus:ring-gray-500"
          placeholder="例：普段のメイクの悩みや、試してみたい商品についてなど"
        />
      </div>

      <div className="pt-6 space-y-4">
  <button
    type="submit"
    className="w-full md:w-auto px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
  >
    送信してカウンセリングへ進む
  </button>

  <div>
    <button
      type="button"
      onClick={onBack}
      className="flex items-center px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
    >
      ← 戻る
    </button>
  </div>
</div>
</form>