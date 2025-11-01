import Image from 'next/image'
import { ProcessedPokemon } from "@/lib/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Suspense } from 'react'
import { Loading } from './loading';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button'


export default async function PokemonDetail({ pokemon }: {pokemon: ProcessedPokemon}) {

    return (
        <Suspense fallback={<Loading />}>
            <Card>
                <main>
                    <CardHeader>
                        <p>{String(pokemon.id).padStart(3, "0")}</p>
                    </CardHeader>
                    <CardTitle>
                        <h2>{pokemon.japaneseName}</h2>
                    </CardTitle>
                    <CardContent>
                        <Image src={pokemon.imageUrl} alt="ポケモン画像" width="300" height="300"/>
                        <div>
                            <h3>基本情報</h3>
                            <p>分類：{pokemon.genus}</p>
                            <p>高さ：{pokemon.height}m</p>
                            <p>重さ：{pokemon.weight}kg</p>
                        </div>
                        <div>
                            <h3>タイプ</h3>
                            <p>{pokemon.types.join(', ')}</p>{/*typesも日本語にしないと！ */}
                        </div>
                        <div>
                            <h3>特性</h3>
                            {pokemon.abilities.map((ability, index) => (
                                <ul key={index}>
                                    <li>{ability.name}</li>
                                    <li>{ability.effect}</li>
                                </ul>
                            ))}
                        </div>
                        <div>
                            <h3>進化系統</h3>
                            <Link className={buttonVariants({ variant: "outline", size:"icon-custom" })} href={`/evolution/${pokemon.id}`}>進化系統ページへ</Link>

                        </div>
                    </CardContent>
                </main>
            </Card>
        </Suspense>
    );
}