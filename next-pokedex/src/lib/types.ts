//APIリクエストで利用する型情報をここに記載

// 基本的な名前とURL構造　★まだ未確認
export interface NamedApiResource {
  name: string;
  url: string;
}

// 多言語対応の名前　★まだ未確認
export interface Name {
  name: string;
  language: NamedApiResource;
}

// ポケモン一覧のレスポンス　★まだ未確認
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}

//pokemon.typesの中身の型（タイプ情報の構造定義）
export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

//pokemon.spritesの型（画像情報の構造定義）
export interface PokemonSprites {
  front_default: string;
  other?: {
    ["official-artwork"]?: {
      front_default?: string;
    };
  };
}

//PokéAPIの /pokemon/{id} のレスポンス型（API取得時の生データ）
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  sprites: PokemonSprites;
  abilities: PokemonAbility[];
}

///pokemon-species/{id} のレスポンス型（分類・日本語名など）
export interface PokemonSpeciesDetail {
  id: number;
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
  names: {
    name: string;
    language: {
      name: string;
    };
  }[];
  evolution_chain:{
      url: string
    };
}

//特性情報（名前と効果）
export interface PokemonAbility {
      ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
}

//PokéAPI の /ability/{id} のレスポンスに含まれる effect_entries は下記のような配列
export interface EffectEntry {
  effect: string,
  language: {
    name: string;
  };
}

export interface ProcessedAbility {
  name: string;
  effect: string;
}

export interface ProcessedPokemon {
  id: number; //25
  name: string; //pikachu
  japaneseName: string; //ピカチュウ
  imageUrl: string; //"..."
  types: string[]; //electric
  height: number; //0.4
  weight: number; //6.0
  genus: string; //ねずみポケモン
  abilities: ProcessedAbility[]; //name: static, effect:接触した相手をマヒ状態にすることがある
}

// ページネーション情報　★まだ未確認
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalCount: number;
}

////進化条件関係の型////
//pokemon-speciesから取得した進化チェーンの詳細を取得時
export interface EvolutionChain {
  id: number;
  baby_trigger_item: NamedApiResource | null;
  chain: ChainLink;
};

//進化チェーンの中のchainの中身の取得時
export interface ChainLink {
  is_baby: boolean; //ベイビィポケモンかどうか
  species: NamedApiResource; //ポケモンの種族名と、その詳細情報を取得できるURL(例・フシギダネ"name": "bulbasaur","url": "https://pokeapi.co/api/v2/pokemon-species/1/")
  evolution_details: EvolutionDetail[] | null; //このポケモンの進化条件
  evolves_to: ChainLink[]; //次の進化先ポケモンのリスト
};

//↑のspeciesから日本語名・画像を取得する
export interface EvolutionProf {
  id: number;
  imageUrl: string;
  japaneseName: string;
};

//evolution_detailsの中身の取得時
export interface EvolutionDetail {
  item: NamedApiResource | null; //進化に必要なアイテム（雷の石）
  trigger: NamedApiResource; //進化のきっかけ（レベルアップ、通信交換）
  gender: number | null; //進化するポケモンの性別（不明、オス、メス）
  held_item: NamedApiResource | null; //進化時に持っている必要があるアイテム
  known_move: NamedApiResource | null; //覚えている必要がある技名
  known_move_type: NamedApiResource | null; //覚えている技のtype
  location: NamedApiResource | null; //特定の場所での進化（雪原）
  min_level: number | null; //進化の最低レベル
  min_happiness: number | null; //最低なつき度
  min_beauty: number | null; //最低美しさ（コンテストステータス）
  min_affection: number | null; //最低なかよし度
  needs_overworld_rain: boolean; //フィールドの雨の有無
  party_species: NamedApiResource | null; //手持ちに特定のポケモンが必要
  party_type: NamedApiResource | null; //手持ちに特定タイプのポケモンが必要
  relative_physical_stats: -1 | 0 | 1 | null; //攻撃と防御の比較（1:攻撃>防御, 0:同じ, -1:攻撃<防御）
  time_of_day: 'day' | 'night' | ''; //時間帯
  trade_species: NamedApiResource | null; //特定のポケモンと交換が必要
  turn_upside_down: boolean; //3DSを逆さにする必要がある（マーイーカの進化）
};

//↑の日本語名に加工後
export interface ProcessedEvolutionDetail {
  item: string | null;
  trigger: string | null;
  gender: number | null;
  held_item: string | null;
  known_move: string | null;
  known_move_type: string | null;
  location: string | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: string | null;
  party_type: string | null;
  relative_physical_stats: -1 | 0 | 1 | null;
  time_of_day: 'day' | 'night' | '';
  trade_species: string | null;
  turn_upside_down: boolean;
}

export interface evolutionStep {
  prof: EvolutionProf; // ポケモンの基本情報（画像・名前・ID）
  details: ProcessedEvolutionDetail[]; // 進化条件
  isBranching: boolean;  // 分岐進化かどうか（CSS切り替え用）
  parentIsBranching: boolean;
}