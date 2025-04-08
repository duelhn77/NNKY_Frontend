import { Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';

const consultationTypes = [
  {
    id: 'total',
    title: 'トータルカウンセリング',
    description: '何から相談すればいいかわからない」人のための総合ビジュアル相談',
    duration: '45分',
    price: '無料',
    image: '/total.png',
  },
  {
    id: 'skincare',
    title: '肌の悩み、そろそろ向き合いませんか？大人のスキンケア入門',
    description: '脂っぽさ・乾燥・くすみ・シミ…年齢肌の悩みは人それぞれ。市販のものでできるスキンケア方法から、日々のルーティンづくりまでサポートします。「何を使えばいいのかわからない」人でも、ゼロから始められます',
    duration: '30分',
    price: '無料',
    image: '/skincare.png' ,
  },
  {
    id: 'hairstyle',
    title: '自分に似合う髪型がわからない」大人のヘアスタイル相談',
    description: '髪のボリュームや白髪が気になる…そんな悩みに寄り添いながら、顔型・雰囲気・ライフスタイルに合った髪型・髪色をご提案。美容室でどうオーダーすればいいか、写真を使ってわかりやすくアドバイスします',
    duration: '30分',
    price: '無料',
    image: '/hairstyle.png',
  },
  
  {
    id: 'fashion',
    title: '仕事もプライベートも“好印象”に！TPO別ファッション相談',
    description: '「若作りじゃない、でもおしゃれに見せたい」。そんな40代男性のために、シーン別（仕事・デート・休日など）で“ちょうどいい”ファッションを提案します。手持ちの服を活かしたい、買い足すなら何がいい？などの相談も大歓迎',
    duration: '45分',
    price: '無料',
    image: '/fashion2.png',
  },
  {
    id: 'eyelash_beard',
    title: '“なんか垢抜けた？”と言われる！眉毛＆ひげ整えカウンセリング',
    description: '「なんとなくボサッとして見える」「老けて見える」と感じている方、実は眉毛やひげが原因かもしれません。顔立ちや印象に合わせて、眉の形・ひげのラインの整え方をご提案。自分でできるケア方法や、おすすめアイテム・サロン利用時のポイントもお伝えします',
    duration: '30分',
    price: '無料',
    image: '/fashion.png',
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
         <div className="relative aspect-[3/4] bg-white overflow-hidden">
          <img
            src={type.image}
            alt={type.title}
            className="w-full h-full object-cover object-top"
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
        <div className="mt-6 text-center">
  <Link
    href="/"
    className="inline-block text-sm text-blue-600 hover:underline hover:text-blue-800"
  >
  トップページに戻る
  </Link>
</div>
      </div>
    </main>
  );
}