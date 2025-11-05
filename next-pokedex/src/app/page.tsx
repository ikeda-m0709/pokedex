import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Home() {

  return (
    <div  className="min-h-screen flex flex-col">{/*画面の高さと同じ最小高さを設定（100vh）*/}
      <main className="flex-1">{/*一番下のAPIリンクを画面下に出す設定（自分だけで残りの高さを満たす）② */}
        <h1 className="text-center text-gray-800 mt-5">ポケモン図鑑へようこそ</h1>
        <p className="text-center">お気に入りのポケモンを探してみよう！</p>
        
        <div className="grid grid-cols-2 gap-5 max-w-3xl mx-auto mt-20">
          <Card>
            <CardHeader>
              <CardTitle>ポケモン一覧</CardTitle>
              <CardDescription>すべてのポケモンを一覧で表示します。<br />画像をクリックして詳細を確認できます。</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button><Link href="/pokemon">一覧を見る</Link></Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ポケモン検索</CardTitle>
              <CardDescription>名前で検索してお気に入りのポケモンを見つけましょう。<br />日本語（ひらがな・カタカナ）で検索できます。</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button><Link href="/search">検索する</Link></Button>
            </CardContent>
          </Card>
        </div>
      </main>
        <p className="text-center text-gray-700">このアプリは<a className="text-blue-600" href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a>を使用しています</p>
    </div>
  );
}
