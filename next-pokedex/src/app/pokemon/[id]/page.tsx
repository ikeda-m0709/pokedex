import PokemonCard from "@/components/card";
import { fetchPokemon } from "@/lib/pokeapi"
import Link from 'next/link';
import { buttonVariants } from "@/components/ui/button"


export default async function PokemonPage({ params }: { params: { id: string }}) {
    const pokemon = await fetchPokemon({params});
    const currentId = Number(params.id);

    const prevId = currentId > 1 ? currentId - 1 : null;
    const nextId = currentId + 1;

    const [prevPokemon, nextPokemon] = await Promise.all([
        prevId ? fetchPokemon({ params: { id: String(prevId) }}) : null,
        fetchPokemon({ params: {id: String(nextId)}})
    ]);

    return (
        <div>
            <div>
                {prevPokemon && (
                    <Link href={`/pokemon/${prevPokemon.id}`}>
                        ⇐{prevPokemon.japaneseName}
                    </Link>
                )}
                {nextPokemon && (
                    <Link href={`/pokemon/${nextPokemon.id}`}>
                        {nextPokemon.japaneseName}⇒
                    </Link>
                )}
            </div>
            <PokemonCard  pokemon={pokemon}/>
            <Link className={buttonVariants({ variant: "default" })} href="/pokemon">一覧へ</Link>
        </div>
    );
}