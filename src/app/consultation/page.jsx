import { Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';

const consultationTypes = [
  {
    id: 'skincare',
    title: 'スキンケアカウンセリング',
    description: 'お肌の悩みに合わせたスキンケアのアドバイスを提供します',
    duration: '30分',
    price: '無料',
    image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'makeup',
    title: 'メイクアップカウンセリング',
    description: 'あなたに似合うメイクアップをご提案します',
    duration: '45分',
    price: '無料',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'total',
    title: 'トータルビューティーカウンセリング',
    description: 'スキンケアからメイクアップまで総合的なアドバイスを提供します',
    duration: '60分',
    price: '無料',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            オンラインカウンセリング予約
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[390px] mx-auto px-4 pt-20 pb-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            あなたに合わせたビューティーアドバイス
          </h2>
          <p className="text-sm text-gray-600">
            経験豊富なビューティーコンサルタントが、オンラインであなたの美しさを引き出すお手伝いをいたします。
          </p>
        </div>

        {/* Consultation Types */}
        <div className="space-y-4">
          {consultationTypes.map((type) => (
            <Link
              key={type.id}
              href={`/consultation/${type.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-2px]"
            >
              <div className="relative h-40">
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {type.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    1:1
                  </div>
                  <div className="text-red-600 font-medium">{type.price}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Notes */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            ご予約に関する注意事項
          </h3>
          <ul className="text-xs text-gray-600 space-y-2">
            <li>・ご予約は30分前まで受け付けております</li>
            <li>・キャンセルは24時間前までにお願いいたします</li>
            <li>・通信環境の良い場所からご参加ください</li>
            <li>・カメラをオンにしてご参加いただきます</li>
          </ul>
        </div>
      </div>
    </main>
  );
}