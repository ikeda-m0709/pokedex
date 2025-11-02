import { EvolutionProf } from '@/lib/types'
import PokemonCard from '@/components/card'




export default async function EvolutionDetailPage({ data }: { data: EvolutionProf[] }) {

  return (
    <div>
        <h2>進化系統図</h2>
        <div>
          {data.map(p => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
    </div>
  )
}
