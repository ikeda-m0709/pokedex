/////////////先生の例




import {
  Pokemon,
  PokemonListResponse,
  PokemonSpeciesDetail,
  AbilityDetail,
  TypeDetail,
  ProcessedPokemon,
  ProcessedAbility,
  PaginationInfo,
  Name,
  Genus,
  EffectEntry,
  EvolutionChain,
  EvolutionDetail,
  ChainLink,
  ProcessedChainLink,
  ProcessedEvolutionDetail,
  ProcessedEvolutionChain
} from './types';

const BASE_URL = 'https://pokeapi.co/api/v2';

// ポケモン種族の総数をキャッシュ
let pokemonSpeciesCount: number | null = null;

// === 基本的なAPI関数群 ===

/**
 * ポケモン一覧を取得する
 * @param limit - 取得する件数
 * @param offset - オフセット（スキップする件数）
 */
export async function fetchPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('ポケモン一覧の取得に失敗しました');
  }
  return response.json();
}

/**
 * ポケモン種族一覧を取得する（総数取得用）
 * @param limit - 取得する件数（0の場合は総数のみ取得）
 * @param offset - オフセット（スキップする件数）
 */
export async function fetchPokemonSpeciesList(limit: number = 0, offset: number = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon-species/?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('ポケモン種族一覧の取得に失敗しました');
  }
  return response.json();
}

/**
 * ポケモン種族の総数を取得する（キャッシュ機能付き）
 * @returns ポケモン種族の総数
 */
export async function getPokemonSpeciesCount(): Promise<number> {
  if (pokemonSpeciesCount !== null) {
    return pokemonSpeciesCount;
  }

  console.log('Fetching Pokemon Species count...');
  const response = await fetchPokemonSpeciesList(0, 0);
  pokemonSpeciesCount = response.count;
  console.log(`Pokemon Species count: ${pokemonSpeciesCount}`);
  
  return pokemonSpeciesCount;
}

/**
 * 単体のポケモン情報を取得する
 * @param idOrName - ポケモンのIDまたは名前
 */
export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!response.ok) {
    throw new Error(`ポケモン「${idOrName}」の取得に失敗しました`);
  }
  return response.json();
}

/**
 * ポケモンの種族情報を取得する（日本語名など）
 * @param idOrName - ポケモンのIDまたは名前
 */
export async function fetchPokemonSpecies(idOrName: string | number): Promise<PokemonSpeciesDetail> {
  const response = await fetch(`${BASE_URL}/pokemon-species/${idOrName}`);
  if (!response.ok) {
    throw new Error(`ポケモン種族「${idOrName}」の取得に失敗しました`);
  }
  return response.json();
}

/**
 * 特性の詳細情報を取得する
 * @param idOrName - 特性のIDまたは名前
 */
export async function fetchAbility(idOrName: string | number): Promise<AbilityDetail> {
  const response = await fetch(`${BASE_URL}/ability/${idOrName}`);
  if (!response.ok) {
    throw new Error(`特性「${idOrName}」の取得に失敗しました`);
  }
  return response.json();
}

/**
 * タイプの詳細情報を取得する
 * @param idOrName - タイプのIDまたは名前
 */
export async function fetchType(idOrName: string | number): Promise<TypeDetail> {
  const response = await fetch(`${BASE_URL}/type/${idOrName}`);
  if (!response.ok) {
    throw new Error(`タイプ「${idOrName}」の取得に失敗しました`);
  }
  return response.json();
}

/**
 * 進化チェーンの詳細情報を取得する
 * @param url - 進化チェーンのURL
 * @returns 進化チェーンの詳細情報
 */
export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`進化チェーン情報の取得に失敗しました: ${response.status}`);
  }
  
  return response.json();
}

// === ヘルパー関数群 ===

/**
 * 多言語名前配列から日本語名を取得する
 * @param names - 多言語名前配列
 * @returns 日本語名（見つからない場合は空文字）
 */
