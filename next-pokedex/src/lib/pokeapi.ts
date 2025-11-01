//APIリクエスト関係の関数はここでまとめる
//ここからそれぞれのページやコンポーネントにインポートすること

import { notFound } from 'next/navigation';
import { PokemonType, 
    ProcessedPokemon,
    Pokemon, 
    PokemonSpeciesDetail, 
    ProcessedAbility, 
    PokemonAbility, 
    EffectEntry, 
    NamedApiResource,
    //EvolutionChain,
    //ChainLink 
} from './types';

const BASE_URL = 'https://pokeapi.co/api/v2'; //APIからの取得URLの共通部分

////基本API取得関数の一覧（生データ取得）////

//ポケモン一覧取得
export async function fetchPokemonList(limit = 20, offset = 0): Promise<NamedApiResource[]> {
    const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if(!res) return notFound(); //取得失敗時はreturn []　で空配列を返した方が良いの？
    const data = await res.json();
    const results = data.results as NamedApiResource[];
    return results;
}

//ポケモン詳細情報取得（※言語に依らない）
export async function fetchRawPokemon(id: string): Promise<Pokemon | null> {
    const res = await fetch(`${BASE_URL}/pokemon/${id}`);
    if(!res.ok) return null; //取得失敗時はnotFound()を返すと関数の戻り値としては型が合わないことがあるため、代わりに return null にして、呼び出し元で if (!data) return notFound() のように処理する方が自然
    const data = await res.json();
    return data;
}

//「日本語名・分類・進化URL」の取得
export async function fetchSpecies(id: string): Promise<PokemonSpeciesDetail | null> {
    const res = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    if(!res.ok) return null; //取得失敗時はnotFound()を返すと関数の戻り値としては型が合わないことがあるため、代わりに return null にして、呼び出し元で if (!data) return notFound() のように処理する方が自然
    const data = await res.json();
    return data;
}

//日本語データ取得（※NamedApiResource（nameとurlを持つ）を渡すと、そのリソースの日本語名を返す）
export async function fetchJapaneseName(resource: NamedApiResource): Promise<string> {
    const res = await fetch(resource.url); //ポケモン1匹分の.〇〇〇.urlが入る
    if (!res.ok) return resource.name; //受け取れなかったときは英語表記を返す
    const data = await res.json();
    const name = data.names.find((n: { name:string; language: { name: string }}) => n.language.name === "ja-Hrkt")?.name;
    return name;
}

//「アビリティ詳細（日本語名・効果）」の取得
export async function fetchAbilityDetail(url: string): Promise<ProcessedAbility> {
    const res = await fetch(url); //ポケモン1匹分の.ability.urlが入る
    if(!res.ok) return { name: "不明", effect: "取得失敗" };
    const data = await res.json();
    const name = await fetchJapaneseName({ name :data.name, url });//NamedApiResource型に合わせた表記にする
    const effect = data.effect_entries.find((e: EffectEntry) => e.language.name === "ja-Hrkt")?.effect ?? "説明なし";
    return { name, effect}
}



////加工済みポケモン情報の取得（1匹）////
export async function fetchPokemon(id: string): Promise<ProcessedPokemon> {
   //ポケモン詳細情報、「日本語名・分類・進化URL」の取得の関数使用
    const raw = await fetchRawPokemon(id);
    const species = await fetchSpecies(id);
    if(!raw || !species) return notFound();

    //日本語データの取得
    const japaneseName = species.names.find(n => n.language.name === "ja-Hrkt")?.name ?? raw.name;
    const genus = species.genera.find(g => g.language.name === "ja-Hrkt")?.genus ?? "分類なし";

    //「アビリティ詳細（日本語名・効果）」の取得
    const abilities = await Promise.all(
        raw.abilities.map(async (a: PokemonAbility) => fetchAbilityDetail(a.ability.url))
    );

    //日本語データ取得の関数に「タイプ詳細」を渡す
    const types = await Promise.all(
        raw.types.map( async (t: PokemonType) => fetchJapaneseName(t.type))
    );

    return {
        id: raw.id,
        name: raw.name,
        japaneseName,
        imageUrl: raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default, //.other?.['official-artwork']?の部分をOptional chaining（?.）にしないと、sprites.other や sprites.other['official-artwork'] は 存在しない可能性がある ＝ undefined になる可能性がある、とエラーが出てしまう
        types,
        height: raw.height / 10,
        weight: raw.weight / 10,
        genus,
        abilities
    };//A ?? B は、AがnullまたはundefinedならBを使う、の意味
}

////加工済みポケモン一覧取得（ページ単位）////
export async function getProcessdePokemonList(page: number): Promise<ProcessedPokemon[]> {
    const limit = 20;
    const offset = (page - 1) * limit;//対象のページに本当は何匹いたとしても、20匹取ってこようとする処理
    
    //PokeAPIからの一覧取得
   const results = await fetchPokemonList(limit, offset);

    //個別ポケモンデータの取得
    const pokemons = await Promise.all(
        results.map(async (pokemon) => {
            //return await fetchPokemon(id);だけにすると、最終ページは5匹しかいないのに、20匹分の.mapを実行するため、undefined な ID を渡してエラーになる
            const id = pokemon.url.split("/").filter(Boolean).pop();//.split("/")でURLを/ごとに分割、.filter(Boolean)で空白を削除、.pop()で末尾のID取得
            try {
                return await fetchPokemon(id!);
            } catch {
                return null; // 取得失敗時は null を返す
            }
        })
    );
    //return await fetchPokemon(id!);だとnullの場合が想定されてないから×、下記でnullを排除した配列を新たに返す
    return pokemons.filter(p => p !== null);
}

////総ポケモン数の取得////
export async function getTotalPokemonCount(): Promise<number> {
    const res = await fetch(`${BASE_URL}/pokemon-species/?limit=0`);
    if(!res.ok) return 0;
    const data = await res.json();
    return data.count; //⇐総ポケモン数
}

/*//進化関係の情報の取得
export async function getEvolution(id: string): Promise<EvolutionChain | null> {
    //pokemon-speciesから進化チェーンの詳細を取得
    const species = await fetchSpecies(id);
    if(!species) return null;
    const evolutionURL = species.evolution_chain.url; //⇐で指定されたURLにアクセスすると、進化の詳細が取得できる（例：https://pokeapi.co/api/v2/evolution-chain/1/）※ポケモンのIDと進化チェーンのIDは一致しないので注意（いきなりこのURLのidを変えれば良い、わけではない）
    const evolRes = await fetch(evolutionURL);
    if(!evolRes.ok) return null;
    const evolData = await evolRes.json();
    return evolData;

    //evolDataからchainの中身の取得
    const chain: ChainLink = evolData.chain;
}*/