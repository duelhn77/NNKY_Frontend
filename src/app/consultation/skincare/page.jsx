"use client";
import React, { useState } from 'react';
import { StepBar } from '@/components/StepBar';
import { Calendar } from '@/components/Calendar';
import { TimeSlots } from '@/components/TimeSlots';
import { UserForm } from '@/components/UserForm';
import { QuestionnaireForm } from '@/components/QuestionnaireForm';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const STEPS = ['コース選択', '問診回答', '日時選択', 'ログイン/会員登録', '予約内容確認'];

const MOCK_TIME_SLOTS = [
  { time: '10:00-10:30', available: true },
  { time: '10:30-11:00', available: false },
  { time: '11:00-11:30', available: true },
  { time: '11:30-12:00', available: true },
  { time: '13:00-13:30', available: false },
  { time: '13:30-14:00', available: true },
  { time: '14:00-14:30', available: true },
  { time: '14:30-15:00', available: false },
];

function App() {
  const [currentStep, setCurrentStep] = useState(2);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    consultationType: 'メイクアップ',
    questionnaire: null,
    date: null,
    timeSlot: null,
    userInfo: {
      lastName: '',
      firstName: '',
      lastNameKana: '',
      firstNameKana: '',
      phone: '',
      email: '',
      notes: '',
    },
  });
  const [errors, setErrors] = useState({});

  const validateUserInfo = () => {
    const newErrors = {};
    
    if (!bookingDetails.userInfo.lastName) {
      newErrors.lastName = '姓を入力してください';
    }
    if (!bookingDetails.userInfo.firstName) {
      newErrors.firstName = '名を入力してください';
    }
    if (!bookingDetails.userInfo.lastNameKana) {
      newErrors.lastNameKana = 'セイを入力してください';
    }
    if (!bookingDetails.userInfo.firstNameKana) {
      newErrors.firstNameKana = 'メイを入力してください';
    }
    if (!bookingDetails.userInfo.phone) {
      newErrors.phone = '電話番号を入力してください';
    }
    if (!bookingDetails.userInfo.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(bookingDetails.userInfo.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 4 && !validateUserInfo()) {
      return;
    }
    
    // Authentication flow check after date selection
    if (currentStep === 3) {
      if (isAuthenticated) {
        setCurrentStep(5); // Skip to confirmation if authenticated
        return;
      }
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleQuestionnaireSubmit = (questionnaireData) => {
    setBookingDetails((prev) => ({
      ...prev,
      questionnaire: questionnaireData,
    }));
    handleNext();
  };

  const handleConfirm = () => {
    console.log('Booking confirmed:', bookingDetails);
    alert('予約が完了しました。');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setCurrentStep(5); // Proceed to confirmation step
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setCurrentStep(5); // Proceed to confirmation step
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          オンラインカウンセリング予約
        </h1>

        <StepBar currentStep={currentStep} steps={STEPS} />

        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">
                {bookingDetails.consultationType}
              </h2>
              <p className="text-gray-600 mb-4">
                こんなかたにおすすめ！
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-8">
                <li>肌、または、パーツ別のテクニックが知りたい方</li>
                <li>パーソナルカラー（ブルベ、イエベ）に合った色選びをしたい方</li>
              </ul>
              <p className="text-sm text-gray-500">
                ※予定時間：30分
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">
                事前アンケート
              </h2>
              <p className="text-gray-600 mb-8">
                より良いカウンセリングのため、以下の質問にお答えください。
              </p>
              <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <Calendar
                selectedDate={bookingDetails.date}
                onDateSelect={(date) =>
                  setBookingDetails((prev) => ({ ...prev, date }))
                }
              />
              {bookingDetails.date && (
                <TimeSlots
                  slots={MOCK_TIME_SLOTS}
                  selectedTime={bookingDetails.timeSlot}
                  onTimeSelect={(time) =>
                    setBookingDetails((prev) => ({ ...prev, timeSlot: time }))
                  }
                />
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6">ログインまたは会員登録</h2>
              <p className="text-gray-600">このまま予約を確定するには、ログインまたは新規登録が必要です。</p>
              
              {/* ログインフォーム */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4">ログイン</h3>
                <form className="space-y-4" onSubmit={handleLogin}>
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="パスワード"
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    ログイン
                  </button>
                </form>
              </div>

              {/* 会員登録フォーム */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4">会員登録</h3>
                <form className="space-y-3" onSubmit={handleRegister}>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="姓（漢字）"
                      className="border px-2 py-1 rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="名（漢字）"
                      className="border px-2 py-1 rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="セイ（カタカナ）"
                      className="border px-2 py-1 rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="メイ（カタカナ）"
                      className="border px-2 py-1 rounded"
                      required
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="電話番号"
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <input
                    type="date"
                    placeholder="生年月日"
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="パスワード"
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    会員登録
                  </button>
                </form>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6">予約内容の確認</h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium">コース</h3>
                  <p>{bookingDetails.consultationType}</p>
                </div>
                {bookingDetails.questionnaire && (
                  <div className="border-b pb-4">
                    <h3 className="font-medium">アンケート回答</h3>
                    <p>肌タイプ: {bookingDetails.questionnaire.skinType}</p>
                    <p>お悩み: {bookingDetails.questionnaire.skinConcerns.join(', ')}</p>
                    <p>使用中のアイテム: {bookingDetails.questionnaire.skincareItems.join(', ')}</p>
                    {bookingDetails.questionnaire.notes && (
                      <p>その他ご要望: {bookingDetails.questionnaire.notes}</p>
                    )}
                  </div>
                )}
                <div className="border-b pb-4">
                  <h3 className="font-medium">予約日時</h3>
                  <p>
                    {bookingDetails.date?.toLocaleDateString('ja-JP')} {bookingDetails.timeSlot}
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-medium">お客様情報</h3>
                  <p>
                    {bookingDetails.userInfo.lastName} {bookingDetails.userInfo.firstName}
                  </p>
                  <p>
                    {bookingDetails.userInfo.lastNameKana} {bookingDetails.userInfo.firstNameKana}
                  </p>
                  <p>{bookingDetails.userInfo.phone}</p>
                  <p>{bookingDetails.userInfo.email}</p>
                </div>
                {bookingDetails.userInfo.notes && (
                  <div>
                    <h3 className="font-medium">ご要望・ご相談内容</h3>
                    <p>{bookingDetails.userInfo.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {currentStep > 1 && currentStep !== 2 && (
              <button
                onClick={handleBack}
                className="flex items-center px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft size={16} className="mr-2" />
                戻る
              </button>
            )}
            {currentStep < STEPS.length && currentStep !== 2 && (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 ml-auto"
              >
                次へ
                <ArrowRight size={16} className="ml-2" />
              </button>
            )}
            {currentStep === STEPS.length && (
              <button
                onClick={handleConfirm}
                className="flex items-center px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 ml-auto"
              >
                予約を確定する
                <ArrowRight size={16} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;