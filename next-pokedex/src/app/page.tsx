import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";
import Link from 'next/link';

import {SearchResult} from "@/components/search-result"

export default function Home() {
  return (
    <div>
      <main>
        <h1>ポケモン図鑑へようこそ</h1>
        <p>お気に入りのポケモンを探してみよう！</p>
        
        <Card>
          <CardHeader>
            <CardTitle>ポケモン一覧</CardTitle>
            <CardDescription>すべてのポケモンを一覧で表示します。画像をクリックして詳細を確認できます。</CardDescription>
          </CardHeader>
          <CardContent>
            <Button><Link href="/pokemon">一覧を見る</Link></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ポケモン検索</CardTitle>
            <CardDescription>名前で検索してお気に入りのポケモンを見つけましょう。日本語で検索できます。</CardDescription>
          </CardHeader>
          <CardContent>
            <Button><Link href="/search">検索する</Link></Button>
          </CardContent>
        </Card>

      </main>
      <footer>
        <p>このアプリは<a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a>を使用しています</p>
      </footer>
      <SearchResult />
    </div>
  );
}
