import React from 'react' //<React.Fragment>でラップしたい時にインポートが必要

import { evolutionStep } from '@/lib/types'

import PokemonCard from '@/components/card'



export default async function EvolutionDetailPage({ data }: {data: evolutionStep[]}) {

  return (
    <div>
        <h2>進化系統図</h2>
        <div>
          {data.map(p => (
            <div key={p.prof.id}>
              {data.length > 1 ? (
                <ul>
                  {p.details.map((d, i) => {
                    console.log("trigger:", d.trigger);
                    console.log("min_level:", d.min_level);
                    return (
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
                  );
                  })
                  }
                </ul>
              ) : <p>※進化なし</p>}

              <PokemonCard key={p.prof.id} pokemon={p.prof} />
            </div>
          ))}
        </div>
    </div>
  )
}
