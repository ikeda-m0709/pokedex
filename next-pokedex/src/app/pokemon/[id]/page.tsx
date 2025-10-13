import { fetchPokemon } from "@/lib/pokeapi"

<p>ここが個々のカード詳細</p>

export default async function PokemonPage({ params }: { params: { id: string }}) {
    const pokemon = await fetchPokemon(params.id);

    return (
        <main>
            <p>{params.id}</p>
            <h1>{pokemon.name}</h1>
            <div>
                <h2>基本情報</h2>
                <p>分類：</p>
                <p>高さ：</p>
                <p>重さ：</p>
            </div>
            <div>
                <h2>タイプ</h2>
                <p>〇〇</p>
            </div>
            <div>
                <h2>特性</h2>
                <p>特性１</p>
                <p>特性２</p>
            </div>
            
        </main>

    );
}