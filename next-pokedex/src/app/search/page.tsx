import { SearchForm } from '@/components/search-form'
import { SearchResult } from '@/components/search-result';
import React, { Suspense } from 'react'
import { Loading } from '@/components/loading';


interface SearchParams {
  q?: string;
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function Search ({searchParams}: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  return (
    <div>
        <h1>ポケモン検索</h1>
        <p>ポケモンの名前で検索できます（カタカナ・ひらがな）</p>
        
          <div>
            <SearchForm />
            {!query ? /*検索するとここに結果の画像やみつかりませんでしたの文言が表示される*/
              <p>上の検索フォームにポケモンの名前を入力してください</p> :
                <Suspense fallback={<Loading message = "検索中……"/>}>
                  <SearchResult query={query} />
                </Suspense> 
            }
          </div>
        
    </div>
  )
}

