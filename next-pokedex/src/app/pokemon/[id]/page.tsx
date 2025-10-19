import PokemonCard from "@/components/card";
import { fetchPokemon } from "@/lib/pokeapi"


<p>ここが個々のカード詳細</p>

export default async function PokemonPage({ params }: { params: { id: string }}) {
    const pokemon = await fetchPokemon({params});

    return (
        <PokemonCard  pokemon={pokemon}/>
    );
}