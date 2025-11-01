'use client'

import { useRouter } from "next/navigation";//Next.js 13以降の App Router（app/ ディレクトリ） では、従来の"next/router"は使用不可。代わりに⇐を使用する
import { useState } from "react";

interface SearchFormProps {
    initialQuery?: string;
}

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
   const [query, setQuery] = useState(initialQuery);//inputへの入力値の管理
   const router = useRouter();//URL変更に必要
   const [errorMessage, setErrorMessage] = useState("");//エラーメッセージの管理

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //「ページの再読み込みを防ぐ」ための設定
    const cleanedQuery = query.replace(/\s/g, '');//スペースを入力された値から除去する
    const inValid = /^[\u3040-\u309F\u30A0-\u30FF]+$/.test(cleanedQuery);//カタカナ・ひらがな以外の入力時にエラーを出す
    if(!inValid) {
        setErrorMessage("!「カタカナ」または「ひらがな」で入力してください");
        return ;
    }
    router.push(`/search?q=${cleanedQuery}`);
   }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input onChange={(e) => {
                    setQuery(e.target.value);
                    setErrorMessage("");//エラーメッセージの除去
                }}
                    value={query} 
                    type="text" 
                    placeholder='ポケモンの名前を入力（カタカナ・ひらがな）'
                 />
                <button type="submit">検索</button>
            </form>
            {errorMessage && (<p>{errorMessage}</p>) }
        </div>

    )
}