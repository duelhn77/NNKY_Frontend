"use client";

import React, { useState, useEffect } from 'react'; // 4/13のな修正 useEffect追加

import { StepBar } from '@/components/StepBar';
import { Calendar } from '@/components/Calendar';
import { TimeSlots } from '@/components/TimeSlots';
import { UserForm } from '@/components/UserForm';
import { QuestionnaireForm_hair } from '@/components/QuestionnaireForm_hair';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import axios from "axios";
import { PrimaryButton } from "@/components/PrimaryButton";


const STEPS = ['コース選択', '問診回答', '日時選択', 'ログイン/会員登録', '予約内容確認'];

// const MOCK_TIME_SLOTS = [
//   { time: '10:00-10:30', available: true },
//   { time: '10:30-11:00', available: false },
//   { time: '11:00-11:30', available: true },
//   { time: '11:30-12:00', available: true },
//   { time: '13:00-13:30', available: false },
//   { time: '13:30-14:00', available: true },
//   { time: '14:00-14:30', available: true },
//   { time: '14:30-15:00', available: false },
// ];

const DEFAULT_TIME_SLOTS = [
  '10:00-10:30',
  '10:30-11:00',
  '11:00-11:30',
  '11:30-12:00',
  '13:00-13:30',
  '13:30-14:00',
  '14:00-14:30',
  '14:30-15:00'

];




