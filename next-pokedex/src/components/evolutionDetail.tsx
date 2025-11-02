import Image from 'next/image'
import { EvolutionProf } from '@/lib/types'




export default async function EvolutionDetailPage({ data }: { data: EvolutionProf[] }) {

  return (
    <div>
        <h2>進化系統図</h2>
        <div>
          {data.map(p => (
            <div key={p.speciesName}>
              <Image src={p.imageUrl} alt="ポケモン画像" width="300" height="300" />
              <p>{p.japaneseName}</p>
            </div>
          ))}
            {/*ここに進化系統図を挿入 */}
        </div>
    </div>
  )
}