export function getJapaneseName(names: Name[]): string {
  const japaneseName = names.find(
    (name) => name.language.name === 'ja-Hrkt' || name.language.name === 'ja'
  );
  return japaneseName ? japaneseName.name : '';
}

/**
 * 分類配列から日本語の分類を取得する
 * @param genera - 分類配列
 * @returns 日本語の分類（見つからない場合は「分類なし」）
 */
export function getJapaneseGenus(genera: Genus[]): string {
  const japaneseGenus = genera.find(
    (genus) => genus.language.name === 'ja-Hrkt' || genus.language.name === 'ja'
  );
  return japaneseGenus ? japaneseGenus.genus : '分類なし';
}

/**
 * 効果配列から日本語の説明を取得する
 * @param effectEntries - 効果配列
 * @returns 日本語の説明（見つからない場合は「説明なし」）
 */
export function getJapaneseDescription(effectEntries: EffectEntry[]): string {
  const japaneseEffect = effectEntries.find(
    (effect) => effect.language.name === 'ja-Hrkt' || effect.language.name === 'ja'
  );
  return japaneseEffect 
    ? japaneseEffect.short_effect || japaneseEffect.effect 
    : '説明なし';
}

/**
 * ポケモンの画像URLを優先順位に従って取得する
 * 優先順位: official-artwork > home > front_default > フォールバック画像
 * @param sprites - ポケモンのスプライト情報
 * @returns 画像のURL
 */
export function getPokemonImageUrl(sprites: Pokemon['sprites']): string {
  // 優先度1: 公式アートワーク画像
  if (sprites.other?.['official-artwork']?.front_default) {
    return sprites.other['official-artwork'].front_default;
  }
  
  // 優先度2: ホーム画像
  if (sprites.other?.home?.front_default) {
    return sprites.other.home.front_default;
  }
  
  // 優先度3: 基本のfront_default画像
  if (sprites.front_default) {
    return sprites.front_default;
  }
  
  // フォールバック: no_image画像
  return '/no_image.svg';
}

/**
 * URLからIDを抽出する
 * @param url - PokeAPIのURL
 * @returns 抽出されたID
 */
export function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? parseInt(matches[1], 10) : 0;
}

/**
 * 進化トリガーの日本語変換テーブル
 */
const evolutionTriggerTranslations: Record<string, string> = {
  'level-up': 'レベルアップ',
  'trade': '通信交換',
  'use-item': 'アイテム使用',
  'shed': '空きスペース',
  'spin': '回転',
  'tower-of-darkness': '悪の塔',
  'tower-of-waters': '水の塔',
  'three-critical-hits': 'きゅうしょ3回',
  'take-damage': 'ダメージを受ける',
  'other': 'その他'
};

/**
 * 進化条件を日本語で説明する
 * @param detail - 進化詳細情報
 * @returns 進化条件の説明
 */
