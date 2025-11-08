import React from 'react' //<React.Fragment>でラップしたい時にインポートが必要

import { evolutionStep } from '@/lib/types'

import PokemonCard from '@/components/card'

import { ChevronsDown } from 'lucide-react';


//修正前

export default async function EvolutionDetailPage1000({ data }: {data: evolutionStep[]}) {

  return (
    <div className='pb-7 justify-items-center border-2 border-amber-700 rounded-2xl bg-blue-700'>
        <h2 className='text-2xl font-bold'>進化系統図</h2>
        <div className='flex flex-col space-y-5  bg-amber-400'>
          {data.map(p => (
            <div className=' justify-items-center bg-emerald-700' key={p.prof.id}>
              {/* ↓の二つの条件分岐は、進化の有無と、進化条件の有無（無ければulを作らない）*/}
              {data.length > 1 ? (
                p.details.length > 0 &&(
                <div>
                  <div className='bg-fuchsia-800 mb-5 text-blue-200 justify-items-center'>
                    <ChevronsDown size={40} />
                  </div>
                  <ul className='px-3 py-2 bg-red-400 rounded-2xl'>
                    {p.details.map((d, i) => (
                      <React.Fragment key={i}> {/*returnだけでなくmap()の時も、複数の要素を並べる時は必ず一つの親要素が必要。だが、ulの中にdivだとおかしいので、こちらでラップする */}
                        {d.trigger && <li>【進化条件{i+1}（きっかけ：{d.trigger}）】</li>}
                        {d.item && <li>アイテム：{d.item}</li>}
                        {d.gender &&(
                          <li>
                          {d.gender === 1
                            ? "性別：メス"
                            : d.gender === 2
                            ? "性別：オス"
                            : "性別：不明"}
                          </li>
                        )}
                        {d.held_item && <li>持ち物：{d.held_item}</li>}
                        {d.known_move && <li>覚えている技：{d.known_move}</li>}
                        {d.known_move_type && <li>覚えている技タイプ：{d.known_move_type}</li>}
                        {d.location && <li>場所：{d.location}</li>}
                        {d.min_level && <li>レベル：Lv.{d.min_level}以上</li>}
                        {d.min_happiness && <li>なつき度:{d.min_happiness}以上</li>}
                        {d.min_beauty && <li>美しさ：{d.min_beauty}以上</li>}
                        {d.min_affection && <li>なかよし度：{d.min_affection}</li>}
                        {d.needs_overworld_rain === true && <li>天候：雨</li>}
                        {d.party_species && <li>手持ち：{d.party_species}</li>}
                        {d.party_type && <li>手持ちタイプ：{d.party_type}</li>}
                        {d.relative_physical_stats !== null && (
                          <li>
                            {d.relative_physical_stats === 1
                              ? "ステータス：攻撃 > 防御"
                              : d.relative_physical_stats === 0
                              ? "ステータス：攻撃 = 防御"
                              : "ステータス：攻撃 < 防御"}
                          </li>
                        )}
                        {d.time_of_day !== null && (
                          <li>
                            {d.time_of_day === "day" && "時間帯：昼"}
                            {d.time_of_day === "night" && "時間帯：夜"}
                          </li>
                        )}
                        {d.trade_species && <li>交換相手：{d.trade_species}</li>}
                        {d.turn_upside_down === true && <li>本体操作：本体を逆さにしてレベルアップ</li>}
                      </React.Fragment>
                      ))
                    }
                  </ul>
                </div>
                )
              ) : <p>※進化なし</p>}
              <div className='mt-3 text-center max-w-60'>
                <PokemonCard key={p.prof.id} pokemon={p.prof} />
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

/*
                <div className=' mt-5 text-blue-200 justify-items-center'>
                  <ChevronsDown size={40} />
                </div>

*/

import React from 'react' //<React.Fragment>でラップしたい時にインポートが必要

import { evolutionStep } from '@/lib/types'

import PokemonCard from '@/components/card'

import { ChevronsDown } from 'lucide-react';


//失敗した修正１

export default async function EvolutionDetailPage2000({ data }: {data: evolutionStep[]}) {
  const parent = data[0];
  const child = data.slice(1);

  console.log(child[0].isBranching);

  return (
    <div className='flex flex-col justify-items-center pb-7 border-2 border-amber-700 rounded-2xl bg-blue-700'>
      <h2 className='text-2xl font-bold'>進化系統図</h2>

      <div className='flex flex-col items-center'>

        <div className='bg-amber-400'> {/*進化の起点のみ別表示にし、分岐進化は */}
          <div className='bg-amber-50  text-center max-w-40'>
            <PokemonCard key={parent.prof.id} pokemon={parent.prof} />
          </div>
        </div>

        <div className={parent.isBranching && !child[a].isBranching ? 'flex flex-row flex-wrap justify-center' : 'flex flex-col items-center'}>
          {child.length > 0 ? (
            child.map(p => (
              <div className='flex flex-col items-center bg-emerald-700' key={p.prof.id}>
                  <div className='flex flex-col items-center'>
                    <div className=' bg-fuchsia-800 mb-5 text-blue-200'>
                      <ChevronsDown size={40} />
                    </div>
                    <ul className='px-3 py-2 bg-red-400 rounded-2xl'>
                      {p.details.map((d, i) => (
                        <React.Fragment key={i}> {/*returnだけでなくmap()の時も、複数の要素を並べる時は必ず一つの親要素が必要。だが、ulの中にdivだとおかしいので、こちらでラップする */}
                          {d.trigger && <li>【進化条件{i+1}: {d.trigger}】</li>}
                          {d.item && <li>アイテム：{d.item}</li>}
                          {d.gender &&(
                            <li>
                            {d.gender === 1
                              ? "性別：メス"
                              : d.gender === 2
                              ? "性別：オス"
                              : "性別：不明"}
                            </li>
                          )}
                          {d.held_item && <li>持ち物：{d.held_item}</li>}
                          {d.known_move && <li>覚えている技：{d.known_move}</li>}
                          {d.known_move_type && <li>覚えている技タイプ：{d.known_move_type}</li>}
                          {d.location && <li>場所：{d.location}</li>}
                          {d.min_level && <li>レベル：Lv.{d.min_level}以上</li>}
                          {d.min_happiness && <li>なつき度:{d.min_happiness}以上</li>}
                          {d.min_beauty && <li>美しさ：{d.min_beauty}以上</li>}
                          {d.min_affection && <li>なかよし度：{d.min_affection}</li>}
                          {d.needs_overworld_rain === true && <li>天候：雨</li>}
                          {d.party_species && <li>手持ち：{d.party_species}</li>}
                          {d.party_type && <li>手持ちタイプ：{d.party_type}</li>}
                          {d.relative_physical_stats !== null && (
                            <li>
                              {d.relative_physical_stats === 1
                                ? "ステータス：攻撃 > 防御"
                                : d.relative_physical_stats === 0
                                ? "ステータス：攻撃 = 防御"
                                : "ステータス：攻撃 < 防御"}
                            </li>
                          )}
                          {d.time_of_day !== null && (
                            <li>
                              {d.time_of_day === "day" && "時間帯：昼"}
                              {d.time_of_day === "night" && "時間帯：夜"}
                            </li>
                          )}
                          {d.trade_species && <li>交換相手：{d.trade_species}</li>}
                          {d.turn_upside_down === true && <li>本体操作：本体を逆さにしてレベルアップ</li>}
                        </React.Fragment>
                        ))
                      }
                    </ul>
                  </div>
              <div className='mt-3 text-center max-w-40'>
                <PokemonCard key={p.prof.id} pokemon={p.prof} />
              </div>
            </div>
            ))
          )
          : <p>※進化なし</p>}
        </div>
        </div>
    </div>
  )
}









