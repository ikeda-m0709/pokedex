import Image from 'next/image'
import { ProcessedPokemon } from "@/lib/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Suspense } from 'react'
import { Loading } from './loading';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"


export default async function PokemonDetail({ pokemon }: {pokemon: ProcessedPokemon}) {

    return (
        <Suspense fallback={<Loading />}>
            <Card className='mt-4 max-w-4xl mx-auto'>
                <main>
                    <div className='text-center'>
                        <CardHeader>
                            <p>{`No.${String(pokemon.id).padStart(3, "0")}`}</p>
                        </CardHeader>
                        <CardTitle className=''>
                            <h2>{pokemon.japaneseName}</h2>
                        </CardTitle>
                    </div>
                    <CardContent className='grid grid-cols-2 gap-5 mt-5'>
                        <div className='flex justify-center items-center'>
                            <Image src={pokemon.imageUrl} alt="ポケモン画像" width="320" height="320" className='max-w-full max-h-full'/>
                        </div>
                        <div className='py-5 px-10'>
                            <div>
                                <h3>基本情報</h3>
                                <div className='mt-2 ml-1'>
                                    <p>分類： {pokemon.genus}</p>
                                    <p className='mt-1'>高さ： {pokemon.height}m</p>
                                    <p className='mt-1'>重さ： {pokemon.weight}kg</p>
                                </div>
                            </div>
                            <div className='mt-12'>
                                <h3>タイプ</h3>
                                <div className='mt-2 ml-1'>
                                    {pokemon.types.map((t, index) => (
                                        <Badge className='mr-2' variant="secondary" key={index}>{t}</Badge>
                                    ))} 
                                </div>
                            </div>
                            <div className='mt-12'>
                                <h3 className='mb-2'>特性</h3>
                                    <div className=' ml-1 space-y-3'>
                                    {pokemon.abilities.map((ability, index) => (
                                        <ul  className='py-2 px-3 border-2 border-orange-100 rounded-2xl' key={index}>
                                            <li className='font-medium'>{ability.name}</li>
                                            <li className='mt-1.5'>{ability.effect}</li>
                                        </ul>
                                    ))}
                                </div>
                            </div>
                            <div className='mt-10'>
                                <h3>進化系統</h3>
                                <div className='mt-2  ml-1'>
                                    <Link className={buttonVariants({ variant: "outline", size:"icon-custom" })} href={`/evolution/${pokemon.id}`}>進化系統ページへ</Link>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </main>
            </Card>
        </Suspense>
    );
}