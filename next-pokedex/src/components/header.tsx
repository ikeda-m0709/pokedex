"use client" //クライアントコンポーネントだよ、の宣言

import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
    const pathname = usePathname();//現在のパスURLの取得

    const navigationItems = [
        { href: '/', label: 'ホーム'},
        { href: '/pokemon', label: 'ポケモン一覧'},
        { href: '/search', label: 'ポケモン検索'}
    ];

  return (
    <header>
        <div className="flex items-center h-16">
            <Link href='/'>ポケモン図鑑</Link>
            <nav>
                {navigationItems.map((item) => (
                    <Link key={item.href} href={item.href} className={ pathname === item.href ? `text-blue-600 font-bold` : `text-gray-600`}>{item.label}</Link>
                ))}
            </nav>
        </div>
    </header>
  )
}

export default Header
