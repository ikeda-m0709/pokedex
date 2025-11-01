import EvolutionDetailPage from '@/components/evolutionDetail'
import { fetchPokemon } from '@/lib/pokeapi'
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button'


export default async function EvolutionPage({ params }: { params: { id: string } }) {
    const pokemon = await fetchPokemon(params.id);

  return (
    <div>
        <h1>{pokemon.japaneseName}の進化系統</h1>
        <p>進化前・進化後のポケモンと進化条件を確認できます</p>
            <Link  className={buttonVariants({ variant: "outline" })} href={`/pokemon/${params.id}`}>⇐ 詳細ページに戻る</Link>
        <EvolutionDetailPage />
    </div>
  )
}