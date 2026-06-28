'use client';
import { Match, Team } from '@prisma/client'
import Image from 'next/image'

type MatchWithTeams = Match & { homeTeam: Team, awayTeam: Team }

export function BracketView({ matches }: { matches: MatchWithTeams[] }) {
  const r32Matches = matches.filter(m => m.round === "16avos de Final")

  const getMatchByTeams = (t1: string, t2: string) => {
    return r32Matches.find(m => 
      (m.homeTeam.name === t1 && m.awayTeam.name === t2) || 
      (m.homeTeam.name === t2 && m.awayTeam.name === t1)
    )
  }

  const leftMatchups = [
    ["Alemania", "Paraguay"],
    ["Francia", "Suecia"],
    ["Sudáfrica", "Canadá"],
    ["Países Bajos", "Marruecos"],
    ["Portugal", "Croacia"],
    ["España", "Austria"],
    ["Estados Unidos", "Bosnia y Herzegovina"],
    ["Bélgica", "Senegal"],
  ]

  const rightMatchups = [
    ["Brasil", "Japón"],
    ["Costa de Marfil", "Noruega"],
    ["México", "Ecuador"],
    ["Inglaterra", "RD de Congo"],
    ["Argentina", "Cabo Verde"],
    ["Australia", "Egipto"],
    ["Suiza", "Argelia"],
    ["Colombia", "Ghana"],
  ]

  const BracketMatch = ({ teams }: { teams: string[] }) => {
    const match = getMatchByTeams(teams[0], teams[1])
    return (
      <div className="flex flex-col gap-1 w-36 sm:w-48 bg-black/70 border border-white/20 p-1.5 rounded-lg backdrop-blur-md shadow-2xl relative z-20 transition-all hover:scale-105 hover:border-polla-neon/50">
        {[teams[0], teams[1]].map((teamName, i) => {
          const team = match ? (match.homeTeam.name === teamName ? match.homeTeam : match.awayTeam) : null
          return (
            <div key={i} className="flex items-center justify-between gap-1 px-2 py-1.5 bg-gradient-to-r from-white/5 to-transparent rounded border border-white/5">
              <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide truncate drop-shadow-md">{teamName.substring(0, 15)}</span>
              {team?.flagUrl ? (
                <img src={team.flagUrl} alt="" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/10 object-cover shrink-0 shadow-lg" />
              ) : (
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Caja vacía sutil para representar rondas futuras
  const EmptyNode = () => (
    <div className="w-12 h-6 sm:w-16 sm:h-8 rounded bg-black/20 border border-white/5 shadow-inner shrink-0 z-10" />
  )

  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="min-w-[900px] flex justify-between relative rounded-3xl border border-polla-neon/30 p-4 sm:p-8 shadow-[0_0_30px_rgba(204,255,0,0.15)] overflow-hidden">
        
        {/* Fondo de Cancha Mejorado */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/pitch_bg.jpg" 
            alt="Cancha" 
            fill 
            className="object-cover opacity-30 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a4d1a]/80 via-background/90 to-background z-10" />
        </div>

        {/* Lado Izquierdo */}
        <div className="flex gap-4 sm:gap-8 h-[900px] z-10">
          <div className="flex flex-col justify-around h-full">
            <h3 className="text-white font-black text-center absolute top-4 left-8 text-xl">1/16</h3>
            {leftMatchups.map((teams, i) => (
               <BracketMatch key={i} teams={teams} />
            ))}
          </div>
          <div className="flex flex-col justify-around h-full py-[56px]">
            <h3 className="text-white font-black text-center absolute top-4 left-[240px] text-xl">1/8</h3>
            {[1,2,3,4].map(i => <EmptyNode key={`l8-${i}`} />)}
          </div>
          <div className="flex flex-col justify-around h-full py-[168px]">
            <h3 className="text-white font-black text-center absolute top-4 left-[300px] text-xl">1/4</h3>
            {[1,2].map(i => <EmptyNode key={`l4-${i}`} />)}
          </div>
        </div>

        {/* Centro - Copa y Final */}
        <div className="flex flex-col items-center justify-center flex-1 mx-4 relative h-[900px]">
           <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-wider mb-2 absolute top-10 text-center">
             MUNDIAL<br/><span className="text-polla-neon text-5xl">2026</span>
           </h1>

           <div className="flex flex-col items-center gap-8 mt-12 z-20">
             <h3 className="text-white font-black text-2xl tracking-widest">FINAL</h3>
             <div className="flex gap-4">
               <EmptyNode />
               <EmptyNode />
             </div>
             
             {/* Trofeo generado con transparencia por mix-blend-screen */}
             <div className="w-48 h-64 md:w-56 md:h-80 mt-4 relative z-30 flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 via-yellow-300/10 to-transparent rounded-full opacity-60 blur-[30px]"></div>
               <img src="/trofeo.jpg" alt="Copa Mundial" className="w-full h-full object-contain mix-blend-screen filter contrast-125 brightness-110 z-10" />
             </div>
             
             <div className="mt-8 flex flex-col items-center gap-2 z-20">
               <h3 className="text-white font-bold text-sm">3º Y 4º PUESTO</h3>
               <div className="flex gap-2">
                 <EmptyNode />
                 <EmptyNode />
               </div>
             </div>
           </div>
        </div>

        {/* Lado Derecho */}
        <div className="flex gap-4 sm:gap-8 h-[900px] flex-row-reverse z-10">
          <div className="flex flex-col justify-around h-full">
            <h3 className="text-white font-black text-center absolute top-4 right-8 text-xl">1/16</h3>
            {rightMatchups.map((teams, i) => (
               <BracketMatch key={i} teams={teams} />
            ))}
          </div>
          <div className="flex flex-col justify-around h-full py-[56px]">
            <h3 className="text-white font-black text-center absolute top-4 right-[240px] text-xl">1/8</h3>
            {[1,2,3,4].map(i => <EmptyNode key={`r8-${i}`} />)}
          </div>
          <div className="flex flex-col justify-around h-full py-[168px]">
            <h3 className="text-white font-black text-center absolute top-4 right-[300px] text-xl">1/4</h3>
            {[1,2].map(i => <EmptyNode key={`r4-${i}`} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
