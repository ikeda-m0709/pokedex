import EvolutionDetailPage from '@/components/evolutionDetail'
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button'

import { fetchPokemon, getEvolutionDetails, getEvolution, getEvolutionList, fetchRawPokemon, fetchJapaneseName } from '@/lib/pokeapi'
import { EvolutionProf, ProcessedEvolutionDetail } from '@/lib/types'
import { notFound } from 'next/navigation';


export default async function EvolutionPage({ params }: { params: { id: string } }) {
    const pokemon = await fetchPokemon(params.id);

        const chain = await getEvolution(params.id);
        if(!chain) return notFound();
        const evolutionList = getEvolutionList(chain);

        //Card.tsx用のデータ
        const evolutionProfs: (EvolutionProf | null)[] = await Promise.all(
          evolutionList.map(async e => {
            const raw = await fetchRawPokemon(e.species.name);//${BASE_URL}/pokemon/${id}は${BASE_URL}/pokemon/${name}でも同じ結果
            if(!raw) return null;
    
            const imageUrl = raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default;
            const japaneseName = await fetchJapaneseName(e.species);
    
            return {
              id:raw.id,
              imageUrl,
              japaneseName,
            };
        })
        );
        const filteredProfs:EvolutionProf[] = evolutionProfs.filter((p): p is EvolutionProf => p !== null);
        // 配列の中のnullを除外する。「p is EvolutionProf」は型ガード。(p => p !== null)だけだとnullじゃないことは分かったが、ちゃんとEvolutionProf型なのか分からない…となることがあるため
    
        //進化系統図内の進化条件表示用のデータ
        const evolutionDetailProfs: ProcessedEvolutionDetail[][] = await Promise.all(
          evolutionList.map(async e => {
            const details = await getEvolutionDetails(e);
            return details;
        })
        );

    
  return (
    <div>
        <h1>{pokemon.japaneseName}の進化系統</h1>
        <p>進化前・進化後のポケモンと進化条件を確認できます</p>
        <Link  className={buttonVariants({ variant: "outline" })} href={`/pokemon/${params.id}`}>⇐ 詳細ページに戻る</Link>
        <div>
          <div>
            {evolutionDetailProfs.map((details, index) => (

            ))}
          </div>
          <EvolutionDetailPage data={filteredProfs} />
        </div>
    </div>
  )
}