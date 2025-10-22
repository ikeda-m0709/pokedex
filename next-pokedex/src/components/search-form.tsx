import { useRouter } from "next/router";
import { useState } from "react";

interface SearchFormProps {
    initialQuery?: string;
}

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
   const [query, setQuery] = useState(initialQuery);
   const router = useRouter();

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //「ページの再読み込みを防ぐ」ための設定
    const searchButton = document.getElementById("searchButton") as HTMLButtonElement;
    const searchValue = searchButton.value;
    
    setQuery(searchValue);
    router.push('/search?q=${query}');

   }


    return (
        <form onSubmit={handleSubmit}>
            <input placeholder='ポケモンの名前を入力（カタカナ・ひらがな）'/>
            <button id="searchButton" type="submit">検索</button>
        </form>


    )
}