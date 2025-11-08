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
        <div className="mx-7">
            <div className="mb-23">
                <div className="flex justify-between mt-5">
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
            </div>

            <div className='fixed bottom-0 right-0 mx-4 mb-6'>
                <Link className={buttonVariants({ variant: "default", size: "lg-custom" })} href="/pokemon">一覧へ</Link>
            </div>
        </div>
    );
}