function getEvolutionConditions(detail: EvolutionDetail): { conditions: string[], conditionsJapanese: string[] } {
  const conditions: string[] = [];
  const conditionsJapanese: string[] = [];

  if (detail.min_level) {
    conditions.push(`Level ${detail.min_level}`);
    conditionsJapanese.push(`レベル${detail.min_level}`);
  }

  if (detail.item) {
    conditions.push(`Item: ${detail.item.name}`);
    conditionsJapanese.push(`アイテム: ${detail.item.name}`);
  }

  if (detail.held_item) {
    conditions.push(`Held item: ${detail.held_item.name}`);
    conditionsJapanese.push(`持ち物: ${detail.held_item.name}`);
  }

  if (detail.known_move) {
    conditions.push(`Known move: ${detail.known_move.name}`);
    conditionsJapanese.push(`習得技: ${detail.known_move.name}`);
  }

  if (detail.location) {
    conditions.push(`Location: ${detail.location.name}`);
    conditionsJapanese.push(`場所: ${detail.location.name}`);
  }

  if (detail.min_happiness) {
    conditions.push(`Happiness ${detail.min_happiness}+`);
    conditionsJapanese.push(`なつき度${detail.min_happiness}以上`);
  }

  if (detail.time_of_day) {
    conditions.push(`Time: ${detail.time_of_day}`);
    conditionsJapanese.push(`時間帯: ${detail.time_of_day === 'day' ? '昼' : detail.time_of_day === 'night' ? '夜' : detail.time_of_day}`);
  }

  if (detail.gender !== null) {
    const genderText = detail.gender === 1 ? 'Female' : 'Male';
    const genderJapanese = detail.gender === 1 ? 'メス' : 'オス';
    conditions.push(`Gender: ${genderText}`);
    conditionsJapanese.push(`性別: ${genderJapanese}`);
  }

  if (detail.needs_overworld_rain) {
    conditions.push('Rain required');
    conditionsJapanese.push('雨が必要');
  }

  if (detail.turn_upside_down) {
    conditions.push('Turn upside down');
    conditionsJapanese.push('逆さまにする');
  }

  return { conditions, conditionsJapanese };
}

/**
 * チェーンリンクを処理済みデータに変換する
 * @param chainLink - 進化チェーンのリンク
 * @returns 処理済みチェーンリンク
 */
async function processChainLink(chainLink: ChainLink): Promise<ProcessedChainLink> {
  // ポケモンIDを取得
  const pokemonId = extractIdFromUrl(chainLink.species.url);
  
  // ポケモンの詳細情報を取得
  const pokemon = await getProcessedPokemon(pokemonId);

  // 進化詳細を処理
  const evolutionDetails: ProcessedEvolutionDetail[] = chainLink.evolution_details.map(detail => {
    const { conditions, conditionsJapanese } = getEvolutionConditions(detail);
    
    return {
      trigger: detail.trigger.name,
      triggerJapanese: evolutionTriggerTranslations[detail.trigger.name] || detail.trigger.name,
      conditions,
      conditionsJapanese
    };
  });

  // 次の進化を再帰的に処理
  const evolvesTo: ProcessedChainLink[] = await Promise.all(
    chainLink.evolves_to.map(nextLink => processChainLink(nextLink))
  );

  return {
    pokemon,
    evolutionDetails,
    evolvesTo
  };
}

// === タイプ名の日本語翻訳 ===

/**
 * 英語のタイプ名から日本語のタイプ名への変換テーブル
 */
export const TYPE_TRANSLATIONS: Record<string, string> = {
  normal: 'ノーマル',
  fire: 'ほのお',
  water: 'みず',
  electric: 'でんき',
  grass: 'くさ',
  ice: 'こおり',
  fighting: 'かくとう',
  poison: 'どく',
  ground: 'じめん',
  flying: 'ひこう',
  psychic: 'エスパー',
  bug: 'むし',
  rock: 'いわ',
  ghost: 'ゴースト',
  dragon: 'ドラゴン',
  dark: 'あく',
  steel: 'はがね',
  fairy: 'フェアリー'
} as const;

/**
 * 英語のタイプ名を日本語に変換する
 * @param typeName - 英語のタイプ名
 * @returns 日本語のタイプ名（変換できない場合は元の名前）
 */
export function getJapaneseTypeName(typeName: string): string {
  return TYPE_TRANSLATIONS[typeName] || typeName;
}

// === メイン処理関数群 ===

/**
 * 単体特性情報を処理する
 * @param pokemonAbility - ポケモンの特性情報
 * @returns 処理済み特性情報
 */
