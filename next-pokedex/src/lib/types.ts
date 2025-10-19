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