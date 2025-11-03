import Link from 'next/link';
import { notFound } from 'next/navigation';

import { fetchPokemon, getEvolution, buildEvolutionSteps } from '@/lib/pokeapi'

import EvolutionDetailPage from '@/components/evolutionDetail'

import { buttonVariants } from '@/components/ui/button'



export default async function EvolutionPage({ params }: { params: { id: string } }) {
    const pokemon = await fetchPokemon(params.id); //現在のページのポケモン情報の取得

    const chain = await getEvolution(params.id); //現在のページのポケモンを元に、進化の起点のポケモンのchain情報の取得
    if(!chain) return notFound();

    const evolutionSteps = await buildEvolutionSteps(chain); //全ての進化段階と、各進化条件の取得

  return (
    <div>
        <h1>{pokemon.japaneseName}の進化系統</h1>
        <p>進化前・進化後のポケモンと進化条件を確認できます</p>
        <Link  className={buttonVariants({ variant: "outline" })} href={`/pokemon/${params.id}`}>⇐ 詳細ページに戻る</Link>
        <div>
          <EvolutionDetailPage data={evolutionSteps}/>
        </div>
    </div>
  )
}