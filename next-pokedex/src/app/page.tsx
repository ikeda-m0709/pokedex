"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";
import Link from 'next/link';

import {getEvolution,getEvolutionDetails,buildEvolutionSteps }from "@/lib/pokeapi"
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    async function checkEvolution() {
      const a = await getEvolution("4");
      if (a !== null) {
        const b = getEvolutionDetails(a);
        const c = buildEvolutionSteps(a);
        console.log("chainの中身:", a);
        console.log("chainの中のevolution details:", b);
        console.log("ポケモン配列resultの中:", c);
      }
    }
    checkEvolution();
  }, []);

  return (
    <div>
      <main className="mx-4">
        <h1 className="text-center mt-10">ポケモン図鑑へようこそ</h1>
        <p className="text-center mt-3">お気に入りのポケモンを探してみよう！</p>
        
        <div className="grid grid-cols-2 gap-10 max-w-3xl mx-auto mt-20">
          <Card>
            <CardHeader>
              <CardTitle>ポケモン一覧</CardTitle>
              <CardDescription>すべてのポケモンを一覧で表示します。画像をクリックして詳細を確認できます。</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button><Link href="/pokemon">一覧を見る</Link></Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ポケモン検索</CardTitle>
              <CardDescription>名前で検索してお気に入りのポケモンを見つけましょう。日本語（ひらがな・カタカナ）で検索できます。</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button><Link href="/search">検索する</Link></Button>
            </CardContent>
          </Card>
        </div>
      </main>
        <p className=" mt-50 text-center text-gray-700">このアプリは<a className="text-blue-600" href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a>を使用しています</p>
    </div>
  );
}
