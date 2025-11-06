import PokemonDetail from "@/components/pokemonDetail";
import { fetchPokemon } from "@/lib/pokeapi"
import { getTotalPokemonCount } from "@/lib/pokeapi"
import Link from 'next/link';
import { buttonVariants } from "@/components/ui/button"

import { ArrowBigLeftDash } from 'lucide-react';
import { ArrowBigRightDash } from 'lucide-react';


export default async function PokemonPage({ params }: { params: { id: string }}) {
    const pokemon = await fetchPokemon(params.id);
    const resolvedId = await params.id;
    const currentId = Number(resolvedId);
    const totalCount = await getTotalPokemonCount(); 

    const prevId = currentId > 1 ? currentId - 1 : null;
    const nextId = currentId < totalCount ? currentId + 1 : null;

    const [prevPokemon, nextPokemon] = await Promise.all([
        prevId ? fetchPokemon(String(prevId)) : null,
        nextId ? fetchPokemon(String(nextId)) : null,
    ]);

    return (
        <div>
            <div className="flex justify-between mx-7 mt-5">
                {prevPokemon && (
                    <Link className="flex gap-1" href={`/pokemon/${prevPokemon.id}`}>
                        <ArrowBigLeftDash color="#3d3d3d" strokeWidth={1} />{prevPokemon.japaneseName}
                    </Link>
                )}
                {nextPokemon && (
                    <Link className="flex gap-1"  href={`/pokemon/${nextPokemon.id}`}>
                        {nextPokemon.japaneseName}<ArrowBigRightDash color="#3d3d3d" strokeWidth={1} />
                    </Link>
                )}
            </div>
            <PokemonDetail pokemon={pokemon}/>
            <Link className={buttonVariants({ variant: "default" })} href="/pokemon">一覧へ</Link>
        </div>
    );
}