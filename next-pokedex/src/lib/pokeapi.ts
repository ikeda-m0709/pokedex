//APIリクエスト関係の関数はここでまとめる
//ここからそれぞれのページやコンポーネントにインポートすること

import { notFound } from 'next/navigation';

export async function fetchPokemon({ params }: { params: { id: string }}) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
    if(!res.ok) return notFound();

    const data = await res.json();
    return {
        name: data.name,
        image: data.image,
        height: data.height,
        weight: data.weight,
        types: data.types.map((t: any) => t.type.name),
    };
}
