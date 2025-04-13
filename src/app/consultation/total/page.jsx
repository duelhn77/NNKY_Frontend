"use client";
import React, { useState, useEffect } from 'react'; // 4/13のな修正 useEffect追加
import { StepBar } from '@/components/StepBar';
import { Calendar } from '@/components/Calendar';
import { TimeSlots } from '@/components/TimeSlots';
import { UserForm } from '@/components/UserForm';
import { QuestionnaireForm_total } from '@/components/QuestionnaireForm_total';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import axios from "axios";

const STEPS = ['コース選択', '問診回答', '日時選択', 'ログイン/会員登録', '予約内容確認'];

const MOCK_TIME_SLOTS = [
  { id: 1, time: '10:00-10:30', available: true },
  { id: 2, time: '10:30-11:00', available: false },
  { id: 3, time: '11:00-11:30', available: true },
  { id: 4, time: '11:30-12:00', available: true },
  { id: 5, time: '13:00-13:30', available: false },
  { id: 6, time: '13:30-14:00', available: true },
  { id: 7, time: '14:00-14:30', available: true },
  { id: 8, time: '14:30-15:00', available: false },
];

function App() {
  const [currentStep, setCurrentStep] = useState(2);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null); // 4/13のな修正 userステート追加
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [registerForm, setRegisterForm] = useState({
      firstName: '',
      lastName: '',
      firstNameKana: '',
      lastNameKana: '',
      email: '',
      phone: '',
      password: '',
      birthDate: '',
    });
  const [bookingDetails, setBookingDetails] = useState({
    consultationType: 'トータルカウンセリング',
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
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []); // 4/13のな修正 ローカルストレージからuser復元

  const validateUserInfo = () => {
    const newErrors = {};
    if (!bookingDetails.userInfo.lastName) newErrors.lastName = '姓を入力してください';
    if (!bookingDetails.userInfo.firstName) newErrors.firstName = '名を入力してください';
    if (!bookingDetails.userInfo.lastNameKana) newErrors.lastNameKana = 'セイを入力してください';
    if (!bookingDetails.userInfo.firstNameKana) newErrors.firstNameKana = 'メイを入力してください';
    if (!bookingDetails.userInfo.phone) newErrors.phone = '電話番号を入力してください';
    if (!bookingDetails.userInfo.email) newErrors.email = 'メールアドレスを入力してください';
    else if (!/\S+@\S+\.\S+/.test(bookingDetails.userInfo.email)) newErrors.email = '有効なメールアドレスを入力してください';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 4 && !validateUserInfo()) return;
    if (currentStep === 3 && isAuthenticated) {
      setCurrentStep(5);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleQuestionnaireSubmit = (data) => {
    setBookingDetails(prev => ({ ...prev, questionnaire: data }));
    handleNext();
  }; // ✅ 4/13のな修正 一時保存のみに修正

  const getAgeGroup = (birthDateStr) => {
    const birth = new Date(birthDateStr);
    const age = new Date().getFullYear() - birth.getFullYear();
    if (age < 30) return '20代以下';
    if (age < 40) return '30代';
    if (age < 50) return '40代';
    return '50代以上';
  }; // ✅ 4/13のな修正 年代計算

  const handleConfirm = async () => {
    try {
      console.log("送信データ確認", bookingDetails.timeSlot); //4/13 デバッグ追加
      const res = await axios.post(`${BACKEND_URL}/reservations`, {
        user_id: user.user_id,
        schedule_id: bookingDetails.timeSlot.id, // 4/13のな修正 timeSlot は id を持つオブジェクト
        consultation_style: bookingDetails.consultationType,
      });
      const reservationId = res.data.reservation_id;
      const q = bookingDetails.questionnaire;
      const ageGroup = getAgeGroup(registerForm.birthDate);
      await axios.post(`${BACKEND_URL}/presurveys`, {
        reservation_id: reservationId,
        age_group: ageGroup,
        item_preparation: false,
        concern_parts: q.q1.join(','),
        troubles: q.q2.join(','),
        past_experience: [...(q.q3 || []), q.q3_other || ''].filter(Boolean).join(','),
        consultation_goal: [...(q.q4 || []), q.q4_other || ''].filter(Boolean).join(','),
        free_comment: '',
      });
      alert('予約が完了しました。');
    } catch (err) {
      console.error("送信エラー", err);
      alert("送信に失敗しました");
    }
  }; // ✅ 4/13のな修正

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, loginForm);
      if (response.data) {
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(response.data)); // ✅ 4/13のな修正 user保存
        setUser(response.data);
        setIsAuthModalOpen(false);
        setCurrentStep(5);
      }
    } catch (error) {
      const msg = error.response?.data?.detail ?? error.message ?? "不明なエラーが発生しました";
      alert(`ログインに失敗しました。\n${msg}`);
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${BACKEND_URL}/register`, {
        name: registerForm.firstName + registerForm.lastName,
        name_kana: registerForm.firstNameKana + registerForm.lastNameKana,
        email: registerForm.email,
        password: registerForm.password,  // ✅ハッシュしない
        birth_date: registerForm.birthDate, // yyyy-mm-dd 形式
      });
  
      alert("会員登録に成功しました！");
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error("登録エラー:", error.response?.data || error);
      alert("会員登録に失敗しました。");
    }
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
                <li>年齢にあった見た目のケアについてプロに相談したい</li>
                <li>身の回りに相談できる相手がいない</li>
              </ul>
              <p className="text-sm text-gray-500">
                ※予定時間：45分
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
              <QuestionnaireForm_total
                onSubmit={handleQuestionnaireSubmit}
                onBack={handleBack}
              />

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
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="パスワード"
                    className="w-full border px-3 py-2 rounded"
                    required
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
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
                      value={registerForm.lastName}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, lastName: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="名（漢字）"
                      className="border px-2 py-1 rounded"
                      required
                      value={registerForm.firstName}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, firstName: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="セイ（カタカナ）"
                      className="border px-2 py-1 rounded"
                      required
                      value={registerForm.lastNameKana}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, lastNameKana: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="メイ（カタカナ）"
                      className="border px-2 py-1 rounded"
                      required
                      value={registerForm.firstNameKana}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, firstNameKana: e.target.value })
                      }
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    className="w-full border px-3 py-2 rounded"
                    required
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, email: e.target.value })
                    }
                  />
                  <input
                    type="tel"
                    placeholder="電話番号"
                    className="w-full border px-3 py-2 rounded"
                    required
                    value={registerForm.phone}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, phone: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    placeholder="生年月日"
                    className="w-full border px-3 py-2 rounded"
                    required
                    value={registerForm.birthDate}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, birthDate: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="パスワード"
                    className="w-full border px-3 py-2 rounded"
                    required
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, password: e.target.value })
                    }
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
                  <div className="border-b pb-4 space-y-2">
                    <h3 className="font-medium">アンケート回答</h3>

                    <p><strong>Q1:</strong> {bookingDetails.questionnaire.q1?.join(', ') || '未回答'}</p>
                    <p><strong>Q2:</strong> {bookingDetails.questionnaire.q2?.join(', ') || '未回答'}</p>
                    <p><strong>Q3:</strong> {bookingDetails.questionnaire.q3?.join(', ') || '未回答'}</p>
                    {bookingDetails.questionnaire.q3?.includes('その他') && bookingDetails.questionnaire.q3_other && (
                      <p><strong>Q3-補足:</strong> {bookingDetails.questionnaire.q3_other}</p>
                    )}
                    <p><strong>Q4:</strong> {bookingDetails.questionnaire.q4?.join(', ') || '未回答'}</p>
                    {bookingDetails.questionnaire.q4?.includes('その他') && bookingDetails.questionnaire.q4_other && (
                      <p><strong>Q4-補足:</strong> {bookingDetails.questionnaire.q4_other}</p>
                    )}
                  </div>
                )}

                <div className="border-b pb-4">
                  <h3 className="font-medium">予約日時</h3>
                  <p>
                   {bookingDetails.date?.toLocaleDateString('ja-JP')} {bookingDetails.timeSlot?.time}
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