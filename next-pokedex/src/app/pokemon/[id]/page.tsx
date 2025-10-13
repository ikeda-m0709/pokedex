import { fetchPokemon } from "@/lib/pokeapi"

<p>ここが個々のカード詳細</p>

export default async function PokemonPage({ params }: { params: { id: string }}) {
    const pokemon = await fetchPokemon({params});

    return (
        <main>
            <p>{pokemon.id}</p>
            <h2>{pokemon.name}</h2>
            <img alt="{pokemon.name}"></img>
            <div>
                <h3>基本情報</h3>
                <p>分類：</p>
                <p>高さ：{pokemon.height}</p>
                <p>重さ：{pokemon.weight}</p>
            </div>
            <div>
                <h3>タイプ</h3>
                <p>{pokemon.types}</p>
            </div>
            <div>
                <h3>特性</h3>
                <p>特性１</p>
                <p>特性２</p>
            </div>
        </main>

    );
}