//APIリクエスト関係の関数はここでまとめる
//ここからそれぞれのページやコンポーネントにインポートすること

import { notFound } from 'next/navigation';
import { PokemonType } from './types';

export async function fetchPokemon({ params }: { params: { id: string }}) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
    if(!res.ok) return notFound();

    const data = await res.json();
    return {
        id: data.id,
        name: data.name,
        imageUrl: data.sprites.other['official-artwork'].front_default ?? data.sprites.front_default,
        height: data.height,
        weight: data.weight,
        types: data.types.map((t: PokemonType) => t.type.name),
    };
}
