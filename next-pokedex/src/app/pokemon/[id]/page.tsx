import PokemonCardDetail from "@/components/cardDetail";
import { fetchPokemon } from "@/lib/pokeapi"
import { getTotalPokemonCount } from "@/lib/pokeapi"
import Link from 'next/link';
import { buttonVariants } from "@/components/ui/button"

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
            <PokemonCardDetail  pokemon={pokemon}/>
            <Link className={buttonVariants({ variant: "default" })} href="/pokemon">一覧へ</Link>
        </div>
    );
}