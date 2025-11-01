import { getTotalPokemonCount, fetchPokemon } from '@/lib/pokeapi';
import { NamedApiResource, PokemonSpeciesDetail, ProcessedPokemon } from '@/lib/types';
import PokemonCard from './card';
import { Suspense } from 'react';
import { Loading } from './loading';

interface Props {
    query: string;
}

export async function SearchResult ({ query }: Props) {
    const totalCount = await getTotalPokemonCount();//ポケモンの総件数を取得
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalCount}`);//すべてのポケモンのデータを取得
    const data = await res.json();
    const allNames = data.results.map((p: NamedApiResource) => p.name);//すべてのポケモンのnameを配列にする
    
    const speciesData: PokemonSpeciesDetail[] = await Promise.all(
        allNames.map(async (name: string) => { //.mapの時のasyncの位置はここ⇐
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);//ポケモンの各言語を含んだ情報を総取得
            if(!res.ok) return null;//見つからなかったらnullを返す
            return await res.json();//nullが配列に入ってるので、次の下記の処理で排除することから始めないといけない
        })
    )
    
    const matchedPokemons = speciesData.filter(d => d !== null) //speciesData(全てのポケモンの各言語情報)の配列からnullを排除する
    .filter(d => d.names.find((d => d.language.name === "ja-Hrkt")) //各言語情報から日本語だけのポケモン情報に絞る
    ?.name.includes(query)) //全ての日本語情報のポケモンの中に、query(inputの入力値)が含まれているか
    .slice(0, 10); //最大10件に制限
    
    const matchedPokemonsdata = await Promise.all( //PokemonCardコンポーネントに渡すために、型をProcessedPokemonにしたいので、不足しているプロパティを取得する
        matchedPokemons.map(async p => {
            const id = String(p.id);
            try {
                return await fetchPokemon(id);
            } catch {
                return null;
            }
        })
    );

    const matchedProcessedPokemons: ProcessedPokemon[] = matchedPokemonsdata.filter(m => m !== null);

    return (
        <div>
            <Suspense fallback={<Loading />}>
                {matchedProcessedPokemons.length > 0 ? 
                    <div>
                        <p>{query}の検索結果:{matchedProcessedPokemons.length}件見つかりました</p>
                        {matchedProcessedPokemons.map((pokemon:ProcessedPokemon) => (
                            <PokemonCard key={pokemon.id} pokemon={pokemon} />
                        ))}
                    </div>
                    :
                    <div>
                        <p>{query}に一致するポケモンが見つかりませんでした</p>
                        <p>別のキーワードで検索してください</p>
                    </div>
                }
            </Suspense>
        </div>
    )
}