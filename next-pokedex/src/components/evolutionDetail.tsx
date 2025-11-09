import React from 'react' //<React.Fragment>でラップしたい時にインポートが必要

import { evolutionStep } from '@/lib/types'

import PokemonCard from '@/components/card'

import { ChevronsDown } from 'lucide-react';


export default async function EvolutionDetailPage({ data }: {data: evolutionStep[]}) {
  const parent = data[0];
  const child = data.slice(1);

  return (
    <div className=' mx-auto max-w-4xl flex flex-col justify-items-center pb-7 border-2 border-orange-200 rounded-2xl bg-white'>
      <h2 className='text-2xl font-bold text-center'>進化系統図</h2>

      {/*1匹目とそれ以降全てのポケモンの箱*/}
      <div className='flex flex-col items-center'>

        {/*1匹目のポケモンの箱*/}
        <div className='mt-2'> {/*進化の起点のみ別表示 */}
          <div className='text-center max-w-40'>
            <PokemonCard key={parent.prof.id} pokemon={parent.prof} cardClassName='text-[1.1rem] font-bold'/>
            {data.length === 1 && <p className='mt-5 font-bold'>※進化系統なし</p>}
          </div>
        </div>

        {/*2匹目以降のポケモンの箱（必ず1度は進化するポケモンたち）*/}

        {/*自分(child[0])の前（最初）が多方向進化でなく（countparentBranching === 1）、自分が一方向進化か、進化なしの時（countBranching<=1）　※フシギダネ系orディグダ系
          それ以降全てmapでだして、col並べ
        */} 
        {(child.length > 0 && child[0].countParentBranching === 1 && child[0].countBranching <= 1) && (
          child.map(p => (
            <div className='flex flex-col items-center' key={p.prof.id}>
              <div className='flex flex-col items-center'>
                <div className='my-5 text-blue-500'>
                  <ChevronsDown size={40} />
                </div>
                <ul className='px-3 py-2 bg-emerald-100 rounded-2xl'>
                  {p.details.map((d, i) => (
                    <React.Fragment key={i}> {/*returnだけでなくmap()の時も、複数の要素を並べる時は必ず一つの親要素が必要。だが、ulの中にdivだとおかしいので、こちらでラップする */}
                      {d.trigger && <li className='font-bold mb-1'>【進化条件{i+1}: {d.trigger}】</li>}
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
                <PokemonCard key={p.prof.id} pokemon={p.prof} cardClassName='text-[1.1rem] font-bold'/>
              </div>
            </div>
          ))
        )}


        {/*自分(child[0])の前（最初）が多方向進化でなく（countparentBranching === 1）、自分が多方向進化の時（countBranching > 1）※ラルトス系
          自分をcolで出し、※1匹目と同じ
          次をmapでだしてrow並べ
        */} 
        {(child.length > 0 && child[0].countParentBranching === 1 && child[0].countBranching > 1) && (
        <div> 
          <div className='flex flex-col items-center' key={child[0].prof.id}>
            <div className='flex flex-col items-center'>
              <div className='my-5 text-blue-500'>
                <ChevronsDown size={40} />
              </div>
              <ul className='px-3 py-2 bg-emerald-100 rounded-2xl'>
                {child[0].details.map((d, i) => (
                  <React.Fragment key={i}> {/*returnだけでなくmap()の時も、複数の要素を並べる時は必ず一つの親要素が必要。だが、ulの中にdivだとおかしいので、こちらでラップする */}
                    {d.trigger && <li className='font-bold mb-1'>【進化条件{i+1}: {d.trigger}】</li>}
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
              <PokemonCard key={child[0].prof.id} pokemon={child[0].prof} cardClassName='text-[1.1rem] font-bold'/>
            </div>
          </div>

          <div className='flex flex-row gap-10'>
            {child.slice(1).map(p => (
              <div className='flex flex-col items-center' key={p.prof.id}>
                <div className='flex flex-col items-center'>
                    <div className='my-5 text-blue-500'>
                      <ChevronsDown size={40} />
                    </div>
                    <ul className='px-3 py-2 bg-emerald-100 rounded-2xl'>
                      {p.details.map((d, i) => (
                        <React.Fragment key={i}> {/*returnだけでなくmap()の時も、複数の要素を並べる時は必ず一つの親要素が必要。だが、ulの中にdivだとおかしいので、こちらでラップする */}
                          {d.trigger && <li className='font-bold mb-1'>【進化条件{i+1}: {d.trigger}】</li>}
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
                      ))}
                    </ul>
                </div>
                <div className='mt-3 text-center max-w-40'>
                  <PokemonCard key={p.prof.id} pokemon={p.prof} cardClassName='text-[1.1rem] font-bold'/>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}


        {/*自分(child[0])の前（最初）が多方向進化で（countParentBranching > 1）、
        ①自分は進化なし（countBranching === 0）、②自分も進化有り（countBranching > 0）の時
         ①を全てmapでだしてrow並べにし、その後に②を出してrow並べ(右側寄せ)
        */} 
        {child.length > 0 && child[0].countParentBranching > 1 && (
          <div>
            <div className='m-5 px-5 pb-5 flex flex-row flex-wrap justify-center gap-10 bg-[lab(97_-1.5_0.5)] rounded-2xl'>
              {/*①の自分は進化なしを先に表示する */}
              {child
                .filter(p => p.countParentBranching > 1)
                .map(p => {                
                return (
                  <div className='flex flex-col items-center' key={p.prof.id}>
                    <div className='flex flex-col items-center'>
                      <div className='my-5 text-blue-500'>
                        <ChevronsDown size={40} />
                      </div>
                      <ul className='px-3 py-2 bg-emerald-100 rounded-2xl'>
                        {p.details.map((d, i) => (
                          <React.Fragment key={i}> {/*returnだけでなくmap()の時も、複数の要素を並べる時は必ず一つの親要素が必要。だが、ulの中にdivだとおかしいので、こちらでラップする */}
                            {d.trigger && <li className='font-bold mb-1'>【進化条件{i+1}: {d.trigger}】</li>}
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
                          ))}
                      </ul>
                    </div>
                    <div className='mt-3 text-center max-w-40'>
                      <PokemonCard key={p.prof.id} pokemon={p.prof} cardClassName='text-[1.1rem] font-bold'/>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className='m-5 px-5 pb-5 flex flex-row flex-wrap justify-end gap-10 bg-[lab(97_-1.5_0.5)] rounded-2xl'>
              {/*②の自分も進化有りを後に表示する */}
              {child
                .filter(p => p.countParentBranching === 1)
                .map(p => {
                
                return (
                  <div className='flex flex-col items-center' key={p.prof.id}>
                    <div className='flex flex-col items-center'>
                      <div className='my-5 text-blue-500'>
                        <ChevronsDown size={40} />
                      </div>
                      <ul className='px-3 py-2 bg-emerald-100 rounded-2xl'>
                        {p.details.map((d, i) => (
                          <React.Fragment key={i}> {/*returnだけでなくmap()の時も、複数の要素を並べる時は必ず一つの親要素が必要。だが、ulの中にdivだとおかしいので、こちらでラップする */}
                            {d.trigger && <li className='font-bold mb-1'>【進化条件{i+1}: {d.trigger}】</li>}
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
                          ))}
                      </ul>
                    </div>
                    <div className='mt-3 text-center max-w-40'>
                      <PokemonCard key={p.prof.id} pokemon={p.prof} cardClassName='text-[1.1rem] font-bold'/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>{/*1匹目とそれ以降全てのポケモンの箱の閉じ*/}
    </div>
  )
}