function App() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // 4/13のな修正 userステート追加
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    consultationType: 'ヘアカウンセリング',
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
 
  useEffect(() => {
    const fetchBookedSchedules = async () => {
      if (!bookingDetails.date) return;
  
      try {
        const res = await axios.get(`${BACKEND_URL}/schedules`);
        const selectedDate = new Date(bookingDetails.date).toDateString();
  
        setSchedules(res.data); // ✅ ここで全体のスケジュール保存！
  
        // 予約済みスロットを絞り込み
        const bookedSlots = res.data
          .filter(s => {
            const sDate = new Date(s.start_time).toDateString();
            return s.reservation_status === "booked" && sDate === selectedDate;
          })
          .map(s => {
            const start = new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const end = new Date(s.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `${start}-${end}`;
          });
  
        setBookedTimeSlots(bookedSlots);
      } catch (error) {
        console.error("スケジュール取得エラー:", error);
      }
    };
  
    fetchBookedSchedules();
  }, [bookingDetails.date]);
  
  


  const timeSlotsWithAvailability = DEFAULT_TIME_SLOTS.map((timeStr) => {
    const matchedSchedule = schedules.find((s) => {
      const sDate = new Date(s.start_time).toDateString();
      const selectedDate = new Date(bookingDetails.date).toDateString();
      if (sDate !== selectedDate) return false;
  
      const start = new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const end = new Date(s.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formatted = `${start}-${end}`;
      return formatted === timeStr;
    });
  
    return {
      id: matchedSchedule?.schedule_id ?? null,  // ←仮IDでもOK
      time: timeStr,
      available: matchedSchedule ? matchedSchedule.reservation_status === 'open' : true,
  // open のときだけ true
    };
  });
  
   
  

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
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

  

  // ① 関数の上部で定義（handleConfirmより上の位置）に追加
  const toJSTISOString = (date) => {
   const offsetMs = date.getTimezoneOffset() * 60 * 1000;
   const localDate = new Date(date.getTime() - offsetMs);
   return localDate.toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:mm:ss'
  };



  // 4/12 作業
  const handleConfirm = async () => {
    if (!bookingDetails.date || !bookingDetails.timeSlot) {
      alert("日付と時間を選択してください");
      return;
    }
  
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      alert("ユーザー情報が見つかりません。ログインし直してください。");
      return;
    }
  
    let scheduleId = selectedScheduleId;
  
    if (!scheduleId) {
      const [start, end] = bookingDetails.timeSlot.split('-');
      const selectedDate = new Date(bookingDetails.date);
      const startTime = new Date(selectedDate);
      const endTime = new Date(selectedDate);
      const [startHour, startMinute] = start.split(':');
      const [endHour, endMinute] = end.split(':');
      startTime.setHours(parseInt(startHour), parseInt(startMinute));
      endTime.setHours(parseInt(endHour), parseInt(endMinute));
      
      const newScheduleRes = await axios.post(`${BACKEND_URL}/schedules`, {
        course_id: 1,
        start_time: toJSTISOString(startTime),
        end_time: toJSTISOString(endTime),
        reservation_status: "booked",
        partner_id: 101
      });
      scheduleId = newScheduleRes.data.schedule_id;
    }
  
    try {
      const reservationRes = await axios.post(`${BACKEND_URL}/reservations`, {
        user_id: parseInt(user_id),
        schedule_id: scheduleId,
        consultation_style: bookingDetails.consultationType
      });
  
      const reservationId = reservationRes.data.reservation_id;
      const q = bookingDetails.questionnaire;
      const answerText = [
        `Q1: ${q.q1?.join(', ') ?? ''}`,
        `Q2: ${q.q2?.join(', ') ?? ''}`,
        `Q3: ${q.q3?.join(', ') ?? ''}${q.q3_other ? `, 補足: ${q.q3_other}` : ''}`,
        `Q4: ${q.q4?.join(', ') ?? ''}${q.q4_other ? `, 補足: ${q.q4_other}` : ''}`
      ].join('\n');
  
      await axios.post(`${BACKEND_URL}/presurveys`, {
        reservation_id: reservationId,
        age_group: getAgeGroup(registerForm.birthDate),
        item_preparation: false,
        concern_parts: '',
        troubles: '',
        past_experience: '',
        consultation_goal: '',
        free_comment: answerText,
      });
  
      alert("予約が完了しました。");
    } catch (error) {
      console.error("予約エラー:", error);
      alert("予約中にエラーが発生しました。");
    }
  };
  
  
  
  


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const response = await axios.post(`${BACKEND_URL}/login`, {
        email: loginForm.email,
        password: loginForm.password
      });
      if (response.data) {
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        setCurrentStep(5);
        localStorage.setItem("user_id", response.data.user_id);
      }
    } catch (error) {
      const msg =
        error.response?.data?.detail ??
        error.message ??
        "不明なエラーが発生しました";

      alert(`ログインに失敗しました。\n${msg}`);
    }finally {
      setLoading(false); // ← 追加
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
  
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
    }finally {
      setLoading(false); // ← 追加
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

                <li>髪のボリュームが無くなってきてケアの方法を知りたい</li>
                <li>今の自分に合ったヘアスタイルを知りたい</li>
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

              <QuestionnaireForm_hair
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
            <>
              {console.log("🧪 slots に渡してる値:", timeSlotsWithAvailability)}
              <TimeSlots
            slots={timeSlotsWithAvailability}
            selectedTime={bookingDetails.timeSlot}
            onTimeSelect={(timeStr) => {
              setSelectedTimeSlot(timeStr);
              setBookingDetails((prev) => ({
                ...prev,
                timeSlot: timeStr,
              }));
          
              // 該当するスケジュールがある場合のみ schedule_id 設定
              const matched = timeSlotsWithAvailability.find(s => s.time === timeStr);
              setSelectedScheduleId(matched?.id ?? null);
            }}
          />
          
            </>
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
                            <PrimaryButton type="submit" disabled={loading}>
                              ログイン
                            </PrimaryButton>
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
                            <PrimaryButton type="submit" disabled={loading}>
                             会員登録
                            </PrimaryButton>
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
                             {bookingDetails.date?.toLocaleDateString('ja-JP')} {bookingDetails.timeSlot}
                            </p>
                          </div>
                          {/* <div className="border-b pb-4">
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
                          )} */}
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