import { getTotalPokemonCount, fetchPokemon } from '@/lib/pokeapi';
import { NamedApiResource, PokemonSpeciesDetail, ProcessedPokemon } from '@/lib/types';
import PokemonCard from './card';
import { Suspense } from 'react';
import { Loading } from './loading';

interface Props {
    query: string;
}

//////////ページで取ってみたけどだめだった方
export async function SearchResult ({ query }: Props) {
    //ポケモンの日本語名はカタカナのため、ひらがなでの入力をカタカナに変換する
    const katakanaQuery = query.replace(/[\u3041-\u3096]/g, (char) => (
        String.fromCharCode(char.charCodeAt(0) + 0x60)
    ))

    const totalCount = await getTotalPokemonCount();//ポケモンの総件数を取得
    const limit = 20;
    let offset = 0;

    const matchedPokemons:PokemonSpeciesDetail[] = []; //ここに検索に一致したポケモンの情報を入れていく

    while(matchedPokemons.length < 10 && offset < totalCount) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        if(!res) continue;
        const data = await res.json();
        const names = data.results.map((d: NamedApiResource) => d.name);

        for(const name of names) {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);//ポケモンの各言語を含んだ情報を総取得
            if(!res.ok) continue; //上手く処理できなくても次に進む
            const data = await res.json();//nullが配列に入ってるので、次の下記の処理で排除することから始めないといけない
            const jaName = data.names.find((n: { name:string; language: { name: string }}) => n.language.name === "ja-Hrkt")?.name;
            
            if(jaName.includes(katakanaQuery)) {
                matchedPokemons.push(data);
            if(matchedPokemons.length >= 10) break;
            }
         }
         
         offset +=limit ;
        }

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
                    <div className='mx-7 mb-30'>
                        <p className='text-left'>「{query}」の検索結果: <span className='font-bold'>{matchedProcessedPokemons.length}件</span> 見つかりました</p>
                        <div className='mt-3 grid grid-cols-2 sm:grid-cols-5 gap-5'>
                            {matchedProcessedPokemons.map((pokemon:ProcessedPokemon) => (
                                <PokemonCard key={pokemon.id} pokemon={pokemon} />
                            ))}
                        </div>
                    </div>
                    :
                    <div className='text-center'>
                        <p className='inline-block text-left px-2 border-x-2 border-gray-300'>「{query}」に一致するポケモンが見つかりませんでした<br />
                        別のキーワードで検索してください</p>
                    </div>
                }
            </Suspense>
        </div>
    )
}