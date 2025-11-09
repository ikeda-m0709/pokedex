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
    ChainLink ,
    ProcessedEvolutionDetail,
    evolutionStep
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

//※triggerだけ↓の日本語データ取得ができないため、マッピングする
const triggerMap: Record<string, string> = {
    "level-up": "レベルアップ",
    "trade": "通信交換",
    "use-item": "アイテム使用",
    "shed": "抜け殻",
    "spin": "回転",
    "other": "その他",
};

//日本語データ取得（※NamedApiResource（nameとurlを持つ）を渡すと、そのリソースの日本語名を返す）
export async function fetchJapaneseName(resource: NamedApiResource): Promise<string> {
    const res = await fetch(resource.url); //ポケモン1匹分の.〇〇〇.urlが入る
    if (!res.ok) return triggerMap[resource.name] ?? resource.name; //受け取れなかったときは英語表記(マッピング済み)を、それも無理なら英語表記そのまま返す
    const data = await res.json();
    const name = data.names.find((n: { name:string; language: { name: string }}) => n.language.name === "ja-Hrkt")?.name;
    return name ?? triggerMap[resource.name] ?? resource.name;
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



////進化情報の取得関係の関数まとめ////
//①pokemon-speciesから取得した進化チェーンの詳細を取得
export async function getEvolution(id: string): Promise<ChainLink | null> {
    const species = await fetchSpecies(id);
    if(!species) return null;
    const evolutionURL = species.evolution_chain.url; //⇐で指定されたURLにアクセスすると、進化の詳細が取得できる（例：https://pokeapi.co/api/v2/evolution-chain/1/）※ポケモンのIDと進化チェーンのIDは一致しないので注意（いきなりこのURLのidを変えれば良い、わけではない）
    const evolRes = await fetch(evolutionURL);
    if(!evolRes.ok) return null;
    const evolData = await evolRes.json(); //.json()しないと、型がresponseになる

    //evolDataからchainの中身の取得
    const chain: ChainLink = evolData.chain;
    return chain;
}

//②↑で取得したchainを元に、進化条件の詳細の取得
export async function getEvolutionDetails(chain: ChainLink):Promise<ProcessedEvolutionDetail[]> {
    //chain.evolution_detailsの型はEvolutionDetail[] | nullなので、nullの場合は空配列を返す
    //また、null→進化条件が存在しない　場合と、　[]（空配列）→進化条件はあるが、要素が0件（イーブイなど分岐進化するものはイーブイ自身の配列は空で、進化先のevolves_to[i].evolution_detailsに記載があるため）
    if(!chain.evolution_details || chain.evolution_details.length === 0) return []; 

    const details = await Promise.all(
        chain.evolution_details.map(async d => {
            console.log("trigger name:", d.trigger?.name);
            return {
                item: d.item ? await fetchJapaneseName(d.item) : null, //型がitem: NamedApiResource | nullなので、それに合わせて返さないと
                trigger: d.trigger ? await fetchJapaneseName(d.trigger) : null,
                gender: d.gender ? d.gender : null,
                held_item: d.held_item ? await fetchJapaneseName(d.held_item) : null,
                known_move: d.known_move ? await fetchJapaneseName(d.known_move) : null,
                known_move_type: d.known_move_type ? await fetchJapaneseName(d.known_move_type) : null,
                location: d.location ? await fetchJapaneseName(d.location) : null,
                min_level: d.min_level ? d.min_level : null,
                min_happiness: d.min_happiness ? d.min_happiness : null,
                min_beauty: d.min_beauty ? d.min_beauty : null,
                min_affection: d.min_affection ? d.min_affection :null,
                needs_overworld_rain: d.needs_overworld_rain,
                party_species: d.party_species ? await fetchJapaneseName(d.party_species) : null,
                party_type: d.party_type ? await fetchJapaneseName(d.party_type) : null,
                relative_physical_stats: d.relative_physical_stats ? d.relative_physical_stats : null,
                time_of_day: d.time_of_day,
                trade_species: d.trade_species ? await fetchJapaneseName(d.trade_species) : null,
                turn_upside_down: (d.turn_upside_down),
            };
        })
    );

    return details;
}

//③↑の①で取得したchainと、②の進化条件詳細を使い、進化段階ごとの進化条件情報の網羅版を取得

/*最初のやつを修正して、だめだったやつ
export async function buildEvolutionSteps(chain: ChainLink): Promise<evolutionStep[]> {
    const result: evolutionStep[] = [];

        const raw = await fetchRawPokemon(chain.species.name);
        if(!raw) return result;
        const imageUrl = raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default;
        const japaneseName = await fetchJapaneseName(chain.species);
        const details = await getEvolutionDetails(chain);
        const isBranching = chain.evolves_to.length > 1;

        result.push({
                prof: {  
                    id: raw.id,
                    imageUrl,
                    japaneseName,
                },
                details,
                isBranching, //現在の進化段階の進化先数
                parentIsBranching: false //前（親）の進化段階の進化先数（※CSS用のフラグ）
            });

    console.log("for前：" + result);


    for(const next of chain.evolves_to) {
        const nextRaw = await fetchRawPokemon(next.species.name);
        if(!nextRaw) continue;
        const nextImageUrl = nextRaw.sprites.other?.['official-artwork']?.front_default ?? nextRaw.sprites.front_default;
        const nextJapaneseName = await fetchJapaneseName(next.species);
        const nextDetails = await getEvolutionDetails(next);
        const nextIsBranching = next.evolves_to.length > 1;

        result.push({
                prof: {  
                id: nextRaw.id,
                imageUrl: nextImageUrl,
                japaneseName: nextJapaneseName,
                },
                details: nextDetails,
                isBranching: nextIsBranching, //現在の進化段階の進化先数
                parentIsBranching: isBranching //前（親）の進化段階の進化先数（※CSS用のフラグ）
            });
        }

    console.log("最終結果：" + result);
    return result;    
}
*/


export async function buildEvolutionSteps(chain: ChainLink): Promise<evolutionStep[]> {
        const result: evolutionStep[] = []; //ここに進化系統のポケモンを全て詰める

        //進化の最初（起点）のポケモンをpushする
        const raw = await fetchRawPokemon(chain.species.name);
        if(!raw) return result;
        const imageUrl = raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default;
        const japaneseName = await fetchJapaneseName(chain.species);

        result.push({
                prof: {  
                    id: raw.id,
                    imageUrl,
                    japaneseName,
                },
                details:[], //最初のポケモンは進化してないから、取得してもどうせ空なので
                countParentBranching:0, //最初のポケモンは進化してないから、自分の前がいないので必ず0
                countBranching:chain.evolves_to.length  //自分が、0（進化なし）か、1（一方向進化）、複数（多方向進化）かどうか
            });
        
        //次のポケモンをpushする　chain.evolves_toの中には、次の進化のevolution_detailsとevolves_toが入ってる
        for(const next of chain.evolves_to) {
            //最初のポケモンが一方向進化
            if(chain.evolves_to.length === 1) {
                //まず自分をpush
                const raw = await fetchRawPokemon(next.species.name);
                if(!raw) return result; //???
                const imageUrl = raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default;
                const japaneseName = await fetchJapaneseName(next.species);
                const details = await getEvolutionDetails(next);

                result.push({
                    prof: {
                        id: raw.id,
                        imageUrl,
                        japaneseName,
                    },
                    details, //最初のポケが自分に進化するための条件たち
                    countParentBranching: chain.evolves_to.length, //最初のポケモンの進化分岐（一方向進化）
                    countBranching:next.evolves_to.length  //自分が、0（進化なし）か、1（一方向進化）、複数（多方向進化）かどうか
                });

                //さらに進化するか（しない、一方向、多方向の3パターン）
                switch (next.evolves_to.length){
                    case 0: //進化しない　※ディグダ系
                        break;

                    case 1: //一方向に進化する　※フシギダネ系
                        const raw = await fetchRawPokemon(next.evolves_to[0].species.name);
                        if(!raw) return result; //???
                        const imageUrl = raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default;
                        const japaneseName = await fetchJapaneseName(next.evolves_to[0].species);
                        const details = await getEvolutionDetails(next.evolves_to[0]);

                        result.push({
                            prof: {
                                id: raw.id,
                                imageUrl,
                                japaneseName,
                            },
                            details, //最初のポケが自分に進化するための条件たち
                            countParentBranching: next.evolves_to.length, ////自分の前のポケモンの進化有無
                            countBranching:next.evolves_to.length  //自分が、1（一方向進化）の場合のみ
                        });
                        break;
                    
                    default: //上記以外（多方向に進化する）　※ラルトス系
                        for(const n of next.evolves_to) {
                        const raw = await fetchRawPokemon(n.species.name);
                        if(!raw) return result; //???
                        const imageUrl = raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default;
                        const japaneseName = await fetchJapaneseName(n.species);
                        const details = await getEvolutionDetails(n);

                        result.push({
                            prof: {
                                id: raw.id,
                                imageUrl,
                                japaneseName,
                            },
                            details, //最初のポケが自分に進化するための条件たち
                            countParentBranching: next.evolves_to.length, //自分の前のポケモンの進化有無
                            countBranching:n.evolves_to.length  //自分が、0（進化なし）か、1（一方向進化）、複数（多方向進化）かどうか
                        });
                    }
                }
            }

            //最初のポケモンが多方向進化
            if(chain.evolves_to.length > 1) {
                //まず自分をpush
                const raw = await fetchRawPokemon(next.species.name);
                if(!raw) return result; //???
                const imageUrl = raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default;
                const japaneseName = await fetchJapaneseName(next.species);
                const details = await getEvolutionDetails(next);

                result.push({
                    prof: {
                        id: raw.id,
                        imageUrl,
                        japaneseName,
                    },
                    details, //最初のポケが自分に進化するための条件たち
                    countParentBranching: chain.evolves_to.length, //最初のポケモンの進化分岐（多方向進化）
                    countBranching:next.evolves_to.length  //自分が、0（進化なし）か、1（一方向進化）、複数（多方向進化）かどうか
                });
                //さらに進化するか
                if(next.evolves_to.length > 0){ //自分も進化する（※カジッチュ系）
                    for(const n of next.evolves_to) {
                        const raw = await fetchRawPokemon(n.species.name);
                        if(!raw) return result; //???
                        const imageUrl = raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default;
                        const japaneseName = await fetchJapaneseName(n.species);
                        const details = await getEvolutionDetails(n);

                        result.push({
                            prof: {
                                id: raw.id,
                                imageUrl,
                                japaneseName,
                            },
                            details, //最初のポケが自分に進化するための条件たち
                            countParentBranching: next.evolves_to.length, //自分の前のポケモンの進化有無
                            countBranching:n.evolves_to.length  //自分が、0（進化なし）か、1（一方向進化）、複数（多方向進化）かどうか
                        });
                    }
                }
            }
        }

    return result;

}