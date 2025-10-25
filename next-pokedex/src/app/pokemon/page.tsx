import PokemonCard from '@/components/card';
import { getProcessdePokemonList } from '@/lib/pokeapi'
import { getPaginationRange } from '@/lib/pagination'
import React, { Suspense } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { getTotalPokemonCount } from '@/lib/pokeapi'
import { Loading} from '@/components/loadhing'

  export default async function PokemonListContetnt({ searchParams}: { searchParams: {page?: string}}) {
    //const currentPage = Number(searchParams?.page) || こちらだとawaitして、というエラーが出る
    const resolvedParams = await searchParams;
    const currentPage = Number(resolvedParams.page) || 1;
    const pokemons = await getProcessdePokemonList(currentPage);//現在のページ番号のポケモンたちを取得
    const totalCount = await getTotalPokemonCount();
    const totalPages = Math.ceil(totalCount / 20);

console.log(pokemons);
  return (
    <div>
        <h1>ポケモン図鑑</h1>
        <p>画像をクリックして詳細を表示できます</p>
        <Suspense fallback={<Loading />}>
          <div>
            {pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon}></PokemonCard>
            ))}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href={currentPage > 1 ? `/pokemon?page=${currentPage - 1}` : "#"}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
                </PaginationItem>

              {getPaginationRange(currentPage, totalPages).map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={`/pokemon?page=${page}`}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  href={currentPage < totalPages ? `/pokemon?page=${currentPage + 1}` : "#"}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}  
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Suspense>
    </div>
  )
  }




