import { SearchForm } from '@/components/search-form'
import React from 'react'

const Search = () => {
  return (
    <div>
        <h1>ポケモン検索</h1>
        <p>ポケモンの名前で検索できます（カタカナ・ひらがな）</p>
        <div>
          <SearchForm />
          <p>上の検索フォームにポケモンの名前を入力してください</p>{/*検索するとここに結果の画像やみつかりませんでしたの文言が表示される*/}
        </div>
    </div>
  )
}

export default Search