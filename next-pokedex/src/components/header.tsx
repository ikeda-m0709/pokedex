"use client" //クライアントコンポーネントだよ、の宣言

import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation'

import clsx from "clsx";

const Header = () => {
    const pathname = usePathname();//現在のパスURLの取得

    const navigationItems = [
        { href: '/', label: 'ホーム'},
        { href: '/pokemon', label: 'ポケモン一覧'},
        { href: '/search', label: 'ポケモン検索'}
    ];

  return (
    <header className='bg-white'>
        <div className="flex items-center h-16 p-3 border-b border-gray-300">
            <Link href='/' className='text-xl mr-5 font-bold'>ポケモン図鑑</Link>
            <nav className='flex space-x-5'>
                {navigationItems.map((item) => (
                    <Link key={item.href} href={item.href} className={ clsx (pathname === item.href ? `text-blue-600 font-bold` : `text-gray-600`)}>{item.label}</Link>
                ))}
            </nav>
        </div>
    </header>
  )
}

export default Header