async function processAbility(pokemonAbility: Pokemon['abilities'][0]): Promise<ProcessedAbility> {
  try {
    const abilityDetail = await fetchAbility(pokemonAbility.ability.name);
    const japaneseName = getJapaneseName(abilityDetail.names) || pokemonAbility.ability.name;
    const description = getJapaneseDescription(abilityDetail.effect_entries);

    return {
      name: pokemonAbility.ability.name,
      japaneseName,
      description,
      isHidden: pokemonAbility.is_hidden
    };
  } catch (error) {
    console.error(`特性「${pokemonAbility.ability.name}」の取得に失敗:`, error);
    // エラー時のフォールバック情報を返す
    return {
      name: pokemonAbility.ability.name,
      japaneseName: pokemonAbility.ability.name,
      description: '説明なし',
      isHidden: pokemonAbility.is_hidden
    };
  }
}

/**
 * ポケモンの生データを処理して表示用データに変換する
 * @param id - ポケモンID
 * @returns 処理済みポケモン情報
 */
export async function getProcessedPokemon(id: number): Promise<ProcessedPokemon> {
  try {
    // ポケモン情報と種族情報を並列で取得
    const [pokemon, species] = await Promise.all([
      fetchPokemon(id),
      fetchPokemonSpecies(id)
    ]);

    // 日本語名を取得（なければ英語名）
    const japaneseName = getJapaneseName(species.names) || pokemon.name;

    // 分類を取得
    const genus = getJapaneseGenus(species.genera);

    // タイプを日本語に変換
    const types = pokemon.types.map((typeInfo) => 
      getJapaneseTypeName(typeInfo.type.name)
    );

    // 特性情報を処理
    const abilities = await Promise.all(
      pokemon.abilities.map((pokemonAbility) => processAbility(pokemonAbility))
    );

    return {
      id: pokemon.id,
      name: pokemon.name,
      japaneseName,
      genus,
      types,
      height: pokemon.height / 10, // デシメートルからメートルに変換
      weight: pokemon.weight / 10, // ヘクトグラムからキログラムに変換
      abilities,
      imageUrl: getPokemonImageUrl(pokemon.sprites)
    };
  } catch (error) {
    console.error(`ポケモンID「${id}」の処理に失敗:`, error);
    throw error;
  }
}

/**
 * ページネーション情報を含むポケモン一覧を取得する
 * @param page - ページ番号（1から開始）
 * @param limit - 1ページあたりの件数
 * @returns ポケモン一覧とページネーション情報
 */
export async function getProcessedPokemonList(
  page: number = 1, 
  limit: number = 20
): Promise<{
  pokemon: ProcessedPokemon[];
  pagination: PaginationInfo;
}> {
  console.log(`getProcessedPokemonList called with page=${page}, limit=${limit}`);
  
  const offset = (page - 1) * limit;
  
  // ポケモン一覧とポケモン種族総数を並列で取得
  const [listResponse, speciesCount] = await Promise.all([
    fetchPokemonList(limit, offset),
    getPokemonSpeciesCount()
  ]);

  console.log('Fetched Pokemon List Response:', listResponse);
  console.log('Species Count:', speciesCount);

  // 各ポケモンの詳細情報を並列で取得
  const pokemonPromises = listResponse.results.map(async (pokemonListItem) => {
    try {
      const id = extractIdFromUrl(pokemonListItem.url);
      return await getProcessedPokemon(id);
    } catch (error) {
      console.error(`ポケモン「${pokemonListItem.name}」の処理をスキップ:`, error);
      return null; // エラー時はnull
    }
  });

  const pokemonResults = await Promise.all(pokemonPromises);
  // nullを除外してProcessedPokemonのみ残す
  const pokemonList = pokemonResults.filter((pokemon): pokemon is ProcessedPokemon => pokemon !== null);

  // ポケモン種族の総数を使ってページネーション情報を計算
  const totalPages = Math.ceil(speciesCount / limit);

  return {
    pokemon: pokemonList,
    pagination: {
      currentPage: page,
      totalPages,
      hasNext: !!listResponse.next,
      hasPrev: !!listResponse.previous
    }
  };
}

