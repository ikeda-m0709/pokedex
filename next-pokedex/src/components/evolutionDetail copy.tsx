///////////////////先生の例



"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProcessedEvolutionChain, ProcessedChainLink } from '@/lib/types';

interface EvolutionChainProps {
  evolutionChain: ProcessedEvolutionChain;
  currentPokemonId: number;
}

/**
 * 進化系統図コンポーネント
 * ポケモンの進化系統を可視化して表示
 */
export function EvolutionChain({ evolutionChain, currentPokemonId }: EvolutionChainProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">進化系統図</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="flex flex-col gap-6 min-w-fit">
          <EvolutionNode 
            chainLink={evolutionChain.chain} 
            currentPokemonId={currentPokemonId}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface EvolutionNodeProps {
  chainLink: ProcessedChainLink;
  currentPokemonId: number;
}

/**
 * 進化ノードコンポーネント
 * 個別のポケモンと進化条件を表示
 */
function EvolutionNode({ chainLink, currentPokemonId }: EvolutionNodeProps) {
  const isCurrentPokemon = chainLink.pokemon.id === currentPokemonId;

  return (
    <div className="flex flex-col items-center">
      {/* 現在のポケモン */}
      <div className="flex flex-col items-center">
        <PokemonCard 
          pokemon={chainLink.pokemon} 
          isCurrentPokemon={isCurrentPokemon}
        />
      </div>

      {/* 進化先がある場合 */}
      {chainLink.evolvesTo.length > 0 && (
        <div className={`flex ${chainLink.evolvesTo.length > 1 ? 'flex-wrap justify-center gap-8' : 'flex-col items-center gap-4'} mt-4`}>
          {chainLink.evolvesTo.map((evolution) => (
            <div key={evolution.pokemon.id} className="flex flex-col items-center">
              {/* 進化条件の表示 */}
              {evolution.evolutionDetails.length > 0 && (
                <div className="flex flex-col items-center mb-4">
                  <ArrowRight className="h-6 w-6 text-gray-400 mb-2" />
                  <div className="flex flex-col gap-2">
                    {evolution.evolutionDetails.map((detail, detailIndex) => (
                      <EvolutionCondition 
                        key={detailIndex}
                        evolutionDetail={detail}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* 再帰的に次の進化を表示 */}
              <EvolutionNode 
                chainLink={evolution} 
                currentPokemonId={currentPokemonId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PokemonCardProps {
  pokemon: ProcessedEvolutionChain['chain']['pokemon'];
  isCurrentPokemon: boolean;
}

/**
 * 進化系統内のポケモンカードコンポーネント
 */
function PokemonCard({ pokemon, isCurrentPokemon }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isCurrentPokemon 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : 'hover:shadow-md'
      }`}>
        <CardContent className="p-4">
          <div className="text-center">
            {/* ポケモン画像 */}
            <div className="relative w-24 h-24 mx-auto mb-2">
              <Image
                src={pokemon.imageUrl}
                alt={pokemon.japaneseName || pokemon.name}
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            
            {/* ポケモン番号 */}
            <p className="text-xs text-gray-500 mb-1">
              No. {pokemon.id.toString().padStart(3, '0')}
            </p>
            
            {/* ポケモン名 */}
            <h3 className="text-sm font-semibold mb-2">
              {pokemon.japaneseName || pokemon.name}
            </h3>
            
            {/* タイプバッジ */}
            <div className="flex gap-1 justify-center flex-wrap">
              {pokemon.types.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>

            {/* 現在のポケモンの場合の表示 */}
            {isCurrentPokemon && (
              <Badge className="mt-2 bg-blue-500">
                現在表示中
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface EvolutionConditionProps {
  evolutionDetail: ProcessedEvolutionChain['chain']['evolutionDetails'][0];
}

/**
 * 進化条件表示コンポーネント
 */
function EvolutionCondition({ evolutionDetail }: EvolutionConditionProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-3 text-center min-w-[120px]">
      <div className="text-sm font-semibold text-gray-700 mb-1">
        {evolutionDetail.triggerJapanese}
      </div>
      
      {evolutionDetail.conditionsJapanese.length > 0 && (
        <div className="text-xs text-gray-600">
          {evolutionDetail.conditionsJapanese.map((condition, index) => (
            <div key={index}>{condition}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EvolutionChain;