import { getEvolution, getEvolutionList, fetchRawPokemon, fetchJapaneseName } from '@/lib/pokeapi'
import { EvolutionProf } from '@/lib/types'
import { notFound } from 'next/navigation';
import Image from 'next/image'




export default async function EvolutionDetailPage({ params }: { params: { id: string } }) {
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
        <h2>進化系統図</h2>
        <div>
          {filteredProfs.map(p => (
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