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
      <div className="flex flex-col gap-1 w-32 sm:w-44 bg-white/10 border border-white/20 p-1.5 rounded-lg backdrop-blur-md shadow-xl relative z-10 transition-transform hover:scale-105">
        {[teams[0], teams[1]].map((teamName, i) => {
          const team = match ? (match.homeTeam.name === teamName ? match.homeTeam : match.awayTeam) : null
          return (
            <div key={i} className="flex items-center justify-between gap-1 px-1.5 py-1 bg-black/40 rounded border border-white/5">
              <span className="text-[10px] sm:text-xs font-bold text-white/90 truncate">{teamName.substring(0, 15)}</span>
              {team?.flagUrl ? (
                <img src={team.flagUrl} alt="" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/20 object-cover shrink-0" />
              ) : (
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/10 shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Círculo vacío para representar rondas futuras
  const EmptyNode = () => (
    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-polla-neon/20 border-2 border-polla-neon shadow-[0_0_10px_rgba(204,255,0,0.3)] shrink-0 z-10" />
  )

  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="min-w-[900px] flex justify-between relative bg-[#0a4d1a]/20 bg-gradient-to-b from-[#0a4d1a]/40 to-background rounded-3xl border border-polla-neon/30 p-4 sm:p-8 shadow-[0_0_30px_rgba(204,255,0,0.1)] overflow-hidden">
        
        {/* Líneas de conexión decorativas de fondo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* Lado Izquierdo */}
        <div className="flex gap-4 sm:gap-8 h-[900px]">
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
             
             {/* Trofeo (Usando un div dorado o imagen si existiera) */}
             <div className="w-32 h-48 md:w-40 md:h-64 mt-8 relative">
               <div className="absolute inset-0 bg-gradient-to-t from-yellow-500 via-yellow-300 to-yellow-600 rounded-t-full rounded-b-xl opacity-80 blur-[2px] shadow-[0_0_50px_rgba(255,215,0,0.5)]"></div>
               <div className="absolute inset-0 flex items-center justify-center text-5xl">🏆</div>
             </div>
             
             <div className="mt-8 flex flex-col items-center gap-2">
               <h3 className="text-white font-bold text-sm">3º Y 4º PUESTO</h3>
               <div className="flex gap-2">
                 <EmptyNode />
                 <EmptyNode />
               </div>
             </div>
           </div>
        </div>

        {/* Lado Derecho */}
        <div className="flex gap-4 sm:gap-8 h-[900px] flex-row-reverse">
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
