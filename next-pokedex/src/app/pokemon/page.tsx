import PokemonCard from '@/components/card';
import { getProcessdePokemonList } from '@/lib/pokeapi'
import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

  export default async function PokemonListContetnt({ searchParams}: { searchParams: {page: string}}) {
    const currentPage = Number(searchParams.page) || 1;
    const pokemons = await getProcessdePokemonList(currentPage);

  return (
    <div>
        <h1>ポケモン図鑑</h1>
        <p>画像をクリックして詳細を表示できます</p>
        <div>
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon}></PokemonCard>
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`/pokemon?page=${currentPage - 1}`} />
            </PaginationItem>
            {currentPage - 2 > 0 &&
            <PaginationItem>
              <PaginationLink href={`/pokemon?page=${currentPage - 2}`}>{currentPage - 2}</PaginationLink>
            </PaginationItem>
            }
            {currentPage - 1 > 0 &&
            <PaginationItem>
              <PaginationLink href={`/pokemon?page=${currentPage - 1}`}>{currentPage - 1}</PaginationLink>
            </PaginationItem>
            }
            <PaginationItem>
              <PaginationLink href={`/pokemon?page=${currentPage}`}>{currentPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/pokemon?page=${currentPage + 1}`}>{currentPage + 1}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/pokemon?page=${currentPage + 2}`}>{currentPage + 2}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis/>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={`/pokemon?page=${currentPage + 1}`}/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
    </div>
  )
  }