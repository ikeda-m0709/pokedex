// Pokemon API related types
////////////////////先生の例！！！！！！！！

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  order: number;
  is_default: boolean;
  location_area_encounters: string;
  sprites: PokemonSprites;
  abilities: PokemonAbility[];
  forms: PokemonForm[];
  game_indices: GameIndex[];
  held_items: HeldItem[];
  moves: PokemonMove[];
  species: PokemonSpecies;
  stats: PokemonStat[];
  types: PokemonType[];
}

export interface PokemonSprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  other: OtherSprites;
  versions: Record<string, unknown>; // Complex nested structure
}

export interface OtherSprites {
  dream_world: {
    front_default: string | null;
    front_female: string | null;
  };
  home: {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
  };
  "official-artwork": {
    front_default: string | null;
    front_shiny: string | null;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonForm {
  name: string;
  url: string;
}

export interface GameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

export interface HeldItem {
  item: {
    name: string;
    url: string;
  };
  version_details: Record<string, unknown>[];
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Record<string, unknown>[];
}

export interface PokemonSpecies {
  name: string;
  url: string;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

// Pokemon Species types for Japanese names
export interface PokemonSpeciesDetail {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: {
    name: string;
    url: string;
  };
  pokedex_numbers: Record<string, unknown>[];
  egg_groups: Record<string, unknown>[];
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  evolution_chain: {
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  generation: {
    name: string;
    url: string;
  };
  names: Name[];
  flavor_text_entries: FlavorTextEntry[];
  form_descriptions: Record<string, unknown>[];
  genera: Genus[];
  varieties: Variety[];
}

export interface Name {
  name: string;
  language: {
    name: string;
    url: string;
  };
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

export interface Genus {
  genus: string;
  language: {
    name: string;
    url: string;
  };
}

export interface Variety {
  is_default: boolean;
  pokemon: {
    name: string;
    url: string;
  };
}

// Ability details for descriptions
export interface AbilityDetail {
  id: number;
  name: string;
  is_main_series: boolean;
  generation: {
    name: string;
    url: string;
  };
  names: Name[];
  effect_entries: EffectEntry[];
  effect_changes: Record<string, unknown>[];
  flavor_text_entries: FlavorTextEntry[];
  pokemon: Record<string, unknown>[];
}

export interface EffectEntry {
  effect: string;
  short_effect: string;
  language: {
    name: string;
    url: string;
  };
}

// Type translation
export interface TypeDetail {
  id: number;
  name: string;
  damage_relations: Record<string, unknown>;
  past_damage_relations: Record<string, unknown>[];
  game_indices: Record<string, unknown>[];
  generation: Record<string, unknown>;
  move_damage_class: Record<string, unknown>;
  names: Name[];
  pokemon: Record<string, unknown>[];
  moves: Record<string, unknown>[];
}

// Custom types for our app
export interface ProcessedPokemon {
  id: number;
  name: string;
  japaneseName: string;
  genus: string;
  types: string[];
  height: number; // in meters
  weight: number; // in kilograms
  abilities: ProcessedAbility[];
  imageUrl: string;
}

export interface ProcessedAbility {
  name: string;
  japaneseName: string;
  description: string;
  isHidden: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Evolution Chain types
export interface EvolutionChain {
  id: number;
  baby_trigger_item: {
    name: string;
    url: string;
  } | null;
  chain: ChainLink;
}

export interface ChainLink {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface EvolutionDetail {
  item: {
    name: string;
    url: string;
  } | null;
  trigger: {
    name: string;
    url: string;
  };
  gender: number | null;
  held_item: {
    name: string;
    url: string;
  } | null;
  known_move: {
    name: string;
    url: string;
  } | null;
  known_move_type: {
    name: string;
    url: string;
  } | null;
  location: {
    name: string;
    url: string;
  } | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: {
    name: string;
    url: string;
  } | null;
  party_type: {
    name: string;
    url: string;
  } | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: {
    name: string;
    url: string;
  } | null;
  turn_upside_down: boolean;
}

// Processed evolution types for our app
export interface ProcessedEvolutionChain {
  id: number;
  chain: ProcessedChainLink;
}

export interface ProcessedChainLink {
  pokemon: ProcessedPokemon;
  evolutionDetails: ProcessedEvolutionDetail[];
  evolvesTo: ProcessedChainLink[];
}

export interface ProcessedEvolutionDetail {
  trigger: string;
  triggerJapanese: string;
  conditions: string[];
  conditionsJapanese: string[];
}