/**
 * ポケモンを名前で検索する（第1世代のみ対象）
 * @param query - 検索クエリ
 * @param page - ページ番号
 * @param limit - 1ページあたりの件数
 * @returns 検索結果とページネーション情報
 */
export async function searchPokemon(
  query: string, 
  page: number = 1, 
  limit: number = 10
): Promise<{
  pokemon: ProcessedPokemon[];
  pagination: PaginationInfo;
}> {
  try {
    // 第1世代（151体）のポケモン一覧を取得（パフォーマンス向上のため）
    const allPokemon = await fetchPokemonList(151, 0);
    
    const matchingPokemon: ProcessedPokemon[] = [];
    
    // 各ポケモンに対して検索を実行
    for (const pokemonListItem of allPokemon.results) {
      try {
        const id = extractIdFromUrl(pokemonListItem.url);
        
        // まず英語名で高速フィルタリング
        if (pokemonListItem.name.toLowerCase().includes(query.toLowerCase())) {
          const processedPokemon = await getProcessedPokemon(id);
          matchingPokemon.push(processedPokemon);
          continue;
        }
        
        // 次に日本語名をチェック
        const species = await fetchPokemonSpecies(id);
        const japaneseName = getJapaneseName(species.names);
        
        if (japaneseName.includes(query)) {
          const processedPokemon = await getProcessedPokemon(id);
          matchingPokemon.push(processedPokemon);
        }
      } catch (error) {
        console.error(`ポケモン「${pokemonListItem.name}」の検索処理でエラー:`, error);
        // エラーが発生してもループを続行
        continue;
      }
    }

    // IDでソート（一貫した順序を保つため）
    matchingPokemon.sort((a, b) => a.id - b.id);

    // ページネーション処理
    const totalResults = matchingPokemon.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = matchingPokemon.slice(startIndex, endIndex);

    const totalPages = Math.ceil(totalResults / limit);

    return {
      pokemon: paginatedResults,
      pagination: {
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error('検索処理でエラーが発生:', error);
    throw error;
  }
}

/**
 * 指定されたポケモンの前後のポケモン情報を取得する（ナビゲーション用）
 * @param currentId - 現在のポケモンID
 * @returns 前後のポケモン情報
 */
export async function getAdjacentPokemon(currentId: number): Promise<{
  prev: ProcessedPokemon | null;
  next: ProcessedPokemon | null;
}> {
  const prevId = currentId - 1;
  const nextId = currentId + 1;

  // 前後のポケモン情報を並列で取得（エラー時はnullになる）
  const [prevResult, nextResult] = await Promise.allSettled([
    prevId > 0 ? getProcessedPokemon(prevId) : Promise.resolve(null),
    getProcessedPokemon(nextId)
  ]);

  return {
    prev: prevResult.status === 'fulfilled' ? prevResult.value : null,
    next: nextResult.status === 'fulfilled' ? nextResult.value : null
  };
}

/**
 * ポケモンの進化系統を取得する
 * @param pokemonId - ポケモンID
 * @returns 処理済み進化系統データ
 */
export async function getEvolutionChain(pokemonId: number): Promise<ProcessedEvolutionChain> {
  try {
    // ポケモンの種族情報を取得して進化チェーンURLを取得
    const species = await fetchPokemonSpecies(pokemonId);
    
    if (!species.evolution_chain?.url) {
      throw new Error(`ポケモンID ${pokemonId} に進化チェーン情報がありません`);
    }
    
    // 進化チェーンの詳細情報を取得
    const evolutionChain = await fetchEvolutionChain(species.evolution_chain.url);
    
    // チェーンを処理済みデータに変換
    const processedChain = await processChainLink(evolutionChain.chain);

    return {
      id: evolutionChain.id,
      chain: processedChain
    };
  } catch (error) {
    console.error(`ポケモンID ${pokemonId} の進化系統取得に失敗:`, error);
    throw new Error(`進化系統の取得に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}