import EvolutionDetailPage from '@/components/evolutionDetail'
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button'

import { fetchPokemon } from '@/lib/pokeapi'
import { getEvolution, getEvolutionList, fetchRawPokemon, fetchJapaneseName } from '@/lib/pokeapi'
import { EvolutionProf } from '@/lib/types'
import { notFound } from 'next/navigation';


export default async function EvolutionPage({ params }: { params: { id: string } }) {
    const pokemon = await fetchPokemon(params.id);

        const chain = await getEvolution(params.id);
        if(!chain) return notFound();
        const evolutionList = getEvolutionList(chain);
        const evolutionProfs: (EvolutionProf | null)[] = await Promise.all(
          evolutionList.map(async e => {
            const raw = await fetchRawPokemon(e.species.name);
            if(!raw) return null;
    
            const imageUrl = raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default;
            const japaneseName = await fetchJapaneseName(e.species);
    
            return {
              imageUrl,
              japaneseName,
              speciesName: e.species.name,//keyにしたいからこれも返す
            };
        })
        );
        const filteredProfs:EvolutionProf[] = evolutionProfs.filter((p): p is EvolutionProf => p !== null);
        // 配列の中のnullを除外する。「p is EvolutionProf」は型ガード。(p => p !== null)だけだとnullじゃないことは分かったが、ちゃんとEvolutionProf型なのか分からない…となることがあるため
    
    
  return (
    <div>
        <h1>{pokemon.japaneseName}の進化系統</h1>
        <p>進化前・進化後のポケモンと進化条件を確認できます</p>
            <Link  className={buttonVariants({ variant: "outline" })} href={`/pokemon/${params.id}`}>⇐ 詳細ページに戻る</Link>
        <EvolutionDetailPage data={filteredProfs} />
    </div>
  )
}