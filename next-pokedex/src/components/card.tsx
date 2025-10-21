import Image from 'next/image'
import { ProcessedPokemon } from "@/lib/types"
import { Card,  CardContent } from "@/components/ui/card"
import Link from 'next/link'

export default async function PokemonCard({ pokemon }: {pokemon: ProcessedPokemon}) {

    return (
        <Card>
            <main>
                <Link href="/pokemon/params.id">
                <CardContent>
                    <Image src={pokemon.imageUrl} alt="ポケモン画像" width="300" height="300"/>
                    <p>No.{String(pokemon.id).padStart(3, "0")}</p>
                    <h2>{pokemon.japaneseName}</h2>
                </CardContent>
                </Link>
            </main>
        </Card>
    );
}