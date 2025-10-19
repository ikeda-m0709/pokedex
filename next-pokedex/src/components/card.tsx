import Image from 'next/image'
import { ProcessedPokemon } from "@/lib/types"


<p>ここが個々のカード詳細</p>

export default async function PokemonCard({ pokemon }: {pokemon: ProcessedPokemon}) {

    return (
        <main>
            <p>{pokemon.id}</p>
            <h2>{pokemon.name}</h2>
            <Image src={pokemon.imageUrl} alt="ポケモン画像" width="300" height="300"/>
            <div>
                <h3>基本情報</h3>
                <p>分類：</p>
                <p>高さ：{pokemon.height}m</p>
                <p>重さ：{pokemon.weight}kg</p>
            </div>
            <div>
                <h3>タイプ</h3>
                <p>{pokemon.types.join(', ')}</p>
            </div>
            <div>
                <h3>特性</h3>
                <p>特性１</p>
                <p>特性２</p>
            </div>
        </main>

    );
}