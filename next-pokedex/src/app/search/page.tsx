import { SearchForm } from '@/components/search-form'
import { SearchResult } from '@/components/search-result';
import React, { Suspense } from 'react'
import { Loading } from '@/components/loading';

import Link from 'next/link';
import { buttonVariants } from "@/components/ui/button"


interface Props {
  searchParams:{ q?: string; page?: string;}
}

export default async function Search ({searchParams}: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  return (
    <div className='text-center'>
        <h1>ポケモン検索</h1>
        <p className='mt-3 text-lg'>ポケモンの名前で検索できます（カタカナ・ひらがなOK）</p>
        
          <div className='mt-10'> {/*検索欄の上部のmargin */}
            <SearchForm />
            <div className='mt-13'>
              {!query ? /*検索するとここに結果の画像やみつかりませんでしたの文言が表示される*/
                <p className='mt-5'>上の検索フォームにポケモンの名前を入力してください</p> :
                  <Suspense fallback={<Loading message = "検索中……"/>}>
                    <SearchResult query={query} />
                  </Suspense> 
              }
            </div>
          </div>
          <div className='fixed bottom-0 right-0 mx-4 mb-6'>
            <Link className={buttonVariants({ variant: "default", size: "lg-custom" })} href="/pokemon">一覧へ</Link>
          </div>  
    </div>
  )
}

