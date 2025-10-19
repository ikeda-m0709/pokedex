//APIリクエスト関係の関数はここでまとめる
//ここからそれぞれのページやコンポーネントにインポートすること

import { notFound } from 'next/navigation';
import { PokemonType, ProcessedPokemon, PokemonSpeciesDetail, ProcessedAbility, PokemonAbility, EffectEntry } from './types';

export async function fetchPokemon({ params }: { params: { id: string }}): Promise<ProcessedPokemon> {
   //言語に依らないデータ取得
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
    if(!res.ok) return notFound();
    const data = await res.json();

    //日本語データ取得
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${params.id}`);
    if(!speciesRes.ok) return notFound();
    const speciesDate: PokemonSpeciesDetail = await speciesRes.json();

    const japaneseName = speciesDate.names.find(n => n.language.name === "ja")?.name ?? data.name;
    const genus = speciesDate.genera.find(g => g.language.name === "ja")?.genus ?? "分類なし";

    //1ポケモンのうち、複数のabilityがあるので、型も配列になる
    const abilities: ProcessedAbility[] = await Promise.all(
        data.abilities.map(async (a: PokemonAbility) => {
            const abilityRes = await fetch(a.ability.url);
            const abilityData = await abilityRes.json();
            const japaneseAbilityName = abilityData.names.find((n: { name:string; language: { name: string }}) => n.language.name === "ja")?.name ?? a.ability.name;
            const effect = abilityData.effect_entries.find((e: EffectEntry) => e.language.name === "ja")?.effect ?? "説明なし";
            return {
                name: japaneseAbilityName,
                effect,
            };
        })
    );

    //typesの日本語取得
    const types: string[] = await Promise.all(
        data.types.map( async (t: PokemonType) => {
            const typeRes = await fetch(t.type.url);
            const typeData = await typeRes.json();
            const japaneseTypeNames = typeData.names.find((n: { name: string; language: { name: string}}) => n.language.name === "ja")?.name ?? t.type.name;
            return japaneseTypeNames;
        })
    );

    return {
        id: data.id,
        name: data.name,
        japaneseName,
        imageUrl: data.sprites.other['official-artwork'].front_default ?? data.sprites.front_default,
        types,
        height: data.height / 10,
        weight: data.weight / 10,
        genus,
        abilities
    };
}
