import Image from 'next/image'
import { EvolutionProf } from "@/lib/types"
import { Card,  CardContent } from "@/components/ui/card"
import Link from 'next/link'

type PokemonCardProps = {
    pokemon: EvolutionProf;
    cardClassName?: string;
}

export default async function PokemonCard({pokemon, cardClassName='text-2xl font-bold'}: PokemonCardProps) {

    return (
        <Card>
            <main>
                <Link href={`/pokemon/${pokemon.id}`}>
                <CardContent>
                    <Image src={pokemon.imageUrl} alt="ポケモン画像" width="300" height="300"/>
                    <p>No.{String(pokemon.id).padStart(3, "0")}</p>
                    <h2 className={cardClassName}>{pokemon.japaneseName}</h2>
                </CardContent>
                </Link>
            </main>
        </Card>
    );
}