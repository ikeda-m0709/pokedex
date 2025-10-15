import { fetchPokemon } from "@/lib/pokeapi"
import Image from 'next/image'

<p>ここが個々のカード詳細</p>

export default async function PokemonPage({ params }: { params: { id: string }}) {
    const pokemon = await fetchPokemon({params});

    return (
        <main>
            <p>{pokemon.id}</p>
            <h2>{pokemon.name}</h2>
            <Image src={pokemon.imageUrl} alt="ポケモン画像" width="300" height="300"/>
            <div>
                <h3>基本情報</h3>
                <p>分類：</p>
                <p>高さ：{pokemon.height/10}m</p>
                <p>重さ：{pokemon.weight/10}kg</p>
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