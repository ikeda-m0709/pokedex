import PokemonCard from "@/components/card";
import { fetchPokemon } from "@/lib/pokeapi"

export default async function PokemonPage({ params }: { params: { id: string }}) {
    const pokemon = await fetchPokemon({params});

    return (
        <div>
            <PokemonCard  pokemon={pokemon}/>
        </div>
    );
}